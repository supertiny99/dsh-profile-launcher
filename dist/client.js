window.__ModuleLoader__.load({id:"@supertiny99/dsh-profile-launcher",factory:(require)=>{const module={exports:{}};const exports=module.exports;
var V=Object.create;var y=Object.defineProperty;var X=Object.getOwnPropertyDescriptor;var Y=Object.getOwnPropertyNames;var Z=Object.getPrototypeOf,R=Object.prototype.hasOwnProperty;var ee=(r,t)=>{for(var o in t)y(r,o,{get:t[o],enumerable:!0})},I=(r,t,o,s)=>{if(t&&typeof t=="object"||typeof t=="function")for(let l of Y(t))!R.call(r,l)&&l!==o&&y(r,l,{get:()=>t[l],enumerable:!(s=X(t,l))||s.enumerable});return r};var $=(r,t,o)=>(o=r!=null?V(Z(r)):{},I(t||!r||!r.__esModule?y(o,"default",{value:r,enumerable:!0}):o,r)),re=r=>I(y({},"__esModule",{value:!0}),r);var me={};ee(me,{apply:()=>ge,inject:()=>be});module.exports=re(me);var e=$(require("react"),1),te=$(require("@deepseek-ai/dsh-client-ui-primitives"),1);var j=`.pl-container {
	min-height: 100%;
	background: var(--dsw-alias-surface-page, #f8fafc);
	color: var(--dsw-alias-text-primary, #1e293b);
	font-size: 13px;
	line-height: 1.55;
	padding: 20px 24px 32px;
	box-sizing: border-box;
}

.pl-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	margin-bottom: 16px;
}

.pl-title {
	font-size: 15px;
	font-weight: 600;
	letter-spacing: 0.2px;
	display: flex;
	align-items: center;
	gap: 8px;
}

.pl-subtitle {
	color: var(--dsw-alias-text-tertiary, #94a3b8);
	font-size: 12px;
	margin-top: 2px;
}

.pl-actions {
	display: flex;
	align-items: center;
	gap: 8px;
}

.pl-hint {
	color: var(--dsw-alias-text-tertiary, #94a3b8);
	font-size: 12px;
	border: 1px solid var(--dsw-alias-border-subtle, #e2e8f0);
	border-radius: 8px;
	padding: 10px 12px;
	margin-bottom: 16px;
	background: var(--dsw-alias-surface-overlay, #ffffff);
}

.pl-card-list {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.pl-card {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 14px;
	border: 1px solid var(--dsw-alias-border-subtle, #e2e8f0);
	border-radius: 10px;
	padding: 12px 14px;
	background: var(--dsw-alias-surface-overlay, #ffffff);
	transition: border-color 0.15s ease;
}

.pl-card:hover {
	border-color: var(--dsw-alias-border-strong, #cbd5e1);
}

.pl-card-main {
	display: flex;
	flex-direction: column;
	gap: 3px;
	min-width: 0;
}

.pl-card-title-row {
	display: flex;
	align-items: center;
	gap: 8px;
	flex-wrap: wrap;
}

.pl-card-name {
	font-weight: 600;
	font-size: 13.5px;
}

.pl-card-path {
	font-family: var(--dsw-alias-font-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
	font-size: 11.5px;
	color: var(--dsw-alias-text-secondary, #64748b);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.pl-card-bundles {
	font-size: 11.5px;
	color: var(--dsw-alias-text-tertiary, #94a3b8);
}

.pl-badges {
	display: flex;
	align-items: center;
	gap: 6px;
	flex-shrink: 0;
}

.pl-badge {
	display: inline-flex;
	align-items: center;
	gap: 5px;
	font-size: 11px;
	border-radius: 999px;
	padding: 3px 9px;
	border: 1px solid transparent;
	white-space: nowrap;
}

.pl-badge-running {
	color: #15803d;
	background: rgba(34, 197, 94, 0.12);
	border-color: rgba(34, 197, 94, 0.35);
}

.pl-badge-current {
	color: #1d4ed8;
	background: rgba(59, 130, 246, 0.12);
	border-color: rgba(59, 130, 246, 0.35);
}

.pl-badge-stopped {
	color: var(--dsw-alias-text-tertiary, #94a3b8);
	background: var(--dsw-alias-surface-sunken, #f1f5f9);
	border-color: var(--dsw-alias-border-subtle, #e2e8f0);
}

.pl-badge-unknown {
	color: #92400e;
	background: rgba(245, 158, 11, 0.12);
	border-color: rgba(245, 158, 11, 0.35);
}

.pl-dot {
	width: 6px;
	height: 6px;
	border-radius: 50%;
	background: currentColor;
}

.pl-dot-pulse {
	animation: pl-pulse 1.8s ease-in-out infinite;
}

@keyframes pl-pulse {
	0%, 100% { opacity: 1; }
	50% { opacity: 0.35; }
}

.pl-launch-btn {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	font-size: 12px;
	font-weight: 500;
	border-radius: 8px;
	padding: 6px 14px;
	cursor: pointer;
	border: 1px solid var(--dsw-alias-border-subtle, #e2e8f0);
	background: var(--dsw-alias-surface-overlay, #ffffff);
	color: var(--dsw-alias-text-primary, #1e293b);
	transition: all 0.15s ease;
	flex-shrink: 0;
}

.pl-launch-btn:hover:not(:disabled) {
	border-color: var(--dsw-alias-border-strong, #cbd5e1);
}

.pl-launch-btn:disabled {
	opacity: 0.45;
	cursor: not-allowed;
}

.pl-empty {
	text-align: center;
	color: var(--dsw-alias-text-tertiary, #94a3b8);
	padding: 40px 0;
}

.pl-error {
	border: 1px solid rgba(239, 68, 68, 0.4);
	background: rgba(239, 68, 68, 0.08);
	color: #b91c1c;
	border-radius: 8px;
	padding: 10px 12px;
	margin-bottom: 14px;
	font-size: 12px;
	word-break: break-all;
}

.pl-loading {
	text-align: center;
	color: var(--dsw-alias-text-tertiary, #94a3b8);
	padding: 40px 0;
}

/* \u2014\u2014 pl-CHG-002\uFF1A\u65B0\u5EFA\u8868\u5355 / \u5371\u9669\u64CD\u4F5C / \u5F85\u521D\u59CB\u5316\u5FBD\u6807 \u2014\u2014 */

.pl-form {
	display: flex;
	align-items: center;
	gap: 8px;
	flex-wrap: wrap;
	border: 1px solid var(--dsw-alias-border-subtle, #e2e8f0);
	border-radius: 10px;
	padding: 10px 12px;
	margin-bottom: 12px;
	background: var(--dsw-alias-surface-overlay, #ffffff);
}

.pl-input {
	flex: 1 1 200px;
	min-width: 0;
	font-size: 12.5px;
	border-radius: 8px;
	padding: 7px 10px;
	border: 1px solid var(--dsw-alias-border-subtle, #e2e8f0);
	background: var(--dsw-alias-surface-page, #f8fafc);
	color: var(--dsw-alias-text-primary, #1e293b);
	outline: none;
	transition: border-color 0.15s ease;
}

.pl-input:focus {
	border-color: var(--dsw-alias-border-strong, #cbd5e1);
}

/* \u7EE7\u627F\u914D\u7F6E\u4E0B\u62C9\uFF08pl-CHG-003\uFF09\uFF1A\u5BF9\u9F50 pl-input \u5916\u89C2\uFF0C\u56FA\u5B9A\u5408\u7406\u5BBD\u5EA6\u4E0D\u4E0E\u540D\u79F0\u8F93\u5165\u62A2\u5F39\u6027\u884C */
.pl-select {
	flex: 0 0 auto;
	min-width: 180px;
	appearance: auto;
	cursor: pointer;
}

.pl-form-note {
	font-size: 11px;
	color: var(--dsw-alias-text-tertiary, #94a3b8);
	white-space: nowrap;
}

.pl-link-btn {
	font-size: 12px;
	color: var(--dsw-alias-text-secondary, #64748b);
	background: none;
	border: none;
	cursor: pointer;
	padding: 6px 8px;
}

.pl-link-btn:hover {
	text-decoration: underline;
}

.pl-danger-btn {
	display: inline-flex;
	align-items: center;
	font-size: 12px;
	font-weight: 500;
	border-radius: 8px;
	padding: 6px 14px;
	cursor: pointer;
	border: 1px solid var(--dsw-alias-border-subtle, #e2e8f0);
	background: var(--dsw-alias-surface-overlay, #ffffff);
	color: var(--dsw-alias-text-secondary, #64748b);
	transition: all 0.15s ease;
	flex-shrink: 0;
}

.pl-danger-btn:hover:not(:disabled) {
	color: #b91c1c;
	border-color: rgba(239, 68, 68, 0.45);
}

/* \u5185\u5D4C\u4E8C\u6B21\u786E\u8BA4\u6001\uFF08\u65E0 RiskConfirmation \u65F6\u7684\u964D\u7EA7\u8DEF\u5F84\uFF09\uFF1A\u7EA2\u8272\u5B9E\u611F\u5F3A\u8C03 */
.pl-danger-confirm {
	color: #ffffff;
	background: #dc2626;
	border-color: #dc2626;
}

.pl-danger-confirm:hover:not(:disabled) {
	color: #ffffff;
	background: #b91c1c;
	border-color: #b91c1c;
}

.pl-danger-btn:disabled {
	opacity: 0.45;
	cursor: not-allowed;
}

.pl-badge-pending {
	color: #92400e;
	background: rgba(245, 158, 11, 0.1);
	border-color: rgba(245, 158, 11, 0.3);
	font-size: 10.5px;
	padding: 2px 8px;
}
`;var E=$(require("react"),1),k=class extends E.default.Component{constructor(t){super(t),this.state={error:null}}static getDerivedStateFromError(t){return{error:t}}componentDidCatch(t,o){console.error("[profile-launcher] panel error:",t,o)}render(){return this.state.error?E.default.createElement("div",{style:{padding:24,color:"#b91c1c",fontSize:13}},"Profile \u542F\u52A8\u5668\u9762\u677F\u6E32\u67D3\u51FA\u9519\uFF1A",String(this.state.error?.message??this.state.error)):this.props.children}};var N=te??{},u=typeof N.Button=="function"?N.Button:null,w=typeof N.RiskConfirmation=="function"?N.RiskConfirmation:null,ae=/^[a-z0-9]([a-z0-9-]{0,30}[a-z0-9])?$/;function J(r){return r.length===0?"":r.length>32?"\u540D\u79F0\u4E0D\u80FD\u8D85\u8FC7 32 \u4E2A\u5B57\u7B26":ae.test(r)?"":"\u4EC5\u5141\u8BB8\u5C0F\u5199\u5B57\u6BCD\u3001\u6570\u5B57\u3001\u8FDE\u5B57\u7B26\uFF0C\u4E14\u4E0D\u80FD\u4EE5\u8FDE\u5B57\u7B26\u5F00\u5934\u6216\u7ED3\u5C3E"}function G({active:r}){return e.default.createElement("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:r?2.2:1.6,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true"},e.default.createElement("path",{d:"M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"}),e.default.createElement("path",{d:"m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"}),e.default.createElement("path",{d:"M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"}),e.default.createElement("path",{d:"M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"}))}function oe({home:r}){return r.running===null||r.running===void 0?e.default.createElement("span",{className:"pl-badge pl-badge-unknown",title:"\u8FDB\u7A0B\u68C0\u6D4B\u4E0D\u53EF\u7528\uFF08pgrep \u5931\u8D25\uFF09"},e.default.createElement("span",{className:"pl-dot"})," \u72B6\u6001\u672A\u77E5"):r.current?e.default.createElement("span",{className:"pl-badge pl-badge-current",title:"\u5F53\u524D\u9762\u677F\u6240\u5728\u7684 profile \u5B9E\u4F8B"},e.default.createElement("span",{className:"pl-dot"})," \u5F53\u524D\u5B9E\u4F8B"):r.running?e.default.createElement("span",{className:"pl-badge pl-badge-running",title:"\u8BE5 profile \u684C\u9762\u7248\u6B63\u5728\u8FD0\u884C"},e.default.createElement("span",{className:"pl-dot pl-dot-pulse"})," \u8FD0\u884C\u4E2D"):e.default.createElement("span",{className:"pl-badge pl-badge-stopped",title:"\u8BE5 profile \u684C\u9762\u7248\u672A\u8FD0\u884C"},"\u672A\u8FD0\u884C")}function le({home:r,launching:t,onLaunch:o}){if(r.current||r.running===!0)return null;let s=t,l=t?"\u542F\u52A8\u4E2D\u2026":"\u542F\u52A8",p=b=>{b.preventDefault(),s||o(r)};return u?e.default.createElement(u,{variant:"secondary",size:"small",disabled:s,onClick:p},l):e.default.createElement("button",{type:"button",className:"pl-launch-btn",disabled:s,onClick:p},l)}function ie({home:r,busy:t,onStop:o}){if(r.current||r.running!==!0)return null;let s=t?"\u505C\u6B62\u4E2D\u2026":"\u505C\u6B62",l=p=>{p.preventDefault(),t||o(r)};return u?e.default.createElement(u,{variant:"secondary",size:"small",disabled:t,onClick:l},s):e.default.createElement("button",{type:"button",className:"pl-launch-btn",disabled:t,onClick:l},s)}function se({home:r,busy:t,immediate:o,onClick:s}){let[l,p]=(0,e.useState)(!1);return(0,e.useEffect)(()=>{if(!l)return;let f=setTimeout(()=>p(!1),3e3);return()=>clearTimeout(f)},[l]),r.current||r.running!==!1?null:e.default.createElement("button",{type:"button",className:l?"pl-danger-btn pl-danger-confirm":"pl-danger-btn",disabled:t,onClick:f=>{if(f.preventDefault(),!t){if(o||l){p(!1),s(r);return}p(!0)}}},t?"\u5220\u9664\u4E2D\u2026":l?"\u786E\u8BA4\u5220\u9664":"\u5220\u9664")}function de({home:r,launching:t,stopping:o,deleting:s,onLaunch:l,onStop:p,onDelete:b}){let f=r.bundleCount!=null?`${r.bundleCount} \u4E2A\u63D2\u4EF6\u6FC0\u6D3B \xB7 ${r.dependencyCount??0} \u4E2A\u5DF2\u5B89\u88C5`:"manifest \u4E0D\u53EF\u8BFB";return e.default.createElement("div",{className:"pl-card"},e.default.createElement("div",{className:"pl-card-main"},e.default.createElement("div",{className:"pl-card-title-row"},e.default.createElement("span",{className:"pl-card-name"},r.displayName),r.initialized===!1&&e.default.createElement("span",{className:"pl-badge pl-badge-pending",title:"\u5C1A\u65E0 profiles/desktop/package.json\u2014\u2014\u9996\u6B21\u542F\u52A8\u65F6\u7531\u5BBF\u4E3B\u81EA\u52A8\u5B8C\u6210\u521D\u59CB\u5316\uFF08\u7A7A profile \u5B9E\u8BC1\uFF0C\u65E0\u9700\u9884\u7F6E\u4EFB\u4F55\u6587\u4EF6\uFF09"},"\u5F85\u521D\u59CB\u5316")),e.default.createElement("span",{className:"pl-card-path",title:r.homePath},r.homePath),e.default.createElement("span",{className:"pl-card-bundles"},f)),e.default.createElement("div",{className:"pl-badges"},e.default.createElement(oe,{home:r}),e.default.createElement(le,{home:r,launching:t,onLaunch:l}),e.default.createElement(ie,{home:r,busy:o,onStop:p}),e.default.createElement(se,{home:r,busy:s,immediate:!!w,onClick:b})))}function pe(){let[r,t]=(0,e.useState)(null),[o,s]=(0,e.useState)(!0),[l,p]=(0,e.useState)(null),[b,f]=(0,e.useState)(null),[K,H]=(0,e.useState)(null),[_,D]=(0,e.useState)(null),[P,i]=(0,e.useState)(null),[h,L]=(0,e.useState)(!1),[C,A]=(0,e.useState)(""),[O,g]=(0,e.useState)(""),[z,S]=(0,e.useState)(""),[x,T]=(0,e.useState)(null),[W,F]=(0,e.useState)(!1),c=(0,e.useCallback)(async()=>{try{let n=await fetch("/profile-launcher/profiles");if(!n.ok)throw new Error(`HTTP ${n.status}`);t(await n.json()),p(null)}catch(n){p(n instanceof Error?n.message:String(n))}finally{s(!1)}},[]);(0,e.useEffect)(()=>{c()},[c]);let q=(0,e.useCallback)(async n=>{f(n.homePath),i(null);try{let a=await fetch("/profile-launcher/launch",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({homePath:n.homePath})}),d=await a.json().catch(()=>({}));a.ok?d.survived===!1?i({kind:"error",text:`${n.displayName} \u5B9E\u4F8B\u542F\u52A8\u540E\u5F88\u5FEB\u9000\u51FA\uFF0C\u8BF7\u68C0\u67E5\u8BE5 profile \u662F\u5426\u635F\u574F`}):i({kind:"ok",text:`${n.displayName} \u684C\u9762\u7248\u5DF2\u542F\u52A8`}):i({kind:"error",text:d.error??`\u542F\u52A8\u5931\u8D25\uFF08HTTP ${a.status}\uFF09`})}catch(a){i({kind:"error",text:a instanceof Error?a.message:String(a)})}finally{f(null),await c(),setTimeout(()=>c(),3e3)}},[c]),m=(0,e.useCallback)(()=>{L(!1),A(""),g(""),S("")},[]),M=(0,e.useCallback)(async()=>{let n=C.trim(),a=J(n);if(a){g(a);return}i(null);try{let d=await fetch("/profile-launcher/create",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:n,inheritFrom:z||void 0})}),v=await d.json().catch(()=>({}));d.ok?(m(),i({kind:"ok",text:v.inherited?.length>0?`\u5DF2\u521B\u5EFA\u5E76\u7EE7\u627F\u6A21\u578B\u914D\u7F6E\uFF08${v.inherited.join("\u3001")}\uFF09\uFF0C\u5F00\u7BB1\u5373\u7528\u3002\u9996\u6B21\u542F\u52A8\u5982\u51FA\u73B0\u300C\u767B\u5F55\u6216\u6DFB\u52A0 API Key\u300D\u5F15\u5BFC\u9875\uFF0C\u5C5E\u5B98\u65B9\u4E00\u6B21\u6027\u6D41\u7A0B\uFF0C\u5173\u95ED\u5373\u53EF`:`\u5DF2\u521B\u5EFA ${v.homePath}\u3002\u9996\u6B21\u542F\u52A8\u65F6\u81EA\u52A8\u5B8C\u6210\u521D\u59CB\u5316\uFF1B\u5B89\u88C5\u63D2\u4EF6\u8BF7\u5728\u542F\u52A8\u540E\u7684\u5E94\u7528\u5185\u300C\u63D2\u4EF6\u300D\u9875\u64CD\u4F5C`}),await c()):g(v.error??`\u65B0\u5EFA\u5931\u8D25\uFF08HTTP ${d.status}\uFF09`)}catch(d){i({kind:"error",text:d instanceof Error?d.message:String(d)})}},[C,z,m,c]),Q=(0,e.useCallback)(async n=>{H(n.homePath),i(null);try{let a=await fetch("/profile-launcher/stop",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({homePath:n.homePath})}),d=await a.json().catch(()=>({}));a.ok?i({kind:"ok",text:`${n.displayName} \u684C\u9762\u7248\u5DF2\u505C\u6B62`}):i({kind:"error",text:d.error??`\u505C\u6B62\u5931\u8D25\uFF08HTTP ${a.status}\uFF09`})}catch(a){i({kind:"error",text:a instanceof Error?a.message:String(a)})}finally{H(null),await c()}},[c]),B=(0,e.useCallback)(async n=>{D(n.homePath),i(null);try{let a=await fetch("/profile-launcher/delete",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({homePath:n.homePath})}),d=await a.json().catch(()=>({}));a.ok?i({kind:"ok",text:`\u5DF2\u5220\u9664 ${n.displayName}\uFF08${n.homePath}\uFF09`}):i({kind:"error",text:d.error??`\u5220\u9664\u5931\u8D25\uFF08HTTP ${a.status}\uFF09`})}catch(a){i({kind:"error",text:a instanceof Error?a.message:String(a)})}finally{D(null),await c()}},[c]),U=(0,e.useCallback)(n=>{w?(T(n),F(!1)):B(n)},[B]);return o?e.default.createElement("div",{className:"pl-container"},e.default.createElement("style",null,j),e.default.createElement("div",{className:"pl-loading"},"\u6B63\u5728\u626B\u63CF profile \u73AF\u5883\u2026")):e.default.createElement("div",{className:"pl-container"},e.default.createElement("style",null,j),e.default.createElement("div",{className:"pl-header"},e.default.createElement("div",null,e.default.createElement("div",{className:"pl-title"},e.default.createElement(G,{active:!0})," Profile \u542F\u52A8\u5668"),e.default.createElement("div",{className:"pl-subtitle"},"\u53D1\u73B0\u3001\u542F\u52A8\u3001\u65B0\u5EFA\u4E0E\u6E05\u7406\u4E0D\u540C profile \u7684 DSH \u684C\u9762\u7248\u73AF\u5883")),e.default.createElement("div",{className:"pl-actions"},e.default.createElement(ce,{open:h,onToggle:()=>{h?m():(L(!0),g(""),S(""))}}),e.default.createElement(fe,{onRefresh:c}))),h&&e.default.createElement("div",{className:"pl-form"},e.default.createElement("input",{className:"pl-input",type:"text",value:C,placeholder:"\u65B0 profile \u540D\u79F0\uFF08\u5982 sandbox\u3001test-235\uFF09",autoFocus:!0,onChange:n=>{A(n.target.value),g(J(n.target.value))},onKeyDown:n=>{n.key==="Enter"&&M(),n.key==="Escape"&&m()}}),e.default.createElement("select",{className:"pl-input pl-select",value:z,title:"\u65B0\u5EFA\u65F6\u4ECE\u65E2\u6709 profile \u590D\u5236\u6A21\u578B\u76F8\u5173\u914D\u7F6E\uFF08settings.yaml / .credentials.yaml / .env\uFF09",onChange:n=>S(n.target.value)},e.default.createElement("option",{value:""},"\u4E0D\u7EE7\u627F\uFF08\u7A7A profile\uFF09"),(r?.homes??[]).filter(n=>n.initialized===!0).map(n=>e.default.createElement("option",{key:n.homePath,value:n.homePath},"\u7EE7\u627F\u300C",n.displayName,"\u300D\u7684\u6A21\u578B\u914D\u7F6E"))),e.default.createElement(ue,{className:"pl-form-submit",onClick:M},"\u521B\u5EFA"),e.default.createElement("button",{type:"button",className:"pl-link-btn",onClick:m},"\u53D6\u6D88"),e.default.createElement("span",{className:"pl-form-note"},"home \u5C06\u521B\u5EFA\u4E3A ~/.dsh-<\u540D\u79F0>\uFF1B\u7EE7\u627F\u65F6\u590D\u5236\u6A21\u578B\u914D\u7F6E\u4E09\u4EF6\u5957\uFF08\u6765\u6E90\u7F3A\u5931\u7684\u8DF3\u8FC7\uFF09")),h&&O&&e.default.createElement("div",{className:"pl-error"},O),P&&e.default.createElement("div",{className:P.kind==="ok"?"pl-hint":"pl-error"},P.text),l&&e.default.createElement("div",{className:"pl-error"},"\u52A0\u8F7D\u5931\u8D25\uFF1A",l),r&&r.appPath===null&&e.default.createElement("div",{className:"pl-error"},"\u672A\u627E\u5230 DSH \u684C\u9762\u7248\u53EF\u6267\u884C\u6587\u4EF6\uFF0C\u542F\u52A8\u529F\u80FD\u4E0D\u53EF\u7528\uFF08\u63A2\u6D4B\u8FC7 argv[0] / execPath / /Applications \u9ED8\u8BA4\u8DEF\u5F84\uFF09"),e.default.createElement("div",{className:"pl-card-list"},r?.homes?.length?r.homes.map(n=>e.default.createElement(de,{key:n.homePath,home:n,launching:b===n.homePath,stopping:K===n.homePath,deleting:_===n.homePath,onLaunch:q,onStop:Q,onDelete:U})):e.default.createElement("div",{className:"pl-empty"},"\u672A\u53D1\u73B0\u4EFB\u4F55 profile \u73AF\u5883\uFF08~/.dsh* \u76EE\u5F55\u4E00\u4E2A\u90FD\u6CA1\u6709\uFF09")),w&&x&&e.default.createElement(w,{open:!0,title:`\u5220\u9664 profile\u300C${x.displayName}\u300D`,description:`\u5C06\u6C38\u4E45\u5220\u9664\u6574\u4E2A home \u76EE\u5F55 ${x.homePath}\uFF08\u542B desktop-user-data \u8FD0\u884C\u6570\u636E\uFF09\uFF0C\u4E0D\u53EF\u6062\u590D\u3002`,acknowledgeLabel:"\u6211\u7406\u89E3\u6B64\u64CD\u4F5C\u4E0D\u53EF\u64A4\u9500",cancelLabel:"\u53D6\u6D88",confirmLabel:"\u6C38\u4E45\u5220\u9664",acknowledged:W,onAcknowledgedChange:F,onCancel:()=>T(null),onConfirm:()=>{let n=x;T(null),B(n)}}))}function ce({open:r,onToggle:t}){return u?e.default.createElement(u,{variant:r?"ghost":"secondary",size:"small",onClick:t},r?"\u6536\u8D77":"\u65B0\u5EFA"):e.default.createElement("button",{type:"button",className:"pl-launch-btn",onClick:t},r?"\u6536\u8D77":"\u65B0\u5EFA")}function ue({className:r,onClick:t,children:o}){return u?e.default.createElement(u,{variant:"primary",size:"small",onClick:t},o):e.default.createElement("button",{type:"button",className:`pl-launch-btn ${r??""}`,onClick:t},o)}function fe({onRefresh:r}){return u?e.default.createElement(u,{variant:"ghost",size:"small",onClick:r},"\u5237\u65B0"):e.default.createElement("button",{type:"button",className:"pl-launch-btn",onClick:r},"\u5237\u65B0")}var be=["slots","layout"];function ge(r){r.slots.inject("sidebar.panellist",()=>r.slots.register({name:"sidebar.panellist",id:"profile-launcher",order:65,label:"Profile \u542F\u52A8\u5668"},G)),r.slots.inject("main",()=>r.slots.register({name:"main",key:"profile-launcher"},()=>e.default.createElement(k,null,e.default.createElement(pe,null))))}
return module.exports}})
