# @supertiny99/dsh-profile-launcher

DSH（DeepSeek Harness）多 Profile 桌面版启动器与环境管理器。在桌面端内侧栏面板发现本机全部 profile 环境（`~/.dsh*`）、识别运行状态与当前实例，一键启动不同 profile 的桌面版（独立 user-data 绕开 Electron 单实例锁，多环境**双开并存**），并支持**新建 / 停止 / 删除** profile 环境的完整生命周期管理。

## 为什么需要它

- DSH 官方切换 profile 只能靠命令行（`DSH_HOME=... ` 启动），且桌面端主进程持有与 profile 无关的单实例锁——**朴素双开第二个 profile 实例会被锁静默吞掉**（进程秒退、只是聚焦旧窗口），极易误以为"启动了"。
- 新建 profile 更有坑：手动预置半吊子 `package.json` 会让宿主走"已初始化"分支不补全声明，host 崩在 `authenticatedUrl` 并弹官方"请重装"误导话术（实证）。新建的唯一正确形态是**纯空目录**——首次启动时宿主自动完成全部初始化。
- 本插件把「发现环境 + 正确双开 + 状态可见 + 生命周期管理」封装为零点击 GUI。

## 功能

- **环境发现（两级）**：扫描 `~/.dsh*` 目录，区分完整 home（已初始化）与待初始化 home（新建空目录 / 历史不完整环境，首启时宿主自动补全），展示名称 / 路径 / 激活插件数 / 安装依赖数
- **运行状态**：扫描宿主进程列表，精确识别每个 profile 是否有桌面版在跑（当前实例高亮标记）
- **一键启动**：`spawn` detached 官方 app，不随本实例退出；启动后存活复查，秒退实例显式告警；待初始化 home 亦可直接启动（触发宿主首启初始化）
- **新建**：名称校验（小写字母/数字/连字符）+ 重名拒绝，创建 `~/.dsh-<名称>` 纯空目录，零预置文件；**可选继承模型配置**——下拉任选一个已初始化 profile，字节级复制 `settings.yaml`（模型 provider 定义）/ `.credentials.yaml`（API key，保持 0600）/ `.env`（环境变量注入）三件套到新 home。宿主首启经官方导入机制（settings.yaml → Cordis 条目）自动生效，模型设置**开箱即用无需重配**
- **停止**：SIGTERM 目标实例主进程，整棵进程树随之退出（实证 1s 清零），5s 轮询 + SIGKILL 兜底；同机其他实例零影响
- **删除**：官方 RiskConfirmation 勾选确认（降级内嵌二次确认），真删 home 整目录（含 desktop-user-data）；运行中 / 当前实例 / 状态未知一律拒绝
- **防误操作**：操作入口不满足条件不渲染；homePath 白名单校验防任意路径注入
- 双主题自适应（`--dsw-alias-*` 设计 token）；UI primitives 能力检测降级，宿主版本差异不白屏

## 安装

DSH 桌面版 → 插件页「添加插件」，spec 任选：

```text
@supertiny99/dsh-profile-launcher          # npm
link:/path/to/this/profile-launcher        # 开发态
```

安装后完全退出 app 冷启动生效。侧栏「Profile 启动器」（火箭图标，order 65）。

## 使用

1. 打开侧栏「Profile 启动器」面板，自动列出全部环境
2. 对「未运行」的环境点「启动」，新桌面版窗口与当前实例并存
3. 点「新建」输入名称创建空环境 → 启动即自动初始化 → 在新实例的「插件」页安装所需插件；想要模型配置开箱可用，在「继承配置」下拉选一个已有环境即可
4. 运行中的沙盒可「停止」（整树退出），不再需要的环境确认后「删除」（整目录真删）
5. 各 profile 实例的登录态/窗口状态相互独立（独立 user-data），首次各登一次即可

## 已知边界

- 仅 macOS（Windows/Linux 未实证，roadmap 候选）
- 官方若变更单实例锁策略，双开钥匙可能失效（`engines.dsh <0.3.0` 限版本防护）
- 各实例 Chromium 层数据不共享（隔离的代价与收益）
- **首启「登录或添加 API Key」引导页**：账号未登录（如走本地网关、无 DeepSeek 账号）时，每个新 profile 首启会弹一次该官方引导——与是否继承模型配置**无关**（宿主机制实证：显示条件是账号状态而非配置缺失，完成标记为会话态不落盘），关闭即可，继承的模型配置已开箱可用
- 登录态（DeepSeek 账号会话）不随配置继承，需各 profile 首次手动登录（如有需要）

## 开发

```bash
npm install
npm test        # 纯逻辑单测（node:assert/strict）
npm run build   # esbuild 打包 + external 泄漏自检 + 产物结构 selfcheck
```

Host 半（`src/index.js`）源码直发；Client 半构建到 `dist/client.js`。零 runtime 依赖，external 全部取自宿主冻结模块表。

## License

MIT
