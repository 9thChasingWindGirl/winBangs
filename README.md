<div align="center">

<img src="./src/assets/logo.png" alt="音乐控制器" width="200" />

<h1>NetSpeed Dynamic Pro</h1>
<p>专为 Windows 而生的灵动岛</p>

[![Tauri](https://img.shields.io/badge/Tauri-2.x-blue?logo=tauri)](https://tauri.app)
[![Rust](https://img.shields.io/badge/Rust-1.70+-orange?logo=rust)](https://rust-lang.org)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-green?logo=vue.js)](https://vuejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.x-yellow?logo=vite)](https://vite.dev)
[![ECharts](https://img.shields.io/badge/ECharts-6.x-purple?logo=apache-echarts)](https://echarts.apache.org)

[简体中文](./README.md) &nbsp; | [English](./README.en.md) &nbsp; | [下载地址](https://github.com/GEORGEWWWU/NetSpeed-Dynamic/releases/latest) &nbsp; | [官方网站](https://nsd.georgewu.top/) &nbsp; | [QQ群：1080730621](https://qm.qq.com/cgi-bin/qm/qr?k=i70z7rbl-VWpejQugvlXeARDUjwP7sIW&jump_from=webapi&authKey=b6Pj6zLuuCINDhafPJRttePdy3D45vvtWzcZ109LWoWYXkcKo8bNWI7fMhr+yV87)

</div>

![音乐控制器](./src/assets/screenshot2.png)
![灵动岛通知](./src/assets/screenshot4.png)
![音乐控制器 2.0](./src/assets/screenshot.gif)
![2.4.1](./src/assets/screenshot3.png)
![2.4.1](./src/assets/screenshot5.png)

---

NetSpeed Dynamic Pro（NSD）是一个基于 Tauri 2、Rust 和 Vue 3 构建的 Windows 桌面应用。它将“实时网速监控、音乐控制、系统通知、个性化设置”融合在一个悬浮式动态岛界面中，适合希望提升桌面交互体验的用户。

## 项目亮点

- 实时显示上传/下载网速，并提供流量统计与趋势图
- 使用悬浮式 Dynamic Island 展示网络、音乐、消息和系统状态
- 支持多平台音乐控制，兼容系统 SMTC 生态
- 捕获系统通知并以更直观的方式呈现在界面中
- 提供主题、透明度、尺寸、边角、动画、任务栏插件等个性化配置
- 支持开机自启、系统托盘、任务栏固定、全屏游戏避让等系统集成能力

## 主要功能

### 1. 网速监控

- 每秒刷新上传/下载速度，并自动切换单位
- 展示网络状态指示灯：正常 / 高延迟 / 断网
- 提供本地流量统计与月度累计流量统计
- 支持控制台内置的折线图与柱状图可视化
- 支持在高流量场景下做更稳妥的断网判断，减少误报

### 2. 多平台音乐控制

- 通过 Windows SMTC API 进行上一首 / 播放暂停 / 下一首控制
- 支持网易云音乐、Spotify、Apple Music、QQ 音乐、酷狗音乐、Echo Music、LX Music 等平台
- 实时展示歌曲名、歌手、封面，并支持播放时封面旋转
- 优先使用系统媒体会话中的本地封面，兼容多源封面回退逻辑
- 支持歌词显示、歌词队列控制，以及彩虹流光边框等视觉特效

### 3. 系统通知与事件

- 接收系统 Toast 通知，并在动态岛中展示应用消息
- 支持静默消息模式、消息优先级队列与点击唤醒应用
- 监听音量变化、电源插拔、锁屏/解锁、低电量等系统事件
- 为不同事件提供独立的图标与通知样式

### 4. 个性化中心

- 提供 Stiff / Bouncy 两种弹性动画风格
- 支持黑色、白色、沉浸模式等主题切换
- 可调整边角形态、透明度、窗口尺寸、全局缩放比例
- 支持任务栏组件开关、歌词延迟、位置锁定、置顶等设置

## 技术栈

| 层级 | 技术 |
|------|------|
| 桌面框架 | Tauri 2 (Rust) |
| 前端框架 | Vue 3 + TypeScript |
| 构建工具 | Vite 6 |
| 路由 | Vue Router 5 |
| 图表 | ECharts 6 |
| 图标 | Lucide Vue Next |
| 网络监控 | sysinfo (Rust) |
| 异步运行时 | Tokio (Rust) |
| HTTP 客户端 | reqwest (Rust) |
| 媒体控制 | Windows SMTC API |
| 音频处理 | cpal + rustfft |
| 系统事件 | Windows COM / WinAPI |
| 存储 | localStorage |

## 项目结构

```text
NetSpeed-Dynamic/
├── src/                      # 前端源码
│   ├── main.ts               # 应用入口
│   ├── router/index.ts       # 路由配置
│   ├── i18n.ts               # 中文/英文国际化
│   ├── views/
│   │   ├── MainPanel.vue     # 主控制台
│   │   └── WidgetIsland.vue  # 动态岛悬浮窗
│   ├── components/
│   │   └── DynamicSet.vue    # 个性化中心
│   └── assets/               # 图标、截图与静态资源
├── src-tauri/                # Tauri Rust 后端
│   ├── src/
│   │   ├── lib.rs            # 核心逻辑、窗口与动画
│   │   ├── music_controller.rs  # 媒体控制与封面/歌词
│   │   ├── notification.rs   # 系统通知捕获
│   │   ├── system_events.rs  # 音量、电源、锁屏等事件
│   │   └── audio_spectrum.rs # 音频频谱分析
│   ├── Cargo.toml           # Rust 依赖
│   └── tauri.conf.json      # Tauri 配置
├── package.json              # 前端依赖与脚本
└── README.md                 # 中文说明
```

## 开发环境

### 依赖要求

- Windows 10/11
- Node.js 18+
- Rust 1.70+
- Tauri 2 CLI

### 安装与运行

```bash
git clone https://github.com/GEORGEWWWU/NetSpeed-Dynamic.git
cd NetSpeed-Dynamic
npm install
npm run tauri dev
```

### 构建发布

```bash
npm run tauri build
```

构建产物会输出到 `src-tauri/target/release/bundle/`。

## 使用方式

1. 启动应用后，主控制台会显示实时网速与设置入口。
2. 打开“Widget”开关后，屏幕顶部会出现动态岛悬浮窗。
3. 左键拖拽移动，右键菜单可进行位置锁定、重置、关闭或开关流光边框。
4. 在主控制台中配置音乐平台、消息通知、主题、透明度与自动启动。
5. 进入“个性化中心”后，可调整物理动效、外观、尺寸与缩放。

> 说明：当前项目针对 Windows 平台进行了深度适配，部分功能依赖系统 SMTC、COM 与 WinAPI 能力。

## 许可证

MIT License

Copyright (c) 2026 Ryen (GEORGEWU)

## 支持与捐赠

如果这个项目对你有帮助，欢迎支持作者：

| 方式 | 信息 |
|------|------|
| 微信支付 | [微信](./src/assets/wechat-pay.png) |
| 支付宝 | [支付宝](./src/assets/alipay.jpg) |
| GitHub Sponsors | [前往支持](https://github.com/sponsors/GEORGEWWWU) |

---

> 感谢每一位支持者与使用者！