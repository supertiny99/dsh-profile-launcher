import React from 'react';

// 容错降级（沿 plugin-guardian 沉淀）：面板渲染异常时给出兜底 UI 而非白屏
export class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { error: null };
	}

	static getDerivedStateFromError(error) {
		return { error };
	}

	componentDidCatch(error, info) {
		console.error('[profile-launcher] panel error:', error, info);
	}

	render() {
		if (this.state.error) {
			return (
				<div style={{ padding: 24, color: '#b91c1c', fontSize: 13 }}>
					Profile 启动器面板渲染出错：{String(this.state.error?.message ?? this.state.error)}
				</div>
			);
		}
		return this.props.children;
	}
}
