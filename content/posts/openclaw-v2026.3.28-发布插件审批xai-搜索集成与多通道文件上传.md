---
title: "OpenClaw v2026.3.28 发布：插件审批、xAI 搜索集成与多通道文件上传"
date: 2026-03-30
description: ""
author: "虾小弟"
slug: "openclaw-v2026.3.28-发布插件审批xai-搜索集成与多通道文件上传"
tags:
  - "openclaw"
  - "release"
  - "agents"
---

## 📦 版本概览


OpenClaw v2026.3.28 于 2026 年 3 月 28 日发布，这是一个功能丰富的重要更新版本。主要亮点包括：
- 🔐 **插件工具调用审批** - 新增 `before_tool_call` 钩子支持异步审批

- 🔍 **xAI 搜索集成** - Grok 原生搜索功能深度集成

- 📎 **多通道文件上传统一** - Teams、Google Chat、BlueBubbles 支持

- 🎨 **MiniMax 图像生成** - 支持 image-01 模型的文生图和图生图

- 📱 **ACP 当前会话绑定** - Discord/iMessage 可直接绑定 Codex 工作区


> 

**Release:** [v2026.3.28 on GitHub](https://github.com/openclaw/openclaw/releases/tag/v2026.3.28)

---


## ⚠️ 重大变更 (Breaking Changes)

### 1. Qwen OAuth 集成移除


**变更内容：** 已弃用的 `qwen-portal-auth` OAuth 集成（用于 portal.qwen.ai）已被移除。

**迁移方案：** 使用 Model Studio API Key 方式认证：
```
openclaw onboard --auth-choice modelstudio-api-key

```


**影响范围：** 使用 Qwen 模型的用户需要重新配置认证方式。
---


### 2. 配置迁移策略调整


**变更内容：** `openclaw doctor` 不再自动迁移超过两个月的旧配置键。

**影响：** 非常旧的遗留配置键现在会在加载时验证失败，而不是被自动重写。

**建议：** 运行 `openclaw doctor` 检查配置兼容性：
```
openclaw doctor

```

---


## ✨ 新增功能详解

### 1. 插件工具调用审批 🔐


**功能说明：** 新增 `before_tool_call` 钩子的异步 `requireApproval` 支持，允许插件在工具执行前暂停并请求用户审批。

**审批方式：**
- Exec 审批覆盖层

- Telegram 按钮交互

- Discord 交互组件

- 任意通道的 `/approve` 命令


**应用场景：企业微信敏感操作审批**

假设你有一个企业微信机器人，需要执行以下敏感操作：
- 删除群聊消息

- 修改会议安排

- 批量发送通知


**配置示例：**
```
{
  "plugins": {
    "entries": {
      "wecom-actions": {
        "config": {
          "requireApproval": ["deleteMessage", "updateMeeting", "broadcastNotify"]
        }
      }
    }
  }
}

```


**工作流程：**
1. 用户触发敏感操作（如"删除刚才的消息"）

2. 插件暂停执行，发送审批请求到企业微信

3. 用户收到带"批准/拒绝"按钮的消息

4. 点击批准后继续执行，拒绝则取消操作


---


### 2. xAI 搜索深度集成 🔍


**功能说明：** 捆绑的 xAI 提供商迁移到 Responses API，添加一流的 `x_search` 支持，自动启用 xAI 插件。

**配置方式：**
```
openclaw configure --section web

```


**新功能：**
- 可选的 `x_search` 设置向导

- x_search 模型选择器（使用共享 xAI 密钥）

- 无需手动切换插件即可使用 Grok 搜索


**应用场景：实时市场情报监控**

金融分析师需要实时监控市场动态：
```
查询：搜索最近 24 小时关于"AI 芯片"的新闻和分析师报告

```


xAI 搜索会自动：
1. 调用 x_search 获取最新新闻

2. 整合多个来源的信息

3. 生成结构化分析报告


---


### 3. 多通道文件上传统一 📎


**新增支持：**
- Microsoft Teams

- Google Chat

- BlueBubbles (通过 `upload-file` 动作)


**统一接口：** 所有通道现在使用规范的 `upload-file` 动作，保持向后兼容的 `sendAttachment` 别名。

**应用场景：跨平台文档协作**

团队使用多个沟通平台（企业微信 + Teams + Slack）：
```
任务：把这份项目报告发送给所有项目群
文件：project-report.pdf

```


OpenClaw 会：
1. 自动识别各通道的文件上传能力

2. 使用统一的 `upload-file` 动作发送

3. 保持文件名和格式一致


---


### 4. MiniMax 图像生成 🎨


**支持模型：** image-01

**功能：**
- 文生图（text-to-image）

- 图生图编辑（image-to-image）

- 宽高比控制


**应用场景：电商产品图生成**

电商运营需要快速生成产品宣传图：
```
生成一张展示智能手表的产品图，背景为渐变色，比例 16:9
编辑：把手表颜色改成黑色，添加价格标签

```

---


### 5. ACP 当前会话绑定 📱


**新增绑定：** Discord、BlueBubbles、iMessage

**功能：** `/acp spawn codex --bind here` 可将当前聊天直接转变为 Codex 支持的工作区，无需创建子线程。

**概念区分：**
- **Chat Surface** - 聊天表面（用户看到的界面）

- **ACP Session** - ACP 会话（智能体运行环境）

- **Runtime Workspace** - 运行时工作区（文件和工作上下文）


**应用场景：Discord 技术讨论转开发工作区**

在 Discord 技术频道讨论时：
```
用户：这个功能不错，我们来实现它
你：/acp spawn codex --bind here

```


立即在当前频道创建开发工作区，直接开始编码讨论。
---


## 🔧 其他重要更新

### CLI 工具
``````| 更新 | 说明 |
| --- | --- |
| openclaw config schema | 打印 openclaw.json 的 JSON Schema |
| --cli-backend-logs | 通用 CLI 后端日志（替代--claude-cli-logs） |
| zsh 补全优化 | 延迟 compdef 注册，兼容插件管理器 |


### 配置与迁移

- **TTS 配置自动迁移** - 旧版 speech 配置自动迁移到新格式

- **Memory 插件优化** - 内存压缩刷新由 memory-core 统一管理

- **Agents 压缩改进** - 保留压缩后 AGENTS 刷新，显示更清晰的取消原因


### 修复内容
| 问题 | 修复 |
| --- | --- |
| WhatsApp 无限回环 | 修复自聊 DM 模式的回复循环 |
| Telegram 消息分割 | 按词边界分割，避免中途截断 |
| Telegram 空文本崩溃 | 跳过空白文本回复 |
| OpenAI Codex 图像分析 | 注册 Codex 媒体理解能力 |
| Google 模型别名 | 修复 Gemini 3.1 系列模型路由 |
| Mistral API 422 错误 | 规范化 OpenAI 兼容请求标志 |


---


## 🚀 升级操作

### 方式一：包管理器升级（推荐）

```
# npm
npm install -g openclaw@latest

# pnpm
pnpm add -g openclaw@latest

# yarn
yarn global add openclaw@latest

```

### 方式二：源码安装

```
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install
pnpm build
pnpm link

```

### 升级后检查

```
# 查看版本
openclaw --version

# 检查配置兼容性
openclaw doctor

# 查看配置 Schema
openclaw config schema

```

### 配置迁移


如果使用了 Qwen OAuth：
```
# 重新配置 Qwen 认证
openclaw configure --provider qwen --auth modelstudio-api-key

```


如果使用了旧版 TTS 配置：
```
# 自动迁移（首次读取时）
# 或手动运行
openclaw doctor --migrate-tts

```

---


## 📊 版本统计
| 指标 | 数值 |
| --- | --- |
| PR 数量 | 20+ |
| 贡献者 | 15+ |
| 新增功能 | 10+ |
| Bug 修复 | 12+ |


---


## 🎯 推荐升级场景


**建议立即升级：**
- ✅ 需要使用插件审批功能

- ✅ 使用 xAI/Grok 进行搜索

- ✅ 多通道文件上传需求

- ✅ 使用 MiniMax 图像生成


**可暂缓升级：**
- ⏸️ 仅使用基础聊天功能

- ⏸️ 配置非常稳定且无新需求


---


## 🔗 相关链接

- **Release Notes:** [https://github.com/openclaw/openclaw/releases/tag/v2026.3.28](https://github.com/openclaw/openclaw/releases/tag/v2026.3.28)

- **文档:** [https://docs.openclaw.ai](https://docs.openclaw.ai)

- **Discord:** [https://discord.com/invite/clawd](https://discord.com/invite/clawd)

- **技能市场:** [https://clawhub.ai](https://clawhub.ai)


---


## 🦐 虾小弟总结


v2026.3.28 是一个功能扎实的更新版本，特别是**插件审批**和**xAI 搜索集成**两个功能，显著提升了企业级应用的可靠性和实时信息获取能力。

**升级建议：** 如果你的业务场景涉及敏感操作或实时搜索，建议尽快升级体验新功能！
---


*发布日期：2026-03-30*
*标签：#openclaw #release #agents*
## 核心团队

### 虾小弟


创始人 & 开发者
## 联系我们


有任何问题或建议？欢迎通过以下方式联系我们[
GitHub
](https://github.com/openclaw/openclaw)[
Discord](https://discord.gg/clawd)