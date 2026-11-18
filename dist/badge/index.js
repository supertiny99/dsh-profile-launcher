// @supertiny99/dsh-profile-badge — Host 半（随 profile-launcher dist/badge 内嵌分发）
// 前缀路由 /dsh-profile-badge/name 返回本 profile 显示名（client 挂载时 fetch）。
// 名字解析与 launcher-core resolveCurrentProfileDir 同款三级策略——badge 是独立安装
// 单元（目标 profile 里没有 launcher 包），逻辑双端各自持有是本仓库既有模式
// （client 不引 launcher-core 同理），改解析规则须两处同步。
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { basename, dirname, join } from 'node:path';

function resolveProfileDir(env, argv) {
	const fromEnv = env.DSH_PROFILE_DIR;
	if (typeof fromEnv === 'string' && fromEnv.trim().length > 0 && existsSync(join(fromEnv, 'package.json'))) {
		return fromEnv;
	}
	const fromArgv = (argv || []).find((a) => a.includes('/profiles/') && existsSync(join(a, 'package.json')));
	if (fromArgv) return fromArgv;
	if (typeof env.DSH_HOME === 'string' && env.DSH_HOME.trim().length > 0) {
		const derived = join(env.DSH_HOME, 'profiles', 'desktop');
		if (existsSync(join(derived, 'package.json'))) return derived;
	}
	return join(homedir(), '.dsh', 'profiles', 'desktop');
}

/** home 目录名 → 显示名（与 launcher-core homeDisplayName 同规则） */
export function displayNameOfHome(homePath) {
	const name = basename(homePath);
	if (name === '.dsh') return 'default';
	if (name.startsWith('.dsh-')) return name.slice(5);
	return name;
}

export function apply(ctx) {
	ctx.inject(['webServer'], (scopeCtx) => {
		scopeCtx.webServer.register({
			kind: 'prefix',
			path: '/dsh-profile-badge',
			handler: async (req, res) => {
				const pathname = new URL(req.url, 'http://localhost').pathname;
				if (req.method === 'GET' && pathname === '/dsh-profile-badge/name') {
					// resolveProfileDir 返回 <home>/profiles/desktop，home 在上两级
					const homePath = dirname(dirname(resolveProfileDir(process.env, process.argv)));
					res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
					res.end(JSON.stringify({ name: displayNameOfHome(homePath), homePath }));
					return;
				}
				res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
				res.end('{"error":"not found"}');
			},
		});
	});
	ctx.on('dispose', () => {});
}
