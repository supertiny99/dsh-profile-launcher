// launcher-core.js — 纯逻辑层：profile home 发现 / manifest 解析 / app 路径探测 /
// 启动命令构造 / 运行状态检测 / 当前 profile 识别。
// 全部依赖注入（fs / 进程信息经参数传入），无副作用，可直接单测。
// 当前 profile 识别链复刻自 plugin-guardian guardian-core.js resolveProfileDir
// （pm 队列 #3 plugin-kit 共享层抽取前先复制精简版，来源注明）。

import { basename, join } from 'node:path';

/** home 目录名 → 展示名（.dsh → default，.dsh-dev → dev） */
export function homeDisplayName(homeName) {
	if (homeName === '.dsh') return 'default';
	if (homeName.startsWith('.dsh-')) return homeName.slice(5);
	return homeName;
}

/**
 * 发现本机全部 profile home（两级，pl-CHG-002 扩展）。
 * 规则：homedir 下以 `.dsh` 开头的目录全部收录，按 `profiles/desktop/package.json`
 * 是否存在标记 initialized——完整 home（宿主已初始化）与待初始化 home
 * （新建的空目录 / `.dsh-235` 类不完整环境，首次启动时由宿主自动完成初始化）。
 * @param {{ homedir: string, readdir: (dir: string) => Promise<string[]>, isFile: (p: string) => Promise<boolean> }} io
 * @returns {Promise<Array<{ name: string, displayName: string, homePath: string, profilePath: string, initialized: boolean }>>}
 */
export async function discoverProfileHomes(io) {
	const names = await io.readdir(io.homedir);
	const candidates = names.filter((n) => n.startsWith('.dsh')).sort();
	const homes = [];
	for (const name of candidates) {
		const homePath = join(io.homedir, name);
		const profilePath = join(homePath, 'profiles', 'desktop');
		const initialized = await io.isFile(join(profilePath, 'package.json'));
		homes.push({ name, displayName: homeDisplayName(name), homePath, profilePath, initialized });
	}
	return homes;
}

/**
 * 解析 profile manifest：激活 bundles（dsh.profile.bundles）与安装依赖计数。
 * 解析失败返回 null（损坏的 home 不应拖垮整个面板）。
 * @param {{ readJson: (p: string) => Promise<object|null> }} io
 * @param {string} profilePath
 */
export async function parseProfileMeta(io, profilePath) {
	const pkg = await io.readJson(join(profilePath, 'package.json'));
	if (!pkg || typeof pkg !== 'object') return null;
	const bundles = Array.isArray(pkg?.dsh?.profile?.bundles)
		? pkg.dsh.profile.bundles.filter((b) => typeof b === 'string')
		: [];
	const dependencyNames = pkg.dependencies && typeof pkg.dependencies === 'object' ? Object.keys(pkg.dependencies) : [];
	return { bundles, bundleCount: bundles.length, dependencyCount: dependencyNames.length };
}

/**
 * 分层探测官方 app 可执行文件：候选路径依次做存在性校验，第一个命中者胜出。
 * 候选由调用方构造（宿主进程 argv[0] / process.execPath / /Applications 硬编码兜底）。
 * @param {string[]} candidates
 * @param {(p: string) => boolean} existsFn
 * @returns {string|null}
 */
export function resolveAppPath(candidates, existsFn) {
	for (const candidate of candidates) {
		if (typeof candidate === 'string' && candidate.length > 0 && existsFn(candidate)) return candidate;
	}
	return null;
}

/**
 * 构造启动计划：DSH_HOME 路由目标 profile + 独立 user-data-dir 绕单实例锁双开。
 * 参数全部内部构造（homePath 需先经白名单校验），不透传任何调用方原始输入。
 * user-data-dir 落位 <home>/desktop-user-data：随 home 生命周期，删 home 一起清理。
 * @param {{ homePath: string, appPath: string }} input
 * @returns {{ cmd: string, args: string[], env: Record<string, string> }}
 */
export function buildLaunchPlan({ homePath, appPath }) {
	return {
		cmd: appPath,
		args: [`--user-data-dir=${join(homePath, 'desktop-user-data')}`],
		env: { DSH_HOME: homePath },
	};
}

/**
 * 从进程列表输出（如 pgrep -fl）中检测各 profile 是否有 host 进程在跑。
 * 匹配规则：每行按空白切 token，与 profile 绝对路径**全等比较**——
 * host 进程 argv 中 profile 路径是独立参数（实证），token 全等可防
 * `/.dsh/profiles/desktop` 误匹配 `/.dsh-dev/profiles/desktop` 的前缀歧义。
 * @param {string[]} psLines
 * @param {string[]} profilePaths
 * @returns {Set<string>} 运行中的 profilePath 集合
 */
export function detectRunningProfiles(psLines, profilePaths) {
	const running = new Set();
	const wanted = new Set(profilePaths);
	for (const line of psLines ?? []) {
		if (!line.includes('/profiles/desktop')) continue;
		for (const token of line.split(/\s+/)) {
			if (wanted.has(token)) running.add(token);
		}
	}
	return running;
}

/**
 * 校验新建 profile 名称：1-32 位，小写字母/数字/连字符，不以连字符开头或结尾。
 * @param {string} name
 * @returns {{ ok: true } | { ok: false, reason: string }}
 */
const PROFILE_NAME_RE = /^[a-z0-9]([a-z0-9-]{0,30}[a-z0-9])?$/;
export function validateProfileName(name) {
	if (typeof name !== 'string' || name.trim().length === 0) return { ok: false, reason: '名称不能为空' };
	if (name.length > 32) return { ok: false, reason: '名称不能超过 32 个字符' };
	if (!PROFILE_NAME_RE.test(name)) {
		return { ok: false, reason: '仅允许小写字母、数字、连字符，且不能以连字符开头或结尾' };
	}
	return { ok: true };
}

/**
 * 从进程列表输出（如 pgrep -fl）中定位某 home 的桌面版**主进程** pid（pl-CHG-002 停止操作用）。
 * 匹配规则：行内 token 全等 `--user-data-dir=<home>/desktop-user-data`（每 home 唯一），
 * 且行不含 `--type=`（GPU/network/renderer 等 helper 的 argv 带 --type=，主进程不带——
 * 2026-11-17 实证：SIGTERM 主进程即可让整棵进程树 1s 内退出）。
 * @param {string[]} psLines
 * @param {string} homePath
 * @returns {number[]} 主进程 pid 列表（正常应恰好 1 个；同 user-data-dir 单实例锁保证）
 */
export function findInstanceMainPids(psLines, homePath) {
	const marker = `--user-data-dir=${join(homePath, 'desktop-user-data')}`;
	const pids = [];
	for (const line of psLines ?? []) {
		if (line.includes('--type=')) continue;
		if (!line.split(/\s+/).includes(marker)) continue;
		const pid = Number.parseInt(line.trim().split(/\s+/)[0], 10);
		if (Number.isInteger(pid) && pid > 0) pids.push(pid);
	}
	return pids;
}

/**
 * 识别当前实例所在 profile（白名单优先级：显式 env > argv 宿主路径 > DSH_HOME 推导 > 默认 ~/.dsh）。
 * 复刻 plugin-guardian resolveProfileDir 判定链（精简版）。
 * @param {{ env: object, argv: string[], existsFn: (p: string) => boolean, homedir: string }} input
 * @returns {string} 当前 profile 目录绝对路径
 */
export function resolveCurrentProfileDir({ env, argv, existsFn, homedir }) {
	const fromEnv = env.DSH_PROFILE_DIR;
	if (typeof fromEnv === 'string' && fromEnv.trim().length > 0 && existsFn(join(fromEnv, 'package.json'))) {
		return fromEnv;
	}
	const fromArgv = argv.find((a) => a.includes('/profiles/') && existsFn(join(a, 'package.json')));
	if (fromArgv) return fromArgv;
	if (typeof env.DSH_HOME === 'string' && env.DSH_HOME.trim().length > 0) {
		const derived = join(env.DSH_HOME, 'profiles', 'desktop');
		if (existsFn(join(derived, 'package.json'))) return derived;
	}
	return join(homedir, '.dsh', 'profiles', 'desktop');
}

/** home 路径 → home 名（用于卡片标题兜底） */
export function homeNameOf(homePath) {
	return basename(homePath);
}

/**
 * 配置继承清单（pl-CHG-003）：新建 home 时可从既有 profile 字节级复制的三件套。
 * settings.yaml = 模型 provider 定义（宿主官方一次性导入机制：按顶层 section 写入
 * 同 id Cordis 条目后改名 .imported，spike 活体实证）；.credentials.yaml = API key
 * refs（0600，宿主原样接受）；.env = apiKeyEnv 注入。
 */
export const INHERIT_FILES = ['settings.yaml', '.credentials.yaml', '.env'];

/**
 * 规划配置继承复制清单：来源 home 中实际存在的继承文件逐一生成计划，缺失跳过。
 * mode 取来源文件实际权限位（.credentials.yaml / settings.yaml 实测 0600，须保持）。
 * @param {{ stat: (p: string) => Promise<{ isFile: () => boolean, mode: number } | null> }} io
 * @param {string} sourceHomePath 白名单校验后的来源 home 绝对路径
 * @param {string} destHomePath 新建 home 绝对路径
 * @returns {Promise<Array<{ file: string, src: string, dest: string, mode: number }>>}
 */
export async function planConfigInherit(io, sourceHomePath, destHomePath) {
	const plans = [];
	for (const file of INHERIT_FILES) {
		const st = await io.stat(join(sourceHomePath, file));
		if (!st || !st.isFile()) continue;
		plans.push({
			file,
			src: join(sourceHomePath, file),
			dest: join(destHomePath, file),
			mode: st.mode & 0o777,
		});
	}
	return plans;
}
