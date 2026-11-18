// @supertiny99/dsh-profile-launcher — Host 半入口
// webServer 前缀路由 /profile-launcher：
//   GET  /profiles  发现全部 profile home（两级：完整/待初始化）+ 运行状态 + 当前实例标记
//   POST /launch    白名单校验后 spawn detached 官方 app（DSH_HOME + --user-data-dir 隔离双开）
//   POST /create    名称校验后建纯空目录 + 可选配置继承（pl-CHG-003；零预置约束仅限
//                   profiles/ 工作区——预置 package.json 是唯一已证崩溃源；home 顶层
//                   settings.yaml 等是宿主官方导入机制的正道，spike 活体实证）
//   POST /stop      定位主进程 SIGTERM 优雅退出（pl-CHG-002；实证 1s 全树清零）
//   POST /delete    状态防护后真删 home 整目录（pl-CHG-002；运行中/当前实例/未知态拒绝）
import { spawn, execFile } from 'node:child_process';
import { chmodSync, copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';

import {
	discoverProfileHomes,
	parseProfileMeta,
	resolveAppPath,
	buildLaunchPlan,
	detectRunningProfiles,
	resolveCurrentProfileDir,
	validateProfileName,
	findInstanceMainPids,
	planConfigInherit,
	planBadgeInject,
	planBadgeRemove,
	resolvePnpmEntry,
} from './launcher-core.js';

const APP_FALLBACK = '/Applications/DeepSeek Harness.app/Contents/MacOS/DeepSeek Harness';
/** app 二进制探测候选：宿主进程自省优先（随 app 更新/改名稳定），硬编码兜底 */
const appPathCandidates = () => [process.argv[0], process.execPath, APP_FALLBACK];

/** 注入安装强制走 npm 官方源：刚发布的新版本在用户环境镜像（npmmirror 等）上必然滞后 */
const REGISTRY_OFFICIAL = 'https://registry.npmjs.org';

/**
 * 内嵌 badge 包目录（pl-CHG-005）：<本 profile>/node_modules/@supertiny99/dsh-profile-launcher/dist/badge。
 * 不用 import.meta.url 推导（v0.4.1 实证部分宿主加载形态下不可用，报 path undefined）——
 * launcher 自身必装在本 profile 的 node_modules（npm/link/file/tgz 四种 spec 落位一致，
 * symlink 由 fs 层透明跟随），注入操作只可能从 launcher 所在 profile 发起，推导恒成立。
 */
const badgeDistDir = () =>
	join(
		resolveCurrentProfileDir({
			env: process.env,
			argv: process.argv,
			existsFn: existsSync,
			homedir: fsIo.homedir,
		}),
		'node_modules',
		'@supertiny99',
		'dsh-profile-launcher',
		'dist',
		'badge'
	);

/**
 * pnpm install 执行器（pl-CHG-005；plugin-guardian pg-CHG-001~004 实证参数）：
 * runtime pnpm.mjs 优先（host argv 携带路径，锁 process.execPath 免环境漂移），
 * 兜底系统 pnpm；verify-deps-before-run 关闭防宿主内嵌校验卡死；
 * **强制官方 registry**（v0.4.1 实证：用户环境 ~/.npmrc 镜像（npmmirror）同步滞后，
 * 刚发布的新版本在镜像上 No matching version——注入的新版本必须从官方源解析）。
 * @param {string} cwd 目标 profile 工作区目录
 * @returns {Promise<{ ok: boolean, log: string }>}
 */
function pnpmInstall(cwd) {
	const args = ['install', '--config.verify-deps-before-run=false', `--registry=${REGISTRY_OFFICIAL}`];
	const pnpmEntry = resolvePnpmEntry(process.argv, existsSync);
	const useNodeScript = Boolean(pnpmEntry);
	const cmd = useNodeScript ? process.execPath : 'pnpm';
	if (useNodeScript) args.unshift(pnpmEntry);
	return new Promise((resolvePromise) => {
		execFile(
			cmd,
			args,
			{
				cwd,
				timeout: 120_000,
				env: {
					...process.env,
					npm_config_verify_deps_before_run: 'false',
					PATH: `${dirname(process.execPath)}:/usr/local/bin:/usr/bin:/bin:/opt/homebrew/bin:${process.env.PATH || ''}`,
				},
			},
			(err, stdout, stderr) => {
				const log = `${stdout || ''}\n${stderr || ''}`.trim();
				resolvePromise({ ok: !err, log: log.slice(-2000) });
			}
		);
	});
}

/**
 * 读取目标 profile 的 package.json 原文（注入/移除前置）。
 * @returns {Promise<{ raw: object, path: string } | { error: string }>}
 */
async function readProfilePackage(home) {
	const pkgPath = join(home.profilePath, 'package.json');
	try {
		const raw = JSON.parse(readFileSync(pkgPath, 'utf8'));
		return { raw, path: pkgPath };
	} catch (err) {
		return { error: `profiles/desktop/package.json 不可读：${err instanceof Error ? err.message : String(err)}` };
	}
}

/** 适配层：把 node fs 包成 launcher-core 注入接口 */
const fsIo = {
	homedir: homedir(),
	readdir: async (dir) => readdirSync(dir, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name),
	isFile: async (p) => existsSync(p),
	stat: async (p) => {
		try {
			return statSync(p);
		} catch {
			return null;
		}
	},
	readJson: async (p) => {
		try {
			return JSON.parse(readFileSync(p, 'utf8'));
		} catch {
			return null;
		}
	},
};

/** pgrep 扫描全部 DSH 相关进程行；失败返回 null（前端呈现未知态，不阻塞面板） */
function scanProcessLines() {
	return new Promise((resolve) => {
		execFile('pgrep', ['-fl', 'DeepSeek Harness'], { timeout: 5000 }, (err, stdout) => {
			resolve(err ? null : stdout.split('\n').filter((l) => l.trim().length > 0));
		});
	});
}

async function collectProfileState() {
	const [homes, psLines] = await Promise.all([discoverProfileHomes(fsIo), scanProcessLines()]);
	const running = psLines ? detectRunningProfiles(psLines, homes.map((h) => h.profilePath)) : null;
	const metas = await Promise.all(homes.map((h) => parseProfileMeta(fsIo, h.profilePath)));
	const currentProfilePath = resolveCurrentProfileDir({
		env: process.env,
		argv: process.argv,
		existsFn: existsSync,
		homedir: fsIo.homedir,
	});
	const appPath = resolveAppPath(appPathCandidates(), existsSync);
	return {
		homes: homes.map((h, i) => ({
			...h,
			...(metas[i] ?? { bundles: [], bundleCount: 0, dependencyCount: 0 }),
			// pgrep 从 host 内执行永远看不到发起调用的 host 自己（calling process 被排除，
			// 2026-11-17 实证：9 行输出中 dev 主进程与 helpers 全在、唯独 host 自身缺席）——
			// 当前实例 running 强制 true（面板能发请求即证明在跑），其余按扫描结果
			running: h.profilePath === currentProfilePath ? true : running ? running.has(h.profilePath) : null,
			current: h.profilePath === currentProfilePath,
		})),
		currentProfilePath,
		appPath,
		detectAvailable: psLines !== null,
	};
}

function parseBody(req) {
	return new Promise((resolve, reject) => {
		let raw = '';
		req.on('data', (chunk) => {
			raw += chunk;
			if (raw.length > 64 * 1024) reject(new Error('body too large'));
		});
		req.on('end', () => {
			try {
				resolve(raw.length ? JSON.parse(raw) : {});
			} catch (err) {
				reject(new Error('invalid JSON body'));
			}
		});
		req.on('error', reject);
	});
}

function sendJson(res, status, payload) {
	const body = JSON.stringify(payload);
	res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
	res.end(body);
}

export function apply(ctx) {
	ctx.inject(['webServer'], (scopeCtx) => {
		scopeCtx.webServer.register({
			kind: 'prefix',
			path: '/profile-launcher',
			handler: async (req, res) => {
				const pathname = new URL(req.url, 'http://localhost').pathname;
				try {
					if (req.method === 'GET' && pathname === '/profile-launcher/profiles') {
						sendJson(res, 200, await collectProfileState());
						return;
					}
					if (req.method === 'POST' && pathname === '/profile-launcher/launch') {
						const body = await parseBody(req);
						if (typeof body?.homePath !== 'string' || body.homePath.length === 0) {
							sendJson(res, 400, { error: '缺少 homePath' });
							return;
						}
						// 白名单校验：重新发现后全等比对，防任意路径注入（TOCTOU 也覆盖）
						const state = await collectProfileState();
						const target = state.homes.find((h) => h.homePath === body.homePath);
						if (!target) {
							sendJson(res, 400, { error: `未发现的 profile home：${body.homePath}` });
							return;
						}
						if (target.current) {
							sendJson(res, 409, { error: '该 profile 就是当前实例，无需启动' });
							return;
						}
						if (target.running === true) {
							sendJson(res, 409, { error: '该 profile 桌面版已在运行' });
							return;
						}
						if (!state.appPath) {
							sendJson(res, 500, { error: `未找到 DSH 桌面版可执行文件（已试 ${appPathCandidates().join(' ; ')}）` });
							return;
						}
						const plan = buildLaunchPlan({ homePath: target.homePath, appPath: state.appPath });
						// 关键：剥离宿主 host 进程的 ELECTRON_RUN_AS_NODE——Electron 以纯 Node 模式
						// spawn 宿主二进制会秒退（user-data 目录都来不及建），新实例必须是完整 Electron app
						const childEnv = { ...process.env, ...plan.env };
						delete childEnv.ELECTRON_RUN_AS_NODE;
						const child = spawn(plan.cmd, plan.args, {
							detached: true,
							stdio: 'ignore',
							env: childEnv,
						});
						child.unref();
						// 存活复查：轮询最多 8s（新 user-data 首次初始化可能较慢），
						// 把「启动了但很快退出」（如 profile 损坏 / 环境剥离失败）显式回报（AC6）
						let survived = null;
						for (let i = 0; i < 16; i += 1) {
							await new Promise((r) => setTimeout(r, 500));
							const psLines = await scanProcessLines();
							if (!psLines) break; // pgrep 不可用，放弃判定
							if (detectRunningProfiles(psLines, [target.profilePath]).size > 0) {
								survived = true;
								break;
							}
							// 子进程已死且不在进程表 → 提前判负（免等满 8s）
							try {
								process.kill(child.pid, 0);
							} catch {
								survived = false;
								break;
							}
						}
						// 跑满 8s：主进程还挂着但 host 一直没出现 = profile 不完整 /
						// host 崩溃（如空 profile 演示场景），按失败回报而非成功
						if (survived === null) survived = false;
						sendJson(res, 200, { launched: true, survived, homePath: target.homePath, pid: child.pid });
						return;
					}
					if (req.method === 'POST' && pathname === '/profile-launcher/create') {
						const body = await parseBody(req);
						const check = validateProfileName(typeof body?.name === 'string' ? body.name : '');
						if (!check.ok) {
							sendJson(res, 400, { error: check.reason });
							return;
						}
						const homePath = join(fsIo.homedir, `.dsh-${body.name}`);
						if (existsSync(homePath)) {
							sendJson(res, 409, { error: `目录已存在：${homePath}（与既有 profile 重名），请换个名称` });
							return;
						}
						// pl-CHG-003 配置继承（可选）：inheritFrom 白名单校验沿 /launch 模式
						// （重发现比对防注入），且来源须已初始化（待初始化 home 无配置可继承）。
						// 继承规划在 mkdir 前做——来源校验失败不应留下半成品目录
						const inheritFrom =
							typeof body?.inheritFrom === 'string' && body.inheritFrom.length > 0 ? body.inheritFrom : null;
						let inheritPlans = [];
						if (inheritFrom !== null) {
							const state = await collectProfileState();
							const source = state.homes.find((h) => h.homePath === inheritFrom);
							if (!source) {
								sendJson(res, 400, { error: `未发现的 profile home：${inheritFrom}` });
								return;
							}
							if (source.initialized !== true) {
								sendJson(res, 400, { error: `来源 ${source.displayName} 尚未初始化，无配置可继承` });
								return;
							}
							inheritPlans = await planConfigInherit(fsIo, source.homePath, homePath);
						}
						// 纯空目录起步：宿主首启自动完成完整初始化（pl-CHG-002 spike 实验 A）；
						// 预置 profiles/ 下任何文件都是唯一已证崩溃形态（实验 C），绝不触碰——
						// 继承文件只落 home 顶层（settings.yaml 经宿主官方导入机制生效）
						mkdirSync(homePath);
						// 继承复制：创建与继承是两步——复制失败目录保留、显式报错，用户可删除重试
						const inherited = [];
						try {
							for (const plan of inheritPlans) {
								copyFileSync(plan.src, plan.dest);
								chmodSync(plan.dest, plan.mode); // 保 0600（credentials/settings 实测权限）
								inherited.push(plan.file);
							}
						} catch (err) {
							sendJson(res, 500, {
								error: `配置继承失败（${homePath} 已创建并保留，可删除后重试）：${err.message}`,
							});
							return;
						}
						sendJson(res, 201, { created: true, homePath, inherited });
						return;
					}
					if (req.method === 'POST' && pathname === '/profile-launcher/stop') {
						const body = await parseBody(req);
						// 白名单校验（沿 /launch 模式：重发现比对，防 TOCTOU 与任意路径注入）
						const state = await collectProfileState();
						const target = state.homes.find((h) => h.homePath === body?.homePath);
						if (!target) {
							sendJson(res, 400, { error: `未发现的 profile home：${body?.homePath}` });
							return;
						}
						if (target.current) {
							sendJson(res, 409, { error: '该 profile 就是当前实例，不能在面板内停止自己' });
							return;
						}
						if (target.running !== true) {
							sendJson(res, 409, { error: '该 profile 桌面版未在运行（或运行状态未知）' });
							return;
						}
						const psLines = await scanProcessLines();
						const pids = psLines ? findInstanceMainPids(psLines, target.homePath) : [];
						if (pids.length === 0) {
							sendJson(res, 409, { error: '未定位到主进程（可能刚已退出），请刷新后重试' });
							return;
						}
						// SIGTERM 主进程即可带走整棵进程树（host + helpers，实证 2026-11-17）
						for (const pid of pids) {
							try {
								process.kill(pid, 'SIGTERM');
							} catch {
								// 进程竞态退出：忽略，靠轮询判定
							}
						}
						const userDirToken = join(target.homePath, 'desktop-user-data');
						const countLeft = async () => {
							const lines = await scanProcessLines();
							return lines ? lines.filter((l) => l.includes(userDirToken)).length : -1;
						};
						let stopped = false;
						for (let i = 0; i < 10; i += 1) {
							await new Promise((r) => setTimeout(r, 500));
							if ((await countLeft()) === 0) {
								stopped = true;
								break;
							}
						}
						if (!stopped) {
							// SIGKILL 兜底：SIGTERM 5s 未清（如主进程卡在系统弹窗）再强制
							for (const pid of pids) {
								try {
									process.kill(pid, 'SIGKILL');
								} catch {
									// 已退出：忽略
								}
							}
							await new Promise((r) => setTimeout(r, 2000));
							stopped = (await countLeft()) === 0;
						}
						if (stopped) {
							sendJson(res, 200, { stopped: true, homePath: target.homePath });
						} else {
							sendJson(res, 500, { error: '实例进程未能完全退出（已尝试 SIGKILL），请手动检查进程' });
						}
						return;
					}
					if (req.method === 'POST' && pathname === '/profile-launcher/delete') {
						const body = await parseBody(req);
						const state = await collectProfileState();
						const target = state.homes.find((h) => h.homePath === body?.homePath);
						if (!target) {
							sendJson(res, 400, { error: `未发现的 profile home：${body?.homePath}` });
							return;
						}
						if (target.current) {
							sendJson(res, 409, { error: '该 profile 就是当前实例，不能删除自己' });
							return;
						}
						if (target.running === true) {
							sendJson(res, 409, { error: '该 profile 桌面版正在运行，请先停止再删除' });
							return;
						}
						if (target.running === null) {
							sendJson(res, 409, { error: '运行状态未知（进程检测不可用），为安全起见拒绝删除' });
							return;
						}
						// 路径双保险：白名单已保证在发现列表内，再校验 resolved 路径
						// 必须直接位于 homedir 下且目录名以 .dsh 开头（rm -rf 不可逆，多一道是必要的）
						const resolved = resolve(target.homePath);
						if (dirname(resolved) !== fsIo.homedir || !basename(resolved).startsWith('.dsh')) {
							sendJson(res, 400, { error: `非法目标路径：${resolved}` });
							return;
						}
						rmSync(resolved, { recursive: true, force: true });
						sendJson(res, 200, { deleted: true, homePath: resolved });
						return;
					}
					// 实例标识注入（pl-CHG-005）：写目标 profile 双字段 + pnpm install。
					// 幂等（重复注入语义等价）；运行中允许注入（宿主 boot 时才装载，不产生分裂态，
					// 但须重启实例生效——面板给出重启引导）。
					if (req.method === 'POST' && pathname === '/profile-launcher/inject-badge') {
						const body = await parseBody(req);
						const state = await collectProfileState();
						const target = state.homes.find((h) => h.homePath === body?.homePath);
						if (!target) {
							sendJson(res, 400, { error: `未发现的 profile home：${body?.homePath}` });
							return;
						}
						if (!target.initialized) {
							sendJson(res, 409, { error: '该 profile 尚未初始化（先启动一次由宿主完成初始化，再注入标识）' });
							return;
						}
						const badgeDir = badgeDistDir();
						if (!existsSync(join(badgeDir, 'package.json'))) {
							sendJson(res, 500, { error: `内嵌 badge 包缺失（${badgeDir}）——请先完成构建` });
							return;
						}
						const read = await readProfilePackage(target);
						if (read.error) {
							sendJson(res, 500, { error: read.error });
							return;
						}
						let nextPkg;
						try {
							nextPkg = planBadgeInject(read.raw, `file:${badgeDir}`);
						} catch (err) {
							sendJson(res, 409, { error: err instanceof Error ? err.message : String(err) });
							return;
						}
						writeFileSync(read.path, `${JSON.stringify(nextPkg, null, 2)}\n`);
						const install = await pnpmInstall(target.profilePath);
						if (!install.ok) {
							sendJson(res, 500, { error: `pnpm install 失败：${install.log}` });
							return;
						}
						sendJson(res, 200, { injected: true, restartRequired: true, homePath: target.homePath });
						return;
					}
					// 实例标识移除（pl-CHG-005）：双字段删除 + pnpm install，幂等。
					if (req.method === 'POST' && pathname === '/profile-launcher/remove-badge') {
						const body = await parseBody(req);
						const state = await collectProfileState();
						const target = state.homes.find((h) => h.homePath === body?.homePath);
						if (!target) {
							sendJson(res, 400, { error: `未发现的 profile home：${body?.homePath}` });
							return;
						}
						const read = await readProfilePackage(target);
						if (read.error) {
							sendJson(res, 500, { error: read.error });
							return;
						}
						const plan = planBadgeRemove(read.raw);
						if (!plan.changed) {
							sendJson(res, 200, { removed: false, message: '该 profile 未注入标识' });
							return;
						}
						writeFileSync(read.path, `${JSON.stringify(plan.pkg, null, 2)}\n`);
						const install = await pnpmInstall(target.profilePath);
						if (!install.ok) {
							sendJson(res, 500, { error: `pnpm install 失败：${install.log}` });
							return;
						}
						sendJson(res, 200, { removed: true, restartRequired: true, homePath: target.homePath });
						return;
					}
					sendJson(res, 404, { error: 'not found' });
				} catch (err) {
					sendJson(res, 500, { error: err instanceof Error ? err.message : String(err) });
				}
			},
		});
	});
	ctx.on('dispose', () => {});
}
