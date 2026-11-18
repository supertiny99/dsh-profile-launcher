// tests/test-launcher-core.mjs — launcher-core 纯逻辑单测（node:assert/strict，无框架）
import assert from 'node:assert/strict';
import { join } from 'node:path';

import {
	homeDisplayName,
	discoverProfileHomes,
	parseProfileMeta,
	resolveAppPath,
	buildLaunchPlan,
	detectRunningProfiles,
	resolveCurrentProfileDir,
	validateProfileName,
	findInstanceMainPids,
	planConfigInherit,
	isBadgeInjected,
	planBadgeInject,
	planBadgeRemove,
	resolvePnpmEntry,
	BADGE_PACKAGE_NAME,
} from '../src/launcher-core.js';

const HOME = '/Users/tester';
let passed = 0;
const check = (name, fn) => {
	try {
		fn();
		passed += 1;
		console.log(`ok ${passed} - ${name}`);
	} catch (err) {
		console.error(`FAIL - ${name}\n${err.stack}`);
		process.exitCode = 1;
	}
};

check('homeDisplayName：.dsh → default，.dsh-dev → dev，.dsh-235 → 235', () => {
	assert.equal(homeDisplayName('.dsh'), 'default');
	assert.equal(homeDisplayName('.dsh-dev'), 'dev');
	assert.equal(homeDisplayName('.dsh-235'), '235');
});

check('discoverProfileHomes：两级收录——initialized 按 package.json 判定（pl-CHG-002）', async () => {
	const io = {
		homedir: HOME,
		readdir: async () => ['.dsh', '.dsh-dev', '.dsh-235', '.Trash', 'Desktop', '.DS_Store'],
		isFile: async (p) =>
			p === join(HOME, '.dsh/profiles/desktop/package.json') || p === join(HOME, '.dsh-dev/profiles/desktop/package.json'),
	};
	const homes = await discoverProfileHomes(io);
	assert.deepEqual(
		homes.map((h) => h.name),
		['.dsh', '.dsh-235', '.dsh-dev']
	);
	assert.deepEqual(
		homes.map((h) => h.initialized),
		[true, false, true]
	);
	assert.equal(homes[2].displayName, 'dev');
	assert.equal(homes[2].profilePath, join(HOME, '.dsh-dev/profiles/desktop'));
});

check('discoverProfileHomes：无任何合法 home 时返回空数组（不抛错）', async () => {
	const io = { homedir: HOME, readdir: async () => ['.DS_Store'], isFile: async () => false };
	assert.deepEqual(await discoverProfileHomes(io), []);
});

check('parseProfileMeta：bundles 计数 + dependencies 计数', async () => {
	const io = {
		readJson: async () => ({
			dsh: { profile: { bundles: ['@deepseek-ai/dsh-base', '@supertiny99/dsh-plugin-guardian', 42] } },
			dependencies: { a: '1', b: '2', c: '3' },
		}),
	};
	const meta = await parseProfileMeta(io, '/x');
	assert.equal(meta.bundleCount, 2);
	assert.deepEqual(meta.bundles, ['@deepseek-ai/dsh-base', '@supertiny99/dsh-plugin-guardian']);
	assert.equal(meta.dependencyCount, 3);
});

check('parseProfileMeta：损坏/缺失 manifest 返回 null（不拖垮面板）', async () => {
	assert.equal(await parseProfileMeta({ readJson: async () => null }, '/x'), null);
	assert.equal(await parseProfileMeta({ readJson: async () => 'not-object' }, '/x'), null);
	const meta = await parseProfileMeta({ readJson: async () => ({ name: 'bare' }) }, '/x');
	assert.equal(meta.bundleCount, 0);
});

check('resolveAppPath：依次探测，第一个存在者胜出', () => {
	const exists = (p) => p === '/Applications/DeepSeek Harness.app/Contents/MacOS/DeepSeek Harness';
	assert.equal(
		resolveAppPath(['/gone/bin', '/Applications/DeepSeek Harness.app/Contents/MacOS/DeepSeek Harness'], exists),
		'/Applications/DeepSeek Harness.app/Contents/MacOS/DeepSeek Harness'
	);
});

check('resolveAppPath：全部失败返回 null（前端呈现 AC6 错误）', () => {
	assert.equal(resolveAppPath(['/a', '/b', ''], () => false), null);
	assert.equal(resolveAppPath([undefined, null], () => true), null);
});

check('buildLaunchPlan：args 带 --user-data-dir=<home>/desktop-user-data，env 带 DSH_HOME', () => {
	const plan = buildLaunchPlan({ homePath: join(HOME, '.dsh-dev'), appPath: '/Applications/app' });
	assert.equal(plan.cmd, '/Applications/app');
	assert.deepEqual(plan.args, [`--user-data-dir=${join(HOME, '.dsh-dev/desktop-user-data')}`]);
	assert.deepEqual(plan.env, { DSH_HOME: join(HOME, '.dsh-dev') });
});

check('detectRunningProfiles：host 进程 argv token 全等匹配（实证形态）', () => {
	const lines = [
		'34878 /Applications/DeepSeek Harness.app/Contents/MacOS/DeepSeek Harness',
		'35018 /Applications/DeepSeek Harness.app/Contents/MacOS/DeepSeek Harness --expose-internals x.js /dsh ' + join(HOME, '.dsh/profiles/desktop') + ' runtime',
		'41522 /Applications/DeepSeek Harness.app/Contents/MacOS/DeepSeek Harness --expose-internals x.js /dsh ' + join(HOME, '.dsh-dev/profiles/desktop') + ' runtime',
	];
	const running = detectRunningProfiles(lines, [join(HOME, '.dsh/profiles/desktop'), join(HOME, '.dsh-dev/profiles/desktop')]);
	assert.equal(running.size, 2);
});

check('detectRunningProfiles：前缀歧义防护——/.dsh-dev 在跑时 /.dsh 不得误判（反之亦然）', () => {
	const devLine = '9999 app --expose-internals x.js /dsh ' + join(HOME, '.dsh-dev/profiles/desktop') + ' runtime';
	const running = detectRunningProfiles([devLine], [join(HOME, '.dsh/profiles/desktop')]);
	assert.equal(running.size, 0);
	const prodLine = '8888 app --expose-internals x.js /dsh ' + join(HOME, '.dsh/profiles/desktop') + ' runtime';
	const running2 = detectRunningProfiles([prodLine], [join(HOME, '.dsh-dev/profiles/desktop')]);
	assert.equal(running2.size, 0);
});

check('detectRunningProfiles：无关行（无 /profiles/desktop）快速跳过', () => {
	const running = detectRunningProfiles(['100 safari https://x'], [join(HOME, '.dsh/profiles/desktop')]);
	assert.equal(running.size, 0);
});

check('validateProfileName：合法名（dev / 单字符 / 纯数字 / 连字符中缀 / 32 位上限）', () => {
	assert.deepEqual(validateProfileName('dev'), { ok: true });
	assert.deepEqual(validateProfileName('a'), { ok: true });
	assert.deepEqual(validateProfileName('235'), { ok: true });
	assert.deepEqual(validateProfileName('a-b-c2'), { ok: true });
	assert.deepEqual(validateProfileName('x'.repeat(31) + 'y'), { ok: true });
});

check('validateProfileName：非法名（空 / 非字符串 / 超长 / 连字符头尾 / 大写 / 中文 / 空格）', () => {
	assert.equal(validateProfileName('').ok, false);
	assert.equal(validateProfileName('   ').ok, false);
	assert.equal(validateProfileName(undefined).ok, false);
	assert.equal(validateProfileName(null).ok, false);
	assert.equal(validateProfileName('x'.repeat(33)).ok, false);
	assert.equal(validateProfileName('-ab').ok, false);
	assert.equal(validateProfileName('ab-').ok, false);
	assert.equal(validateProfileName('-').ok, false);
	assert.equal(validateProfileName('Dev').ok, false);
	assert.equal(validateProfileName('沙盒').ok, false);
	assert.equal(validateProfileName('a b').ok, false);
	// 非法时必须带人类可读 reason（前端直显）
	assert.ok(typeof validateProfileName('-ab').reason === 'string' && validateProfileName('-ab').reason.length > 0);
});

check('findInstanceMainPids：主进程命中 + helper 排除 + 跨 home 不误配（实证形态）', () => {
	const marker = (h) => `--user-data-dir=${join(HOME, h, 'desktop-user-data')}`;
	const lines = [
		'80464 /Applications/DeepSeek Harness.app/Contents/MacOS/DeepSeek Harness ' + marker('.dsh-stop'),
		'80466 /Applications/.../DeepSeek Harness Helper --type=gpu-process ' + marker('.dsh-stop'),
		'80542 /Applications/DeepSeek Harness.app/Contents/MacOS/DeepSeek Harness --expose-internals x.js /dsh ' + join(HOME, '.dsh-stop/profiles/desktop') + ' runtime',
		'70001 /Applications/DeepSeek Harness.app/Contents/MacOS/DeepSeek Harness ' + marker('.dsh-dev'),
	];
	// 主进程命中 1 个（80464）；host（80542）与 helper（80466）不带 user-data-dir 或带 --type=，不命中；dev 实例（70001）不误配
	assert.deepEqual(findInstanceMainPids(lines, join(HOME, '.dsh-stop')), [80464]);
	assert.deepEqual(findInstanceMainPids(lines, join(HOME, '.dsh-dev')), [70001]);
	// 无匹配 / 空输入防御
	assert.deepEqual(findInstanceMainPids(lines, join(HOME, '.dsh')), []);
	assert.deepEqual(findInstanceMainPids(null, join(HOME, '.dsh')), []);
	assert.deepEqual(findInstanceMainPids(['garbage line no pid'], join(HOME, '.dsh')), []);
});

check('resolveCurrentProfileDir：优先级 DSH_PROFILE_DIR > argv > DSH_HOME > 默认', () => {
	const exists = (p) => !p.includes('broken');
	const prof = (h) => join(HOME, h, 'profiles', 'desktop');
	// 1) 显式 env 最高
	assert.equal(
		resolveCurrentProfileDir({ env: { DSH_PROFILE_DIR: prof('.dsh-dev') }, argv: [prof('.dsh')], existsFn: exists, homedir: HOME }),
		prof('.dsh-dev')
	);
	// 2) env 缺失/损坏 → argv
	assert.equal(
		resolveCurrentProfileDir({ env: {}, argv: ['node', 'host.js', prof('.dsh-dev')], existsFn: exists, homedir: HOME }),
		prof('.dsh-dev')
	);
	// 3) 都无 → DSH_HOME 推导
	assert.equal(
		resolveCurrentProfileDir({ env: { DSH_HOME: join(HOME, '.dsh-dev') }, argv: [], existsFn: exists, homedir: HOME }),
		prof('.dsh-dev')
	);
	// 4) 兜底 ~/.dsh
	assert.equal(resolveCurrentProfileDir({ env: {}, argv: [], existsFn: exists, homedir: HOME }), prof('.dsh'));
	// 5) 显式 env 但目录损坏 → 降级链继续
	assert.equal(
		resolveCurrentProfileDir({ env: { DSH_PROFILE_DIR: '/broken/profile' }, argv: [prof('.dsh')], existsFn: exists, homedir: HOME }),
		prof('.dsh')
	);
});

check('planConfigInherit：只规划来源存在的文件，mode 取来源实际权限位（pl-CHG-003）', async () => {
	const files = {
		[join(HOME, '.dsh/settings.yaml')]: { isFile: () => true, mode: 0o100600 },
		[join(HOME, '.dsh/.credentials.yaml')]: { isFile: () => true, mode: 0o100600 },
		[join(HOME, '.dsh/.env')]: { isFile: () => true, mode: 0o100644 },
	};
	const io = { stat: async (p) => files[p] ?? null };
	const plans = await planConfigInherit(io, join(HOME, '.dsh'), join(HOME, '.dsh-new'));
	assert.equal(plans.length, 3);
	assert.deepEqual(
		plans.map((p) => p.file),
		['settings.yaml', '.credentials.yaml', '.env']
	);
	assert.deepEqual(
		plans.map((p) => p.mode),
		[0o600, 0o600, 0o644]
	);
	assert.equal(plans[0].src, join(HOME, '.dsh/settings.yaml'));
	assert.equal(plans[0].dest, join(HOME, '.dsh-new/settings.yaml'));
});

check('planConfigInherit：来源缺失的文件跳过不算失败（AC5）', async () => {
	const files = {
		[join(HOME, '.dsh-dev/settings.yaml')]: { isFile: () => true, mode: 0o100600 },
		// .credentials.yaml / .env 缺失 → stat 返回 null
	};
	const io = { stat: async (p) => files[p] ?? null };
	const plans = await planConfigInherit(io, join(HOME, '.dsh-dev'), join(HOME, '.dsh-new'));
	assert.equal(plans.length, 1);
	assert.equal(plans[0].file, 'settings.yaml');
});

// ===== 实例标识（pl-CHG-005）=====

const hostPkg = () => ({
	name: 'dsh-profile-desktop',
	private: true,
	dependencies: {
		'@deepseek-ai/dsh-base': '^0.2.0',
	},
	dsh: {
		profile: {
			bundles: ['@deepseek-ai/dsh-base', '@deepseek-ai/dsh-web-app'],
		},
	},
});

check('isBadgeInjected：双字段齐备才算完整注入', () => {
	const withBadge = planBadgeInject(hostPkg(), 'file:/x/dist/badge');
	assert.equal(isBadgeInjected(withBadge), true);
	assert.equal(isBadgeInjected(hostPkg()), false);
});

check('isBadgeInjected：只有 bundles 没有 dependencies 不算（写入中断防御）', () => {
	const pkg = hostPkg();
	pkg.dsh.profile.bundles.push(BADGE_PACKAGE_NAME);
	assert.equal(isBadgeInjected(pkg), false);
});

check('isBadgeInjected：null / 缺结构安全返回 false', () => {
	assert.equal(isBadgeInjected(null), false);
	assert.equal(isBadgeInjected({}), false);
	assert.equal(isBadgeInjected({ dsh: { profile: { bundles: [BADGE_PACKAGE_NAME] } } }), false);
});

check('planBadgeInject：追加 bundles + dependencies，不重复、不改原有键', () => {
	const next = planBadgeInject(hostPkg(), 'file:/x/dist/badge');
	assert.deepEqual(next.dsh.profile.bundles, ['@deepseek-ai/dsh-base', '@deepseek-ai/dsh-web-app', BADGE_PACKAGE_NAME]);
	assert.equal(next.dependencies[BADGE_PACKAGE_NAME], 'file:/x/dist/badge');
	assert.equal(next.dependencies['@deepseek-ai/dsh-base'], '^0.2.0');
	assert.equal(next.name, 'dsh-profile-desktop');
});

check('planBadgeInject：幂等（重复注入产出语义等价对象，spec 刷新）', () => {
	const once = planBadgeInject(hostPkg(), 'file:/old/dist/badge');
	const twice = planBadgeInject(once, 'file:/new/dist/badge');
	assert.equal(twice.dsh.profile.bundles.filter((b) => b === BADGE_PACKAGE_NAME).length, 1);
	assert.equal(twice.dependencies[BADGE_PACKAGE_NAME], 'file:/new/dist/badge');
});

check('planBadgeInject：缺 bundles / dependencies 结构直接抛错（非宿主初始化形态）', () => {
	assert.throws(() => planBadgeInject({ dependencies: {} }, 'file:/x'), /dsh\.profile\.bundles/);
	assert.throws(() => planBadgeInject({ dsh: { profile: { bundles: [] } } }, 'file:/x'), /dependencies/);
	assert.throws(() => planBadgeInject(null, 'file:/x'), /不可解析/);
});

check('planBadgeInject：不污染输入对象（深拷贝）', () => {
	const pkg = hostPkg();
	planBadgeInject(pkg, 'file:/x/dist/badge');
	assert.equal(pkg.dsh.profile.bundles.length, 2);
	assert.equal(BADGE_PACKAGE_NAME in pkg.dependencies, false);
});

check('planBadgeRemove：双字段删除且 changed=true', () => {
	const injected = planBadgeInject(hostPkg(), 'file:/x/dist/badge');
	const plan = planBadgeRemove(injected);
	assert.equal(plan.changed, true);
	assert.deepEqual(plan.pkg.dsh.profile.bundles, ['@deepseek-ai/dsh-base', '@deepseek-ai/dsh-web-app']);
	assert.equal(BADGE_PACKAGE_NAME in plan.pkg.dependencies, false);
});

check('planBadgeRemove：未注入时幂等返回 changed=false（移除重试安全）', () => {
	const plan = planBadgeRemove(hostPkg());
	assert.equal(plan.changed, false);
	const planNull = planBadgeRemove(null);
	assert.equal(planNull.changed, false);
});

check('planBadgeRemove：只回滚 badge，不碰其他依赖与 bundles', () => {
	const pkg = planBadgeInject(hostPkg(), 'file:/x/dist/badge');
	pkg.dependencies['@local/dsh-blog-stats'] = 'link:/x';
	pkg.dsh.profile.bundles.push('@local/dsh-blog-stats');
	const plan = planBadgeRemove(pkg);
	assert.deepEqual(plan.pkg.dsh.profile.bundles, ['@deepseek-ai/dsh-base', '@deepseek-ai/dsh-web-app', '@local/dsh-blog-stats']);
	assert.equal(plan.pkg.dependencies['@local/dsh-blog-stats'], 'link:/x');
});

check('resolvePnpmEntry：argv 中首个存在命中的 pnpm.mjs 胜出', () => {
	const pnpmA = '/runtime/a/pnpm/bin/pnpm.mjs';
	const files = { [pnpmA]: true };
	assert.equal(resolvePnpmEntry(['--type=gpu', pnpmA, '/b/pnpm/bin/pnpm.mjs'], (p) => files[p] === true), pnpmA);
});

check('resolvePnpmEntry：无命中 / 非 pnpm.mjs 后缀返回 null（兜底系统 pnpm）', () => {
	assert.equal(resolvePnpmEntry(['/x/y.mjs', '--mode'], () => true), null);
	assert.equal(resolvePnpmEntry(['/x/pnpm/bin/pnpm.mjs'], () => false), null);
	assert.equal(resolvePnpmEntry([], () => true), null);
});

check('parseProfileMeta：badgeInjected 随 manifest 解析输出', async () => {
	const injectedPkg = planBadgeInject(hostPkg(), 'file:/x/dist/badge');
	const meta = await parseProfileMeta({ readJson: async () => injectedPkg }, '/x');
	assert.equal(meta.badgeInjected, true);
	const plainMeta = await parseProfileMeta({ readJson: async () => hostPkg() }, '/x');
	assert.equal(plainMeta.badgeInjected, false);
});

check('homeDisplayName：.dsh → default / .dsh-x → x（与注入命名口径一致）', () => {
	assert.equal(homeDisplayName('.dsh'), 'default');
	assert.equal(homeDisplayName('.dsh-dev'), 'dev');
});

check('planConfigInherit：来源全空（stat 全 null）返回空清单（待初始化 home 场景）', async () => {
	const io = { stat: async () => null };
	const plans = await planConfigInherit(io, join(HOME, '.dsh-tmp'), join(HOME, '.dsh-new'));
	assert.deepEqual(plans, []);
});

console.log(`\n${passed} passed`);
