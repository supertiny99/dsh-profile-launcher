// @supertiny99/dsh-profile-badge — Client 半：右下角 profile 名浮标（实例主标识）
// pl-CHG-005 spike 结论：窗口标题与页面 title 解耦不可用（SP4 证伪），浮标是唯一可见标识；
// 调度中心缩略图含窗口内容，浮标在缩略图中同样可辨。
// 规范：无 emoji（ui-style-guide §2 原则 5）；fetch 失败静默降级（无浮标无报错）。
const BADGE_ID = 'dsh-profile-badge';
const STYLE_ID = `${BADGE_ID}-style`;

// 本插件不消费宿主服务（纯 DOM 副作用），inject 置空数组显式声明契约
export const inject = [];

function injectStyle() {
	const style = document.createElement('style');
	style.id = STYLE_ID;
	// 颜色走宿主语义别名 token（ui-style-guide：明暗主题自动适配，且跟随 App 内主题
	// 设置而非系统 prefers-color-scheme——验收期实证系统亮/App 暗时媒体查询失真）；
	// fallback 仅兜 token 缺失的异常宿主批次。
	style.textContent = [
		`#${BADGE_ID}{position:fixed;right:14px;bottom:14px;z-index:2147483000;`,
		'padding:2px 9px;border-radius:999px;',
		"font:500 11px/1.6 -apple-system,'Segoe UI',sans-serif;",
		'background:var(--dsw-alias-bg-layer-2, rgba(127,127,127,.35));',
		'color:var(--dsw-alias-label-secondary, inherit);',
		'border:1px solid var(--dsw-alias-border-l2, transparent);',
		'opacity:.9;pointer-events:none;letter-spacing:.02em;max-width:40vw;overflow:hidden;',
		'text-overflow:ellipsis;white-space:nowrap;}',
	].join('');
	document.head.appendChild(style);
}

export async function apply() {
	try {
		const res = await fetch('/dsh-profile-badge/name');
		if (!res.ok) return;
		const data = await res.json();
		if (!data || typeof data.name !== 'string' || data.name.length === 0) return;
		document.getElementById(STYLE_ID)?.remove();
		injectStyle();
		document.getElementById(BADGE_ID)?.remove();
		const badge = document.createElement('div');
		badge.id = BADGE_ID;
		badge.textContent = data.name;
		document.body.appendChild(badge);
	} catch {
		// 静默降级：标识不可用时保持宿主原状
	}
}
