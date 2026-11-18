window.__ModuleLoader__.load({id:"@supertiny99/dsh-profile-launcher",factory:(require)=>{const module={exports:{}};const exports=module.exports;
var ce=Object.create;var $=Object.defineProperty;var ue=Object.getOwnPropertyDescriptor;var fe=Object.getOwnPropertyNames;var be=Object.getPrototypeOf,ge=Object.prototype.hasOwnProperty;var me=(r,n)=>{for(var s in n)$(r,s,{get:n[s],enumerable:!0})},R=(r,n,s,p)=>{if(n&&typeof n=="object"||typeof n=="function")for(let i of fe(n))!ge.call(r,i)&&i!==s&&$(r,i,{get:()=>n[i],enumerable:!(p=ue(n,i))||p.enumerable});return r};var J=(r,n,s)=>(s=r!=null?ce(be(r)):{},R(n||!r||!r.__esModule?$(s,"default",{value:r,enumerable:!0}):s,r)),he=r=>R($({},"__esModule",{value:!0}),r);var He={};me(He,{apply:()=>Be,inject:()=>ze});module.exports=he(He);var e=J(require("react"),1),ye=J(require("@deepseek-ai/dsh-client-ui-primitives"),1);var M=`.pl-container {
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

/* \u5B9E\u4F8B\u6807\u8BC6\uFF08pl-CHG-005\uFF09\uFF1A\u5361\u7247\u300C\u5DF2\u6807\u8BC6\u300D\u5FBD\u6807 + \u6CE8\u5165/\u79FB\u9664\u5C0F\u6309\u94AE */
.pl-badge-marked {
	color: #92400e;
	background: rgba(245, 158, 11, 0.12);
	border-color: rgba(245, 158, 11, 0.35);
}

.pl-badge-btn {
	display: inline-flex;
	align-items: center;
	font-size: 12px;
	font-weight: 500;
	border-radius: 8px;
	padding: 6px 10px;
	cursor: pointer;
	color: var(--dsw-alias-text-secondary, #475569);
	background: transparent;
	border: 1px solid var(--dsw-alias-border, #e2e8f0);
	white-space: nowrap;
}

.pl-badge-btn:hover:not(:disabled) {
	border-color: var(--dsw-alias-border-strong, #cbd5e1);
	color: var(--dsw-alias-text-primary, #0f172a);
}

.pl-badge-btn:disabled {
	opacity: 0.45;
	cursor: not-allowed;
}
`;var G=J(require("react"),1),S=class extends G.default.Component{constructor(n){super(n),this.state={error:null}}static getDerivedStateFromError(n){return{error:n}}componentDidCatch(n,s){console.error("[profile-launcher] panel error:",n,s)}render(){return this.state.error?G.default.createElement("div",{style:{padding:24,color:"#b91c1c",fontSize:13}},"Profile \u542F\u52A8\u5668\u9762\u677F\u6E32\u67D3\u51FA\u9519\uFF1A",String(this.state.error?.message??this.state.error)):this.props.children}};var z=ye??{},f=typeof z.Button=="function"?z.Button:null,j=typeof z.RiskConfirmation=="function"?z.RiskConfirmation:null,ke=/^[a-z0-9]([a-z0-9-]{0,30}[a-z0-9])?$/;function ee(r){return r.length===0?"":r.length>32?"\u540D\u79F0\u4E0D\u80FD\u8D85\u8FC7 32 \u4E2A\u5B57\u7B26":ke.test(r)?"":"\u4EC5\u5141\u8BB8\u5C0F\u5199\u5B57\u6BCD\u3001\u6570\u5B57\u3001\u8FDE\u5B57\u7B26\uFF0C\u4E14\u4E0D\u80FD\u4EE5\u8FDE\u5B57\u7B26\u5F00\u5934\u6216\u7ED3\u5C3E"}function te({active:r}){return e.default.createElement("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:r?2.2:1.6,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true"},e.default.createElement("path",{d:"M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"}),e.default.createElement("path",{d:"m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"}),e.default.createElement("path",{d:"M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"}),e.default.createElement("path",{d:"M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"}))}function ve({home:r}){return r.running===null||r.running===void 0?e.default.createElement("span",{className:"pl-badge pl-badge-unknown",title:"\u8FDB\u7A0B\u68C0\u6D4B\u4E0D\u53EF\u7528\uFF08pgrep \u5931\u8D25\uFF09"},e.default.createElement("span",{className:"pl-dot"})," \u72B6\u6001\u672A\u77E5"):r.current?e.default.createElement("span",{className:"pl-badge pl-badge-current",title:"\u5F53\u524D\u9762\u677F\u6240\u5728\u7684 profile \u5B9E\u4F8B"},e.default.createElement("span",{className:"pl-dot"})," \u5F53\u524D\u5B9E\u4F8B"):r.running?e.default.createElement("span",{className:"pl-badge pl-badge-running",title:"\u8BE5 profile \u684C\u9762\u7248\u6B63\u5728\u8FD0\u884C"},e.default.createElement("span",{className:"pl-dot pl-dot-pulse"})," \u8FD0\u884C\u4E2D"):e.default.createElement("span",{className:"pl-badge pl-badge-stopped",title:"\u8BE5 profile \u684C\u9762\u7248\u672A\u8FD0\u884C"},"\u672A\u8FD0\u884C")}function we({home:r,launching:n,onLaunch:s}){if(r.current||r.running===!0)return null;let p=n,i=n?"\u542F\u52A8\u4E2D\u2026":"\u542F\u52A8",c=h=>{h.preventDefault(),p||s(r)};return f?e.default.createElement(f,{variant:"secondary",size:"small",disabled:p,onClick:c},i):e.default.createElement("button",{type:"button",className:"pl-launch-btn",disabled:p,onClick:c},i)}function Ne({home:r,busy:n,onStop:s}){if(r.current||r.running!==!0)return null;let p=n?"\u505C\u6B62\u4E2D\u2026":"\u505C\u6B62",i=c=>{c.preventDefault(),n||s(r)};return f?e.default.createElement(f,{variant:"secondary",size:"small",disabled:n,onClick:i},p):e.default.createElement("button",{type:"button",className:"pl-launch-btn",disabled:n,onClick:i},p)}function Pe({home:r,busy:n,immediate:s,onClick:p}){let[i,c]=(0,e.useState)(!1);return(0,e.useEffect)(()=>{if(!i)return;let u=setTimeout(()=>c(!1),3e3);return()=>clearTimeout(u)},[i]),r.current||r.running!==!1?null:e.default.createElement("button",{type:"button",className:i?"pl-danger-btn pl-danger-confirm":"pl-danger-btn",disabled:n,onClick:u=>{if(u.preventDefault(),!n){if(s||i){c(!1),p(r);return}c(!0)}}},n?"\u5220\u9664\u4E2D\u2026":i?"\u786E\u8BA4\u5220\u9664":"\u5220\u9664")}function Ce({home:r,launching:n,stopping:s,deleting:p,badging:i,onLaunch:c,onStop:h,onDelete:u,onInjectBadge:B,onRemoveBadge:x}){let H=r.bundleCount!=null?`${r.bundleCount} \u4E2A\u63D2\u4EF6\u6FC0\u6D3B \xB7 ${r.dependencyCount??0} \u4E2A\u5DF2\u5B89\u88C5`:"manifest \u4E0D\u53EF\u8BFB";return e.default.createElement("div",{className:"pl-card"},e.default.createElement("div",{className:"pl-card-main"},e.default.createElement("div",{className:"pl-card-title-row"},e.default.createElement("span",{className:"pl-card-name"},r.displayName),r.badgeInjected===!0&&e.default.createElement("span",{className:"pl-badge pl-badge-marked",title:"\u5DF2\u6CE8\u5165\u5B9E\u4F8B\u6807\u8BC6\u6D6E\u6807\uFF1A\u8BE5 profile \u684C\u9762\u7248\u7A97\u53E3\u53F3\u4E0B\u89D2\u663E\u793A\u672C profile \u540D\u79F0\uFF08\u91CD\u542F\u540E\u751F\u6548\uFF09"},"\u5DF2\u6807\u8BC6"),r.initialized===!1&&e.default.createElement("span",{className:"pl-badge pl-badge-pending",title:"\u5C1A\u65E0 profiles/desktop/package.json\u2014\u2014\u9996\u6B21\u542F\u52A8\u65F6\u7531\u5BBF\u4E3B\u81EA\u52A8\u5B8C\u6210\u521D\u59CB\u5316\uFF08\u7A7A profile \u5B9E\u8BC1\uFF0C\u65E0\u9700\u9884\u7F6E\u4EFB\u4F55\u6587\u4EF6\uFF09"},"\u5F85\u521D\u59CB\u5316")),e.default.createElement("span",{className:"pl-card-path",title:r.homePath},r.homePath),e.default.createElement("span",{className:"pl-card-bundles"},H)),e.default.createElement("div",{className:"pl-badges"},e.default.createElement(ve,{home:r}),e.default.createElement(we,{home:r,launching:n,onLaunch:c}),e.default.createElement(Ne,{home:r,busy:s,onStop:h}),r.initialized!==!1&&r.badgeInjected!==!0&&e.default.createElement("button",{type:"button",className:"pl-badge-btn",disabled:i,title:"\u6CE8\u5165\u5B9E\u4F8B\u6807\u8BC6\u6D6E\u6807\uFF08\u7A97\u53E3\u53F3\u4E0B\u89D2\u663E\u793A profile \u540D\u79F0\uFF0C\u91CD\u542F\u5B9E\u4F8B\u540E\u751F\u6548\uFF09",onClick:B},i?"\u6CE8\u5165\u4E2D\u2026":"\u6CE8\u5165\u6807\u8BC6"),r.badgeInjected===!0&&e.default.createElement("button",{type:"button",className:"pl-badge-btn",disabled:i,title:"\u79FB\u9664\u5B9E\u4F8B\u6807\u8BC6\u6D6E\u6807\uFF08\u91CD\u542F\u5B9E\u4F8B\u540E\u6062\u590D\u539F\u72B6\uFF09",onClick:x},i?"\u79FB\u9664\u4E2D\u2026":"\u79FB\u9664\u6807\u8BC6"),e.default.createElement(Pe,{home:r,busy:p,immediate:!!j,onClick:u})))}function Te(){let[r,n]=(0,e.useState)(null),[s,p]=(0,e.useState)(!0),[i,c]=(0,e.useState)(null),[h,u]=(0,e.useState)(null),[B,x]=(0,e.useState)(null),[H,q]=(0,e.useState)(null),[re,y]=(0,e.useState)(null),[E,o]=(0,e.useState)(null),[N,K]=(0,e.useState)(!1),[O,_]=(0,e.useState)(""),[W,k]=(0,e.useState)(""),[D,L]=(0,e.useState)(""),[P,A]=(0,e.useState)(null),[ae,Q]=(0,e.useState)(!1),d=(0,e.useCallback)(async()=>{try{let t=await fetch("/profile-launcher/profiles");if(!t.ok)throw new Error(`HTTP ${t.status}`);n(await t.json()),c(null)}catch(t){c(t instanceof Error?t.message:String(t))}finally{p(!1)}},[]);(0,e.useEffect)(()=>{d()},[d]);let v=(0,e.useCallback)(async t=>{let a=await fetch("/profile-launcher/launch",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({homePath:t})});return{ok:a.ok,data:await a.json().catch(()=>({})),status:a.status}},[]),U=(0,e.useCallback)(async t=>{let a=await fetch("/profile-launcher/stop",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({homePath:t})});return{ok:a.ok,data:await a.json().catch(()=>({})),status:a.status}},[]),ne=(0,e.useCallback)(async t=>{u(t.homePath),o(null);try{let{ok:a,data:l}=await v(t.homePath);a?l.survived===!1?o({kind:"error",text:`${t.displayName} \u5B9E\u4F8B\u542F\u52A8\u540E\u5F88\u5FEB\u9000\u51FA\uFF0C\u8BF7\u68C0\u67E5\u8BE5 profile \u662F\u5426\u635F\u574F`}):o({kind:"ok",text:`${t.displayName} \u684C\u9762\u7248\u5DF2\u542F\u52A8`}):o({kind:"error",text:l.error??`\u542F\u52A8\u5931\u8D25\uFF08HTTP ${l.status??""}\uFF09`})}catch(a){o({kind:"error",text:a instanceof Error?a.message:String(a)})}finally{u(null),await d(),setTimeout(()=>d(),3e3)}},[v,d]),oe=t=>new Promise(a=>setTimeout(a,t)),V=(0,e.useCallback)(async(t,a,l="")=>{let b=g=>(o({kind:"error",text:`${g}\uFF08profile \u5DF2\u521B\u5EFA\u53EF\u7528\uFF0C\u6807\u8BC6\u53EF\u7A0D\u540E\u5728\u5361\u7247\u300C\u6CE8\u5165\u6807\u8BC6\u300D\u8865\u4E0A\uFF09`}),!1);o({kind:"ok",text:`${t} \u5DF2\u521B\u5EFA\uFF0C\u6B63\u5728\u9996\u6B21\u542F\u52A8\u5B8C\u6210\u5BBF\u4E3B\u521D\u59CB\u5316\u2026`}),u(a);let m;try{m=await v(a)}finally{u(null)}if(!m.ok)return b(`\u9996\u6B21\u542F\u52A8\u5931\u8D25\uFF1A${m.data.error??`HTTP ${m.status}`}`);if(m.data.survived===!1)return b("\u9996\u6B21\u542F\u52A8\u540E\u5B9E\u4F8B\u5F88\u5FEB\u9000\u51FA");await d(),o({kind:"ok",text:`${t} \u521D\u59CB\u5316\u4E2D\uFF0C\u7B49\u5F85\u5BBF\u4E3B\u5C31\u7EEA\u2026`});let Y=!1;for(let g=0;g<20;g+=1){await oe(2e3);try{let Z=await fetch("/profile-launcher/profiles");if(Z.ok&&(await Z.json()).homes?.find(pe=>pe.homePath===a)?.initialized===!0){Y=!0;break}}catch{}}if(!Y)return b("\u7B49\u5F85\u5BBF\u4E3B\u521D\u59CB\u5316\u8D85\u65F6");o({kind:"ok",text:`${t} \u521D\u59CB\u5316\u5B8C\u6210\uFF0C\u6B63\u5728\u505C\u6B62\u5B9E\u4F8B\u4EE5\u6CE8\u5165\u6807\u8BC6\u2026`}),x(a);let C;try{C=await U(a)}finally{x(null)}if(!C.ok)return b(`\u505C\u6B62\u5B9E\u4F8B\u5931\u8D25\uFF1A${C.data.error??`HTTP ${C.status}`}`);o({kind:"ok",text:`${t} \u6B63\u5728\u6CE8\u5165\u5B9E\u4F8B\u6807\u8BC6\u2026`}),y(a);let T;try{T=await fetch("/profile-launcher/inject-badge",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({homePath:a})}).then(async g=>({ok:g.ok,data:await g.json().catch(()=>({})),status:g.status}))}finally{y(null)}if(!T.ok)return b(`\u6CE8\u5165\u6807\u8BC6\u5931\u8D25\uFF1A${T.data.error??`HTTP ${T.status}`}`);o({kind:"ok",text:`${t} \u6807\u8BC6\u5DF2\u6CE8\u5165\uFF0C\u6B63\u5728\u91CD\u65B0\u542F\u52A8\u2026`}),u(a);let F;try{F=await v(a)}finally{u(null)}return!F.ok||F.data.survived===!1?o({kind:"ok",text:`${t} \u6807\u8BC6\u6CE8\u5165\u5B8C\u6210\uFF1B\u5B9E\u4F8B\u91CD\u542F\u672A\u5C31\u7EEA\uFF0C\u53EF\u7A0D\u540E\u624B\u52A8\u542F\u52A8${l}`}):o({kind:"ok",text:`${t} \u5DF2\u5C31\u7EEA\uFF1A\u7A97\u53E3\u53F3\u4E0B\u89D2\u6D6E\u6807\u663E\u793A\u672C profile \u540D\u79F0${l}`}),await d(),setTimeout(()=>d(),3e3),!0},[v,U,d]),w=(0,e.useCallback)(()=>{K(!1),_(""),k(""),L("")},[]),X=(0,e.useCallback)(async()=>{let t=O.trim(),a=ee(t);if(a){k(a);return}o(null);try{let l=await fetch("/profile-launcher/create",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:t,inheritFrom:D||void 0})}),b=await l.json().catch(()=>({}));if(!l.ok)k(b.error??`\u65B0\u5EFA\u5931\u8D25\uFF08HTTP ${l.status}\uFF09`);else{w();let m=b.inherited?.length>0?"\uFF08\u5DF2\u7EE7\u627F\u6A21\u578B\u914D\u7F6E\uFF1B\u9996\u6B21\u542F\u52A8\u5982\u51FA\u73B0\u300C\u767B\u5F55\u6216\u6DFB\u52A0 API Key\u300D\u5F15\u5BFC\u9875\uFF0C\u5C5E\u5B98\u65B9\u4E00\u6B21\u6027\u6D41\u7A0B\uFF0C\u5173\u95ED\u5373\u53EF\uFF09":"";await V(t,b.homePath,m)}}catch(l){o({kind:"error",text:l instanceof Error?l.message:String(l)})}},[O,D,w,V]),ie=(0,e.useCallback)(async t=>{y(t.homePath),o(null);try{let a=await fetch("/profile-launcher/inject-badge",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({homePath:t.homePath})}),l=await a.json().catch(()=>({}));a.ok?t.running===!0?o({kind:"ok",text:`${t.displayName} \u6807\u8BC6\u5DF2\u6CE8\u5165\uFF0C\u91CD\u542F\u8BE5\u5B9E\u4F8B\u540E\u751F\u6548\uFF08\u5361\u7247\u300C\u505C\u6B62\u300D\u540E\u518D\u300C\u542F\u52A8\u300D\uFF09`}):o({kind:"ok",text:`${t.displayName} \u6807\u8BC6\u5DF2\u6CE8\u5165\uFF0C\u4E0B\u6B21\u542F\u52A8\u5373\u751F\u6548`}):o({kind:"error",text:l.error??`\u6CE8\u5165\u5931\u8D25\uFF08HTTP ${a.status}\uFF09`})}catch(a){o({kind:"error",text:a instanceof Error?a.message:String(a)})}finally{y(null),await d()}},[d]),le=(0,e.useCallback)(async t=>{y(t.homePath),o(null);try{let a=await fetch("/profile-launcher/remove-badge",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({homePath:t.homePath})}),l=await a.json().catch(()=>({}));a.ok?l.removed===!1?o({kind:"ok",text:l.message??"\u8BE5 profile \u672A\u6CE8\u5165\u6807\u8BC6"}):t.running===!0?o({kind:"ok",text:`${t.displayName} \u6807\u8BC6\u5DF2\u79FB\u9664\uFF0C\u91CD\u542F\u8BE5\u5B9E\u4F8B\u540E\u6062\u590D\u539F\u72B6`}):o({kind:"ok",text:`${t.displayName} \u6807\u8BC6\u5DF2\u79FB\u9664\uFF0C\u4E0B\u6B21\u542F\u52A8\u5373\u6062\u590D\u539F\u72B6`}):o({kind:"error",text:l.error??`\u79FB\u9664\u5931\u8D25\uFF08HTTP ${a.status}\uFF09`})}catch(a){o({kind:"error",text:a instanceof Error?a.message:String(a)})}finally{y(null),await d()}},[d]),se=(0,e.useCallback)(async t=>{x(t.homePath),o(null);try{let a=await fetch("/profile-launcher/stop",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({homePath:t.homePath})}),l=await a.json().catch(()=>({}));a.ok?o({kind:"ok",text:`${t.displayName} \u684C\u9762\u7248\u5DF2\u505C\u6B62`}):o({kind:"error",text:l.error??`\u505C\u6B62\u5931\u8D25\uFF08HTTP ${a.status}\uFF09`})}catch(a){o({kind:"error",text:a instanceof Error?a.message:String(a)})}finally{x(null),await d()}},[d]),I=(0,e.useCallback)(async t=>{q(t.homePath),o(null);try{let a=await fetch("/profile-launcher/delete",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({homePath:t.homePath})}),l=await a.json().catch(()=>({}));a.ok?o({kind:"ok",text:`\u5DF2\u5220\u9664 ${t.displayName}\uFF08${t.homePath}\uFF09`}):o({kind:"error",text:l.error??`\u5220\u9664\u5931\u8D25\uFF08HTTP ${a.status}\uFF09`})}catch(a){o({kind:"error",text:a instanceof Error?a.message:String(a)})}finally{q(null),await d()}},[d]),de=(0,e.useCallback)(t=>{j?(A(t),Q(!1)):I(t)},[I]);return s?e.default.createElement("div",{className:"pl-container"},e.default.createElement("style",null,M),e.default.createElement("div",{className:"pl-loading"},"\u6B63\u5728\u626B\u63CF profile \u73AF\u5883\u2026")):e.default.createElement("div",{className:"pl-container"},e.default.createElement("style",null,M),e.default.createElement("div",{className:"pl-header"},e.default.createElement("div",null,e.default.createElement("div",{className:"pl-title"},e.default.createElement(te,{active:!0})," Profile \u542F\u52A8\u5668"),e.default.createElement("div",{className:"pl-subtitle"},"\u53D1\u73B0\u3001\u542F\u52A8\u3001\u65B0\u5EFA\u4E0E\u6E05\u7406\u4E0D\u540C profile \u7684 DSH \u684C\u9762\u7248\u73AF\u5883")),e.default.createElement("div",{className:"pl-actions"},e.default.createElement($e,{open:N,onToggle:()=>{N?w():(K(!0),k(""),L(""))}}),e.default.createElement(je,{onRefresh:d}))),N&&e.default.createElement("div",{className:"pl-form"},e.default.createElement("input",{className:"pl-input",type:"text",value:O,placeholder:"\u65B0 profile \u540D\u79F0\uFF08\u5982 sandbox\u3001test-235\uFF09",autoFocus:!0,onChange:t=>{_(t.target.value),k(ee(t.target.value))},onKeyDown:t=>{t.key==="Enter"&&X(),t.key==="Escape"&&w()}}),e.default.createElement("select",{className:"pl-input pl-select",value:D,title:"\u65B0\u5EFA\u65F6\u4ECE\u65E2\u6709 profile \u590D\u5236\u6A21\u578B\u76F8\u5173\u914D\u7F6E\uFF08settings.yaml / .credentials.yaml / .env\uFF09",onChange:t=>L(t.target.value)},e.default.createElement("option",{value:""},"\u4E0D\u7EE7\u627F\uFF08\u7A7A profile\uFF09"),(r?.homes??[]).filter(t=>t.initialized===!0).map(t=>e.default.createElement("option",{key:t.homePath,value:t.homePath},"\u7EE7\u627F\u300C",t.displayName,"\u300D\u7684\u6A21\u578B\u914D\u7F6E"))),e.default.createElement(Se,{className:"pl-form-submit",onClick:X},"\u521B\u5EFA"),e.default.createElement("button",{type:"button",className:"pl-link-btn",onClick:w},"\u53D6\u6D88"),e.default.createElement("span",{className:"pl-form-note"},"home \u5C06\u521B\u5EFA\u4E3A ~/.dsh-<\u540D\u79F0>\uFF1B\u7EE7\u627F\u65F6\u590D\u5236\u6A21\u578B\u914D\u7F6E\u4E09\u4EF6\u5957\uFF08\u6765\u6E90\u7F3A\u5931\u7684\u8DF3\u8FC7\uFF09")),N&&W&&e.default.createElement("div",{className:"pl-error"},W),E&&e.default.createElement("div",{className:E.kind==="ok"?"pl-hint":"pl-error"},E.text),i&&e.default.createElement("div",{className:"pl-error"},"\u52A0\u8F7D\u5931\u8D25\uFF1A",i),r&&r.appPath===null&&e.default.createElement("div",{className:"pl-error"},"\u672A\u627E\u5230 DSH \u684C\u9762\u7248\u53EF\u6267\u884C\u6587\u4EF6\uFF0C\u542F\u52A8\u529F\u80FD\u4E0D\u53EF\u7528\uFF08\u63A2\u6D4B\u8FC7 argv[0] / execPath / /Applications \u9ED8\u8BA4\u8DEF\u5F84\uFF09"),e.default.createElement("div",{className:"pl-card-list"},r?.homes?.length?r.homes.map(t=>e.default.createElement(Ce,{key:t.homePath,home:t,launching:h===t.homePath,stopping:B===t.homePath,deleting:H===t.homePath,badging:re===t.homePath,onLaunch:ne,onStop:se,onDelete:de,onInjectBadge:ie,onRemoveBadge:le})):e.default.createElement("div",{className:"pl-empty"},"\u672A\u53D1\u73B0\u4EFB\u4F55 profile \u73AF\u5883\uFF08~/.dsh* \u76EE\u5F55\u4E00\u4E2A\u90FD\u6CA1\u6709\uFF09")),j&&P&&e.default.createElement(j,{open:!0,title:`\u5220\u9664 profile\u300C${P.displayName}\u300D`,description:`\u5C06\u6C38\u4E45\u5220\u9664\u6574\u4E2A home \u76EE\u5F55 ${P.homePath}\uFF08\u542B desktop-user-data \u8FD0\u884C\u6570\u636E\uFF09\uFF0C\u4E0D\u53EF\u6062\u590D\u3002`,acknowledgeLabel:"\u6211\u7406\u89E3\u6B64\u64CD\u4F5C\u4E0D\u53EF\u64A4\u9500",cancelLabel:"\u53D6\u6D88",confirmLabel:"\u6C38\u4E45\u5220\u9664",acknowledged:ae,onAcknowledgedChange:Q,onCancel:()=>A(null),onConfirm:()=>{let t=P;A(null),I(t)}}))}function $e({open:r,onToggle:n}){return f?e.default.createElement(f,{variant:r?"ghost":"secondary",size:"small",onClick:n},r?"\u6536\u8D77":"\u65B0\u5EFA"):e.default.createElement("button",{type:"button",className:"pl-launch-btn",onClick:n},r?"\u6536\u8D77":"\u65B0\u5EFA")}function Se({className:r,onClick:n,children:s}){return f?e.default.createElement(f,{variant:"primary",size:"small",onClick:n},s):e.default.createElement("button",{type:"button",className:`pl-launch-btn ${r??""}`,onClick:n},s)}function je({onRefresh:r}){return f?e.default.createElement(f,{variant:"ghost",size:"small",onClick:r},"\u5237\u65B0"):e.default.createElement("button",{type:"button",className:"pl-launch-btn",onClick:r},"\u5237\u65B0")}var ze=["slots","layout"];function Be(r){r.slots.inject("sidebar.panellist",()=>r.slots.register({name:"sidebar.panellist",id:"profile-launcher",order:65,label:"Profile \u542F\u52A8\u5668"},te)),r.slots.inject("main",()=>r.slots.register({name:"main",key:"profile-launcher"},()=>e.default.createElement(S,null,e.default.createElement(Te,null))))}
return module.exports}})
