---
title: "教OpenClaw/Hermes做视频：hyperframes和remotion技能入门"
date: 2026-05-28T14:43:00+08:00
draft: false
tags: ["OpenClaw", "Hermes Agent", "hyperframes", "remotion", "AI视频", "代码驱动视频"]
categories: ["AI工具"]
summary: "对AI Agent说一句话，它就帮你做完视频——从技能安装、自然语言操作到飞书交付，hyperframes和remotion两大视频技能一文入门。"
---

## 前言：跟Agent说句话，视频就做好了

想象一下这个场景：你在飞书上对 Hermes Agent 说——

> "帮我做一个30秒的产品宣传片，深色背景，蓝白色调，带字幕，配音用中文男声。"

然后你去喝杯咖啡，回来发现飞书里已经收到了一条视频消息——MP4文件，带配音、带字幕、带转场，直接可以预览。

这不是幻想。OpenClaw / Hermes Agent 通过加载 **hyperframes** 和 **remotion** 两个视频技能，就能实现这套从"说一句话"到"收到视频"的完整链路。

本文讲的就是这条链路怎么搭建、怎么操作、怎么做出好看的视频——以及什么时候该选哪个技能。

---

## 一、技能安装：一次性搞定

两个技能的安装逻辑相同：让 Agent 执行 CLI 安装命令，预缓存渲染依赖，跑一次自检。

### hyperframes

在 Hermes Agent 对话中直接说：

> "安装 hyperframes 技能，运行 setup 脚本"

Agent 会执行一键安装脚本，自动完成：验证 Node ≥ 22 → 安装 CLI → 预缓存 Chrome 无头浏览器 → 运行 `doctor` 自检并报告结果。

如果中途报 onnxruntime 下载失败，告诉 Agent：

> "onnxruntime 装不了，跳过它，只装核心功能"

Agent 会用 `--ignore-scripts` 参数绕过，核心功能（初始化、预览、lint、渲染）全部正常。

### remotion

更简单，只需一句话：

> "用 remotion 技能创建一个新视频项目，项目名叫 my-video"

Agent 会执行 `npx create-video@latest --yes --blank --no-tailwind my-video`，几秒钟项目就建好了。

> **为什么不加 Tailwind？** Tailwind 的动画类名在 Remotion 渲染管线里不生效。只用 Tailwind 做静态样式没问题，但动画必须用 `interpolate()`——所以默认不加，免得踩坑。

### 前置依赖

两个技能都需要 **Node.js ≥ 22** 和 **FFmpeg**。如果环境缺这些，Agent 安装时自动检测并提示修复，你只需确认即可。

---

## 二、自然语言操作：说你想做的，Agent来执行

这才是本文的核心——你不是在敲命令行，是在**跟 Agent 用自然语言描述需求**，Agent 翻译成 CLI 操作并执行。

### 创建项目

| 你说的话 | Agent 做的事 |
|---------|-------------|
| "帮我初始化一个 hyperframes 项目，叫 product-promo，用 swiss-grid 模板" | `npx hyperframes init product-promo --example swiss-grid --non-interactive` |
| "创建一个 remotion 项目，叫 weekly-report" | `npx create-video@latest --yes --blank --no-tailwind weekly-report` |

hyperframes 提供 9 个风格模板：`blank`、`warm-grain`、`play-mode`、`swiss-grid`、`vignelli`、`decision-tree`、`kinetic-type`、`product-promo`、`nyt-graph`。告诉 Agent 你想要哪种风格，它会自动选对应模板。

### 生成配音

| 你说的话 | Agent 做的事 |
|---------|-------------|
| "用中文男声给这段文本配音：'欢迎来到我们的产品发布会'" | edge-tts 生成配音文件，放入素材目录 |
| "配音语速加快一点" | `--rate "+50%"` 参数调整 |

中文男声推荐：`zh-CN-YunyangNeural`（专业新闻风，教程首选）、`zh-CN-YunxiNeural`（活泼阳光风）、`zh-CN-YunjianNeural`（激情风）。

### 生成字幕

> "把配音文件转录成逐词字幕"

Agent 执行转录命令，自动生成带时间戳的字幕数据，写入视频画面。

### 预览与检查

| 你说的话 | Agent 做的事 |
|---------|-------------|
| "预览一下效果" | 启动预览服务器，浏览器实时看画面 |
| "检查一下有没有问题" | lint + validate + inspect 三连检查 |
| "检查对比度够不够" | validate 命令，采样5个时间点的文字对比度 |

**检查比渲染重要。** hyperframes 的 lint 检查结构问题（缺时间属性、时间线重叠），validate 检查对比度，inspect 检查视觉溢出。三连通过后再渲染，省下大量调试时间。

### 渲染输出

> "渲染成 MP4，高质量输出"

Agent 执行渲染命令。10分钟视频在2核机器约35-50分钟——告诉 Agent 后台渲染，你继续干别的事，渲染完了 Agent 自动通知你。

### 飞书交付

这是整个链路的"最后一公里"——渲染完成后，Agent 通过飞书将视频文件直接发送给你：

> "把渲染好的视频通过飞书发给我"

Agent 调用飞书消息接口，视频文件作为原生附件送达。你在飞书客户端点击就能预览播放，无需下载到本地再打开。

**完整链路：你说需求 → Agent 执行 → 预览检查 → 后台渲染 → 飞书交付 → 你在手机上直接看。**

---

## 三、制作技巧：让视频看起来不像"AI生成的"

工具再好，做出来的视频如果一看就是"模板套模板"，那就白费了。几个关键原则：

### hyperframes：三个必记规则

1. **视觉身份先行。** 别用默认配色。`#333`灰底、`#3b82f6`蓝按钮、Roboto字体——这三样出现就等于告诉观众"我没设计过"。告诉 Agent 你的风格关键词（"深色科技感"、"温暖手绘风"），它会生成 `DESIGN.md` 统领色板和字体。

2. **clip元素不做动画。** 这是 hyperframes 最容易踩的坑：框架自动管理 `class="clip"` 元素的显示/隐藏，如果你也在上面做 GSAP 动画，两者冲突导致黑屏。正确做法是 clip 只管时间属性，动画放在内层 div 上。Agent 写代码时默认遵守此规则，但如果你在对话中看到 Agent 把动画直接挂在 clip 上——提醒它改。

3. **场景之间必须有转场。** 多场景视频不允许跳切。告诉 Agent "加个液态擦除转场"，它会用 `npx hyperframes add liquid-wipe` 安装并配置。

### remotion：两条铁律

1. **CSS 动画全部禁用。** `transition`、`animation`、Tailwind动画类名——这些在 Remotion 里全部不生效。动画只能通过 `useCurrentFrame()` + `interpolate()` 实现。如果你看到 Agent 写了 CSS transition——提醒它改用 interpolate。

2. **素材放 public/，用 staticFile() 引用。** 图片用 `<Img>`，视频用 `<Video>`，音频用 `<Audio>`。Agent 默认遵守，但如果你发现路径不对——提醒它检查。

### 通用建议

- **先做静态，再加动效。** 每个场景先写"英雄帧"——画面最满那一刻的静态布局。布局确认后，再让 Agent 加入场动画和转场。
- **配音音量分级。** 叙述音 data-volume=1.0，背景音乐 0.2-0.3，确保人声不被淹没。
- **渲染前必跑检查。** 让 Agent 执行完整检查后再渲染，比渲染完发现问题再改要高效得多。

---

## 四、hyperframes vs remotion：怎么选？

| 维度 | **hyperframes** | **remotion** |
|------|----------------|--------------|
| 编程范式 | HTML + GSAP 时间线 | React + interpolate() |
| 上手门槛 | 会 HTML/CSS 就行 | 需要会 React |
| 最擅长 | 动态图形、口播字幕、Shader转场、音频驱动、网页转视频 | 参数化批量视频、React复用、云渲染、3D/地图/复杂交互 |
| 转场效果 | Shader级（液态擦除、白闪穿越等） | CSS级 + spring物理动画 |
| 设计检查 | lint + validate + inspect 三连 | 无内置，靠自律 |
| 云渲染 | Docker 模式 | Lambda/CloudRun 原生支持 |

**一句话决策：**

- 做一个片子、不想学 React、快速出片 → **hyperframes**
- 做系列视频、已有 React 项目、参数化批量生产 → **remotion**
- 做数学方程动画 → 两个都不选，用 **manim-video**

---

## 五、局限性：诚实地说

1. **渲染耗时真实存在。** 10分钟视频在2核机器上近1小时。这不是"秒出"工具，是"编程替你剪辑"工具。好在可以让 Agent 后台渲染，你不用傻等。

2. **没有实时录制能力。** 预渲染管线——写代码、逐帧截图输出。做直播？做实时互动？做不到。

3. **CJK字体需要额外处理。** 沙盒渲染阻断外部字体请求，中文字体必须下载 woff2 放本地或引用系统字体。告诉 Agent "用系统自带的中文字体"，它会自动用 `local()` 方式声明。

4. **素材要自己准备。** 音频、视频、图片——Agent 不会帮你找素材，但可以帮你用 edge-tts 生成配音、用 FFmpeg 合成氛围背景音乐。

5. **视觉复杂度有上限。** 受限于 HTML/CSS/GSAP 或 React 的表现力。电影级特效？做不到。但日常教程、宣传、口播视频足够了。

---

## 六、最后提醒：内容才是核心，工具只是效率

本文教了一套从"说一句话"到"飞书收到视频"的完整链路。但我要强调一件事：

**视频的价值在于内容，不在于特效。**

hyperframes 和 remotion 做的事，本质是**把剪辑、字幕对齐、转场拼接这些重复动作自动化**——让你从"拖拽时间线两小时"变成"跟Agent说一句话十分钟"。它们提升了效率，但**没有提升内容质量**。

一个5分钟教程，哪怕只用黑底白字+同步字幕，只要**内容有干货、讲解有逻辑**，就比一个10分钟"炫酷转场但啥也没说"的视频有价值得多。

**千万不要用这些工具水视频。** 加一堆 Shader 转场、粒子特效、频谱动画但内容空洞——观众一眼看出是AI批量生产的空壳。适得其反。

正确的用法：**内容 → 设计 → 实现**，顺序不能反。

先写好脚本（讲什么、怎么讲、逻辑线），再定视觉风格（色板、节奏、转场），最后让 Agent 高效实现。内容打底，工具加速——这才是 Agent 做视频的正道。

---

> 本文基于 Hermes Agent 的 `hyperframes`（v1.0）和 `remotion` 技能文档编写。在 Hermes Agent 中说"加载 hyperframes 技能"或"加载 remotion 技能"即可启用。渲染完成后通过飞书直接交付视频文件到你的客户端。

---

## 附：本文 Sample 视频

下面的视频就是用 **hyperframes** 技能制作的——从这篇文章的内容出发，用 Hermes Agent 一句话创建项目、生成配音、编写动画、渲染输出，全程自然语言驱动。

{{< video src="/videos/article-sample.mp4" >}}

**制作参数：**

| 项目 | 值 |
|------|-----|
| 技能 | hyperframes v0.6.52 |
| 分辨率 | 1920×1080 |
| 帧率 | 30fps |
| 时长 | 36秒 |
| 配音 | edge-tts · zh-CN-YunyangNeural |
| 背景音乐 | ffmpeg 合成氛围音 |
| 渲染耗时 | 3分7秒（2核机器） |
| 文件大小 | 3.6 MB |

这就是本文开头描述的那条链路的实际产出：**你说需求 → Agent 执行 → 预览检查 → 渲染输出 → 飞书交付**。整个视频项目文件在 `/opt/data/workspace/article-video/` 目录下，你可以随时让 Agent 修改配色、调整文案或替换配音，重新渲染只需几分钟。