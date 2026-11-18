// @supertiny99/dsh-profile-launcher — Client 半：侧栏整页面板
// slots: sidebar.panellist(order 65 火箭图标) + main(key: profile-launcher)
// 数据走 Host webServer 前缀路由 /profile-launcher（fetch）
import React, { useCallback, useEffect, useState } from 'react';
import * as Primitives from '@deepseek-ai/dsh-client-ui-primitives';

import css from './launcher.css';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';

// primitives 能力检测降级（cg-CHG-001 教训）：宿主批次版本差时缺失成员降级为原生元素
const P = Primitives ?? {};
const PrimaryButton =
	typeof P.Button === 'function' ? P.Button : null;
// 删除确认上选官方 RiskConfirmation（勾选承认制，ui-gallery overlays 实证）；
// 缺失时降级为内嵌二次确认按钮（3s 内再点执行）
const RiskConfirm =
	typeof P.RiskConfirmation === 'function' ? P.RiskConfirmation : null;

// 新建名称即时校验（与 launcher-core.js validateProfileName 同规则，双端各自持有——
// client 不引 launcher-core：其 node:path import 在浏览器 bundle 会炸）
const PROFILE_NAME_RE = /^[a-z0-9]([a-z0-9-]{0,30}[a-z0-9])?$/;
function checkName(name) {
	if (name.length === 0) return '';
	if (name.length > 32) return '名称不能超过 32 个字符';
	if (!PROFILE_NAME_RE.test(name)) return '仅允许小写字母、数字、连字符，且不能以连字符开头或结尾';
	return '';
}

function PanelIcon({ active }) {
	return (
		<svg
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={active ? 2.2 : 1.6}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
			<path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
			<path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
			<path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
		</svg>
	);
}

function StatusBadge({ home }) {
	if (home.running === null || home.running === undefined) {
		return (
			<span className="pl-badge pl-badge-unknown" title="进程检测不可用（pgrep 失败）">
				<span className="pl-dot" /> 状态未知
			</span>
		);
	}
	if (home.current) {
		return (
			<span className="pl-badge pl-badge-current" title="当前面板所在的 profile 实例">
				<span className="pl-dot" /> 当前实例
			</span>
		);
	}
	if (home.running) {
		return (
			<span className="pl-badge pl-badge-running" title="该 profile 桌面版正在运行">
				<span className="pl-dot pl-dot-pulse" /> 运行中
			</span>
		);
	}
	return (
		<span className="pl-badge pl-badge-stopped" title="该 profile 桌面版未运行">
			未运行
		</span>
	);
}

function LaunchButton({ home, launching, onLaunch }) {
	// 当前实例 / 运行中：不渲染按钮——状态徽章是唯一状态来源，
	// 禁用按钮复述同一文字会造成视觉重复（2026-11-17 实装反馈）
	if (home.current || home.running === true) return null;
	const disabled = launching;
	const label = launching ? '启动中…' : '启动';

	const handleClick = (e) => {
		e.preventDefault();
		if (!disabled) onLaunch(home);
	};

	if (PrimaryButton) {
		return (
			<PrimaryButton variant="secondary" size="small" disabled={disabled} onClick={handleClick}>
				{label}
			</PrimaryButton>
		);
	}
	return (
		<button type="button" className="pl-launch-btn" disabled={disabled} onClick={handleClick}>
			{label}
		</button>
	);
}

function StopButton({ home, busy, onStop }) {
	if (home.current || home.running !== true) return null;
	const label = busy ? '停止中…' : '停止';
	const handleClick = (e) => {
		e.preventDefault();
		if (!busy) onStop(home);
	};
	if (PrimaryButton) {
		return (
			<PrimaryButton variant="secondary" size="small" disabled={busy} onClick={handleClick}>
				{label}
			</PrimaryButton>
		);
	}
	return (
		<button type="button" className="pl-launch-btn" disabled={busy} onClick={handleClick}>
			{label}
		</button>
	);
}

// 删除按钮：不可触发态不渲染（running === false 且非当前实例才给入口；
// 未知态 null 不给删——后端同样拒绝）。immediate=有官方 RiskConfirmation 可弹（点删除
// 即弹框）；降级路径内嵌二次确认（点一次变「确认删除」，3s 超时还原）
function DeleteButton({ home, busy, immediate, onClick }) {
	const [confirming, setConfirming] = useState(false);
	useEffect(() => {
		if (!confirming) return undefined;
		const t = setTimeout(() => setConfirming(false), 3000);
		return () => clearTimeout(t);
	}, [confirming]);
	if (home.current || home.running !== false) return null;
	const handleClick = (e) => {
		e.preventDefault();
		if (busy) return;
		if (immediate || confirming) {
			setConfirming(false);
			onClick(home);
			return;
		}
		setConfirming(true);
	};
	return (
		<button type="button" className={confirming ? 'pl-danger-btn pl-danger-confirm' : 'pl-danger-btn'} disabled={busy} onClick={handleClick}>
			{busy ? '删除中…' : confirming ? '确认删除' : '删除'}
		</button>
	);
}

function HomeCard({ home, launching, stopping, deleting, badging, onLaunch, onStop, onDelete, onInjectBadge, onRemoveBadge }) {
	const metaLine =
		home.bundleCount != null
			? `${home.bundleCount} 个插件激活 · ${home.dependencyCount ?? 0} 个已安装`
			: 'manifest 不可读';
	return (
		<div className="pl-card">
			<div className="pl-card-main">
				<div className="pl-card-title-row">
					<span className="pl-card-name">{home.displayName}</span>
					{home.badgeInjected === true && (
						<span className="pl-badge pl-badge-marked" title="已注入实例标识浮标：该 profile 桌面版窗口右下角显示本 profile 名称（重启后生效）">
							已标识
						</span>
					)}
					{home.initialized === false && (
						<span className="pl-badge pl-badge-pending" title="尚无 profiles/desktop/package.json——首次启动时由宿主自动完成初始化（空 profile 实证，无需预置任何文件）">
							待初始化
						</span>
					)}
				</div>
				<span className="pl-card-path" title={home.homePath}>
					{home.homePath}
				</span>
				<span className="pl-card-bundles">{metaLine}</span>
			</div>
			<div className="pl-badges">
				<StatusBadge home={home} />
				<LaunchButton home={home} launching={launching} onLaunch={onLaunch} />
				<StopButton home={home} busy={stopping} onStop={onStop} />
				{home.initialized !== false && home.badgeInjected !== true && (
					<button
						type="button"
						className="pl-badge-btn"
						disabled={badging}
						title="注入实例标识浮标（窗口右下角显示 profile 名称，重启实例后生效）"
						onClick={() => onInjectBadge(home)}
					>
						{badging ? '注入中…' : '注入标识'}
					</button>
				)}
				{home.badgeInjected === true && (
					<button
						type="button"
						className="pl-badge-btn"
						disabled={badging}
						title="移除实例标识浮标（重启实例后恢复原状）"
						onClick={() => onRemoveBadge(home)}
					>
						{badging ? '移除中…' : '移除标识'}
					</button>
				)}
				<DeleteButton home={home} busy={deleting} immediate={Boolean(RiskConfirm)} onClick={onDelete} />
			</div>
		</div>
	);
}

function LauncherPanel() {
	const [state, setState] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [launchingHome, setLaunchingHome] = useState(null);
	const [stoppingHome, setStoppingHome] = useState(null);
	const [deletingHome, setDeletingHome] = useState(null);
	const [badgingHome, setBadgingHome] = useState(null);
	const [toast, setToast] = useState(null);
	// 新建表单（header 内联展开）
	const [creating, setCreating] = useState(false);
	const [newName, setNewName] = useState('');
	const [nameError, setNameError] = useState('');
	// 配置继承来源（pl-CHG-003）：空串 = 不继承（默认，行为与 v0.2.0 一致）
	const [inheritFrom, setInheritFrom] = useState('');
	// 删除确认（官方 RiskConfirmation；ack 勾选态随开框重置）
	const [deleteAsk, setDeleteAsk] = useState(null);
	const [deleteAck, setDeleteAck] = useState(false);

	const refresh = useCallback(async () => {
		try {
			const res = await fetch('/profile-launcher/profiles');
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			setState(await res.json());
			setError(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : String(err));
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		refresh();
	}, [refresh]);

	// 低层请求（pl-CHG-005 抽取）：launch/stop 供单步操作与新建标识编排共用
	const launchRequest = useCallback(async (homePath) => {
		const res = await fetch('/profile-launcher/launch', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ homePath }),
		});
		return { ok: res.ok, data: await res.json().catch(() => ({})), status: res.status };
	}, []);

	const stopRequest = useCallback(async (homePath) => {
		const res = await fetch('/profile-launcher/stop', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ homePath }),
		});
		return { ok: res.ok, data: await res.json().catch(() => ({})), status: res.status };
	}, []);

	const handleLaunch = useCallback(
		async (home) => {
			setLaunchingHome(home.homePath);
			setToast(null);
			try {
				const { ok, data } = await launchRequest(home.homePath);
				if (!ok) {
					setToast({ kind: 'error', text: data.error ?? `启动失败（HTTP ${data.status ?? ''}）` });
				} else if (data.survived === false) {
					setToast({ kind: 'error', text: `${home.displayName} 实例启动后很快退出，请检查该 profile 是否损坏` });
				} else {
					setToast({ kind: 'ok', text: `${home.displayName} 桌面版已启动` });
				}
			} catch (err) {
				setToast({ kind: 'error', text: err instanceof Error ? err.message : String(err) });
			} finally {
				setLaunchingHome(null);
				await refresh();
				// 二次刷新：新实例 host 进程完全就位可能略滞后
				setTimeout(() => refresh(), 3000);
			}
		},
		[launchRequest, refresh]
	);

	// 新建自动注入编排（pl-CHG-005 AC3）：create 后自动
	// 首启（宿主初始化）→ 轮询 initialized → 停止 → 注入标识 → 再启动。
	// 任一步失败即中止并如实提示（profile 仍可用，标识可稍后卡片手动注入）。
	const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
	const runBadgeBootstrap = useCallback(
		async (displayName, homePath, inheritedHint = '') => {
			const abort = (text) => {
				setToast({ kind: 'error', text: `${text}（profile 已创建可用，标识可稍后在卡片「注入标识」补上）` });
				return false;
			};
			setToast({ kind: 'ok', text: `${displayName} 已创建，正在首次启动完成宿主初始化…` });
			setLaunchingHome(homePath);
			let launch;
			try {
				launch = await launchRequest(homePath);
			} finally {
				setLaunchingHome(null);
			}
			if (!launch.ok) return abort(`首次启动失败：${launch.data.error ?? `HTTP ${launch.status}`}`);
			if (launch.data.survived === false) return abort('首次启动后实例很快退出');
			await refresh();

			setToast({ kind: 'ok', text: `${displayName} 初始化中，等待宿主就绪…` });
			let initialized = false;
			for (let i = 0; i < 20; i += 1) {
				await sleep(2000);
				try {
					const res = await fetch('/profile-launcher/profiles');
					if (res.ok) {
						const snapshot = await res.json();
						const target = snapshot.homes?.find((h) => h.homePath === homePath);
						if (target?.initialized === true) {
							initialized = true;
							break;
						}
					}
				} catch {
					// 轮询失败继续重试
				}
			}
			if (!initialized) return abort('等待宿主初始化超时');

			setToast({ kind: 'ok', text: `${displayName} 初始化完成，正在停止实例以注入标识…` });
			setStoppingHome(homePath);
			let stop;
			try {
				stop = await stopRequest(homePath);
			} finally {
				setStoppingHome(null);
			}
			if (!stop.ok) return abort(`停止实例失败：${stop.data.error ?? `HTTP ${stop.status}`}`);

			setToast({ kind: 'ok', text: `${displayName} 正在注入实例标识…` });
			setBadgingHome(homePath);
			let inject;
			try {
				inject = await fetch('/profile-launcher/inject-badge', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ homePath }),
				}).then(async (res) => ({ ok: res.ok, data: await res.json().catch(() => ({})), status: res.status }));
			} finally {
				setBadgingHome(null);
			}
			if (!inject.ok) return abort(`注入标识失败：${inject.data.error ?? `HTTP ${inject.status}`}`);

			setToast({ kind: 'ok', text: `${displayName} 标识已注入，正在重新启动…` });
			setLaunchingHome(homePath);
			let relaunch;
			try {
				relaunch = await launchRequest(homePath);
			} finally {
				setLaunchingHome(null);
			}
			if (!relaunch.ok || relaunch.data.survived === false) {
				setToast({ kind: 'ok', text: `${displayName} 标识注入完成；实例重启未就绪，可稍后手动启动${inheritedHint}` });
			} else {
				setToast({ kind: 'ok', text: `${displayName} 已就绪：窗口右下角浮标显示本 profile 名称${inheritedHint}` });
			}
			await refresh();
			setTimeout(() => refresh(), 3000);
			return true;
		},
		[launchRequest, stopRequest, refresh]
	);

	const closeCreateForm = useCallback(() => {
		setCreating(false);
		setNewName('');
		setNameError('');
		setInheritFrom('');
	}, []);

	const handleCreate = useCallback(async () => {
		const name = newName.trim();
		const invalid = checkName(name);
		if (invalid) {
			setNameError(invalid);
			return;
		}
		setToast(null);
		try {
			const res = await fetch('/profile-launcher/create', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, inheritFrom: inheritFrom || undefined }),
			});
			const data = await res.json().catch(() => ({}));
			if (!res.ok) {
				setNameError(data.error ?? `新建失败（HTTP ${res.status}）`);
			} else {
				closeCreateForm();
				// pl-CHG-005 AC3：新建即标识——create 成功后自动编排
				// 首启初始化 → 停止 → 注入 → 再启动；编排内每步都有进度/失败提示。
				// 有继承时保留 pl-CHG-003 引导文案（首启登录引导页为官方一次性流程，与继承无关）
				const hint =
					data.inherited?.length > 0
						? '（已继承模型配置；首次启动如出现「登录或添加 API Key」引导页，属官方一次性流程，关闭即可）'
						: '';
				await runBadgeBootstrap(name, data.homePath, hint);
			}
		} catch (err) {
			setToast({ kind: 'error', text: err instanceof Error ? err.message : String(err) });
		}
	}, [newName, inheritFrom, closeCreateForm, runBadgeBootstrap]);

	// 既有 profile 手动注入/移除（pl-CHG-005 AC4/AC7）。运行中允许注入（宿主 boot 才装载），
	// 完成后提示重启引导（生效须重启实例）。
	const handleInjectBadge = useCallback(
		async (home) => {
			setBadgingHome(home.homePath);
			setToast(null);
			try {
				const res = await fetch('/profile-launcher/inject-badge', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ homePath: home.homePath }),
				});
				const data = await res.json().catch(() => ({}));
				if (!res.ok) {
					setToast({ kind: 'error', text: data.error ?? `注入失败（HTTP ${res.status}）` });
				} else if (home.running === true) {
					setToast({ kind: 'ok', text: `${home.displayName} 标识已注入，重启该实例后生效（卡片「停止」后再「启动」）` });
				} else {
					setToast({ kind: 'ok', text: `${home.displayName} 标识已注入，下次启动即生效` });
				}
			} catch (err) {
				setToast({ kind: 'error', text: err instanceof Error ? err.message : String(err) });
			} finally {
				setBadgingHome(null);
				await refresh();
			}
		},
		[refresh]
	);

	const handleRemoveBadge = useCallback(
		async (home) => {
			setBadgingHome(home.homePath);
			setToast(null);
			try {
				const res = await fetch('/profile-launcher/remove-badge', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ homePath: home.homePath }),
				});
				const data = await res.json().catch(() => ({}));
				if (!res.ok) {
					setToast({ kind: 'error', text: data.error ?? `移除失败（HTTP ${res.status}）` });
				} else if (data.removed === false) {
					setToast({ kind: 'ok', text: data.message ?? '该 profile 未注入标识' });
				} else if (home.running === true) {
					setToast({ kind: 'ok', text: `${home.displayName} 标识已移除，重启该实例后恢复原状` });
				} else {
					setToast({ kind: 'ok', text: `${home.displayName} 标识已移除，下次启动即恢复原状` });
				}
			} catch (err) {
				setToast({ kind: 'error', text: err instanceof Error ? err.message : String(err) });
			} finally {
				setBadgingHome(null);
				await refresh();
			}
		},
		[refresh]
	);

	const handleStop = useCallback(
		async (home) => {
			setStoppingHome(home.homePath);
			setToast(null);
			try {
				const res = await fetch('/profile-launcher/stop', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ homePath: home.homePath }),
				});
				const data = await res.json().catch(() => ({}));
				if (!res.ok) {
					setToast({ kind: 'error', text: data.error ?? `停止失败（HTTP ${res.status}）` });
				} else {
					setToast({ kind: 'ok', text: `${home.displayName} 桌面版已停止` });
				}
			} catch (err) {
				setToast({ kind: 'error', text: err instanceof Error ? err.message : String(err) });
			} finally {
				setStoppingHome(null);
				await refresh();
			}
		},
		[refresh]
	);

	const doDelete = useCallback(
		async (home) => {
			setDeletingHome(home.homePath);
			setToast(null);
			try {
				const res = await fetch('/profile-launcher/delete', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ homePath: home.homePath }),
				});
				const data = await res.json().catch(() => ({}));
				if (!res.ok) {
					setToast({ kind: 'error', text: data.error ?? `删除失败（HTTP ${res.status}）` });
				} else {
					setToast({ kind: 'ok', text: `已删除 ${home.displayName}（${home.homePath}）` });
				}
			} catch (err) {
				setToast({ kind: 'error', text: err instanceof Error ? err.message : String(err) });
			} finally {
				setDeletingHome(null);
				await refresh();
			}
		},
		[refresh]
	);

	// 删除点击入口：官方 RiskConfirmation 可用走弹框勾选确认，否则 DeleteButton 已做内嵌二次确认
	const handleDeleteClick = useCallback(
		(home) => {
			if (RiskConfirm) {
				setDeleteAsk(home);
				setDeleteAck(false);
			} else {
				doDelete(home);
			}
		},
		[doDelete]
	);

	if (loading) {
		return (
			<div className="pl-container">
				<style>{css}</style>
				<div className="pl-loading">正在扫描 profile 环境…</div>
			</div>
		);
	}

	return (
		<div className="pl-container">
			<style>{css}</style>
			<div className="pl-header">
				<div>
					<div className="pl-title">
						<PanelIcon active /> Profile 启动器
					</div>
					<div className="pl-subtitle">发现、启动、新建与清理不同 profile 的 DSH 桌面版环境</div>
				</div>
				<div className="pl-actions">
					<CreateToggleButton open={creating} onToggle={() => {
						if (creating) { closeCreateForm(); } else { setCreating(true); setNameError(''); setInheritFrom(''); }
					}} />
					<LaunchRefreshButton onRefresh={refresh} />
				</div>
			</div>

			{creating && (
				<div className="pl-form">
					<input
						className="pl-input"
						type="text"
						value={newName}
						placeholder="新 profile 名称（如 sandbox、test-235）"
						autoFocus
						onChange={(e) => {
							setNewName(e.target.value);
							setNameError(checkName(e.target.value));
						}}
						onKeyDown={(e) => {
							if (e.key === 'Enter') handleCreate();
							if (e.key === 'Escape') closeCreateForm();
						}}
					/>
					<select
						className="pl-input pl-select"
						value={inheritFrom}
						title="新建时从既有 profile 复制模型相关配置（settings.yaml / .credentials.yaml / .env）"
						onChange={(e) => setInheritFrom(e.target.value)}
					>
						<option value="">不继承（空 profile）</option>
						{(state?.homes ?? [])
							.filter((h) => h.initialized === true)
							.map((h) => (
								<option key={h.homePath} value={h.homePath}>
									继承「{h.displayName}」的模型配置
								</option>
							))}
					</select>
					<PrimaryButtonButton className="pl-form-submit" onClick={handleCreate}>
						创建
					</PrimaryButtonButton>
					<button type="button" className="pl-link-btn" onClick={closeCreateForm}>
						取消
					</button>
					<span className="pl-form-note">home 将创建为 ~/.dsh-&lt;名称&gt;；继承时复制模型配置三件套（来源缺失的跳过）</span>
				</div>
			)}
			{creating && nameError && <div className="pl-error">{nameError}</div>}

			{toast && (
				<div className={toast.kind === 'ok' ? 'pl-hint' : 'pl-error'}>{toast.text}</div>
			)}
			{error && <div className="pl-error">加载失败：{error}</div>}
			{state && state.appPath === null && (
				<div className="pl-error">
					未找到 DSH 桌面版可执行文件，启动功能不可用（探测过 argv[0] / execPath / /Applications 默认路径）
				</div>
			)}

			<div className="pl-card-list">
				{state?.homes?.length ? (
					state.homes.map((home) => (
						<HomeCard
							key={home.homePath}
							home={home}
							launching={launchingHome === home.homePath}
							stopping={stoppingHome === home.homePath}
							deleting={deletingHome === home.homePath}
							badging={badgingHome === home.homePath}
							onLaunch={handleLaunch}
							onStop={handleStop}
							onDelete={handleDeleteClick}
							onInjectBadge={handleInjectBadge}
							onRemoveBadge={handleRemoveBadge}
						/>
					))
				) : (
					<div className="pl-empty">
						未发现任何 profile 环境（~/.dsh* 目录一个都没有）
					</div>
				)}
			</div>

			{RiskConfirm && deleteAsk && (
				<RiskConfirm
					open
					title={`删除 profile「${deleteAsk.displayName}」`}
					description={`将永久删除整个 home 目录 ${deleteAsk.homePath}（含 desktop-user-data 运行数据），不可恢复。`}
					acknowledgeLabel="我理解此操作不可撤销"
					cancelLabel="取消"
					confirmLabel="永久删除"
					acknowledged={deleteAck}
					onAcknowledgedChange={setDeleteAck}
					onCancel={() => setDeleteAsk(null)}
					onConfirm={() => {
						const target = deleteAsk;
						setDeleteAsk(null);
						doDelete(target);
					}}
				/>
			)}
		</div>
	);
}

function CreateToggleButton({ open, onToggle }) {
	if (PrimaryButton) {
		return (
			<PrimaryButton variant={open ? 'ghost' : 'secondary'} size="small" onClick={onToggle}>
				{open ? '收起' : '新建'}
			</PrimaryButton>
		);
	}
	return (
		<button type="button" className="pl-launch-btn" onClick={onToggle}>
			{open ? '收起' : '新建'}
		</button>
	);
}

/** 提交按钮：有 primitives 用之，无则原生（表单主按钮，与卡片小按钮区分） */
function PrimaryButtonButton({ className, onClick, children }) {
	if (PrimaryButton) {
		return (
			<PrimaryButton variant="primary" size="small" onClick={onClick}>
				{children}
			</PrimaryButton>
		);
	}
	return (
		<button type="button" className={`pl-launch-btn ${className ?? ''}`} onClick={onClick}>
			{children}
		</button>
	);
}

function LaunchRefreshButton({ onRefresh }) {
	if (PrimaryButton) {
		return (
			<PrimaryButton variant="ghost" size="small" onClick={onRefresh}>
				刷新
			</PrimaryButton>
		);
	}
	return (
		<button type="button" className="pl-launch-btn" onClick={onRefresh}>
			刷新
		</button>
	);
}

export const inject = ['slots', 'layout'];

export function apply(ctx) {
	ctx.slots.inject('sidebar.panellist', () =>
		ctx.slots.register(
			{ name: 'sidebar.panellist', id: 'profile-launcher', order: 65, label: 'Profile 启动器' },
			PanelIcon
		)
	);
	ctx.slots.inject('main', () =>
		ctx.slots.register({ name: 'main', key: 'profile-launcher' }, () => (
			<ErrorBoundary>
				<LauncherPanel />
			</ErrorBoundary>
		))
	);
}
