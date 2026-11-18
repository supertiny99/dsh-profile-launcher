import { readFile } from 'node:fs/promises';

const SHARED = [
	'react',
	'react/jsx-runtime',
	'react-dom',
	'react-dom/client',
	'@deepseek-ai/cordis',
	'zod',
	'@tanstack/react-virtual',
	'@deepseek-ai/dsh-client-store',
	'@deepseek-ai/dsh-client-ui-slots',
	'@deepseek-ai/dsh-client-ui-primitives',
	'@deepseek-ai/dsh-client-ui-dockkit',
];

const reactStub = {
	createElement: (...args) => ({ args }),
	Fragment: 'fragment',
	Component: class Component {},
	useState: (v) => [typeof v === 'function' ? v() : v, () => {}],
	useRef: (v) => ({ current: v }),
	useEffect: () => {},
	useCallback: (fn) => fn,
	useMemo: (fn) => fn(),
};

// primitives 命名空间 stub：任意成员都给一个可调用的 createElement 形态（沿 ui-gallery 沉淀）
const primitivesStub = new Proxy({}, {
	get: (target, key) => (key === '__esModule' ? true : reactStub.createElement),
});

const fakeRequire = (spec) => {
	if (!SHARED.includes(spec)) throw new Error('unexpected require: ' + spec);
	if (spec === 'react' || spec === 'react/jsx-runtime') return reactStub;
	if (spec === '@deepseek-ai/dsh-client-ui-primitives') return primitivesStub;
	return {};
};

let registered = null;
const fakeLoader = {
	load: (entry) => {
		registered = entry;
	},
};
const window = { __ModuleLoader__: fakeLoader };

const source = await readFile('dist/client.js', 'utf8');
const run = new Function('window', 'require', `"use strict";\n${source}`);
run(window, fakeRequire);

const failures = [];

// 校验 1: 读取 meta.json 严查 external 依赖泄漏
try {
	const metaRaw = await readFile('dist/meta.json', 'utf8');
	const meta = JSON.parse(metaRaw);
	const bundledInputs = Object.keys(meta.inputs || {});
	for (const shared of SHARED) {
		const leaked = bundledInputs.filter((f) => f.includes(`node_modules/${shared}/`) || f.startsWith(shared));
		if (leaked.length > 0) {
			failures.push(`[FATAL] 宿主共享单例依赖意外被打包进 bundle: ${shared} (${leaked.join(', ')})`);
		}
	}
} catch (e) {
	// 若 meta.json 不存在暂不阻塞纯 JS 执行校验
}

if (!registered) failures.push('产物未调用 __ModuleLoader__.load 注册');
const exports = registered?.factory(fakeRequire);
if (!exports || typeof exports.apply !== 'function') {
	failures.push('factory 未返回 { apply } (module.exports 链断裂？)');
}
if (exports && !Array.isArray(exports.inject)) {
	failures.push('缺少 inject 声明（应包含 slots）');
}

// badge 内嵌包产物校验（pl-CHG-005）：注册链 + exports 契约
try {
	const badgeSource = await readFile('dist/badge/client.js', 'utf8');
	let badgeRegistered = null;
	const badgeWindow = { __ModuleLoader__: { load: (entry) => { badgeRegistered = entry; } } };
	new Function('window', 'require', `"use strict";\n${badgeSource}`)(badgeWindow, fakeRequire);
	if (!badgeRegistered || badgeRegistered.id !== '@supertiny99/dsh-profile-badge') {
		failures.push('badge 产物未以 @supertiny99/dsh-profile-badge 注册 __ModuleLoader__.load');
	} else {
		const badgeExports = badgeRegistered.factory(fakeRequire);
		if (!badgeExports || typeof badgeExports.apply !== 'function') {
			failures.push('badge factory 未返回 { apply }');
		}
		if (badgeExports && !Array.isArray(badgeExports.inject)) {
			failures.push('badge 缺少 inject 数组声明');
		}
	}
} catch (e) {
	failures.push(`badge 产物校验失败（dist/badge/client.js 缺失或损坏）: ${e.message}`);
}

if (failures.length) {
	console.error('selfcheck FAIL:\n  ' + failures.join('\n  '));
	process.exit(1);
} else {
	console.log('selfcheck OK: Client 产物结构与 exports.apply 链完整！');
}
