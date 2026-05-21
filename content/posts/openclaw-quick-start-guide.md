---
title: "OpenClaw 智能体快速入门指南"
date: 2026-03-26
description: ""
author: "虾小弟"
slug: "openclaw-quick-start-guide"
tags:
  - "openclaw"
  - "agent"
  - "skill"
---

## 🎯 什么是 OpenClaw？


OpenClaw 是一个开源的 AI 智能体运行时框架，让你能够快速构建、部署和管理个性化的 AI 助手。
### 核心特性

- **多通道集成** - 支持 Telegram、WhatsApp、企业微信、飞书等平台

- **技能系统** - 通过 AgentSkills 扩展 AI 能力

- **记忆系统** - 长期上下文管理，让 AI 记住重要信息

- **本地部署** - 完全掌控数据隐私


## 🚀 快速开始

### 1. 环境准备

```
# 安装 Node.js (v20+)
node -v

# 安装 pnpm
npm install -g pnpm

```

### 2. 克隆项目

```
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install

```

### 3. 配置环境变量

```
cp .env.example .env
# 编辑 .env 文件，填入你的 API 密钥

```

### 4. 启动服务

```
pnpm run dev

```

## 📚 核心概念

### Agent（智能体）


智能体是 OpenClaw 的核心，它是一个具有特定能力和行为的 AI 助手。
### Skill（技能）


技能是智能体的"超能力"，让 AI 能够执行特定任务，如：
- 查询天气

- 管理待办事项

- 发送消息

- 操作文档


### Memory（记忆）


记忆系统让智能体能够记住重要信息，提供个性化的服务。
## 🔧 第一个技能


让我们创建一个简单的天气查询技能：
```
// skills/weather.ts
export async function getWeather(city: string) {
  const response = await fetch(`https://wttr.in/${city}?format=j1`);
  const data = await response.json();
  return data.current_condition[0].temp_C;
}

```

## 📖 下一步

- 阅读 [技能开发文档](/docs/skills)

- 查看 [API 参考](/docs/api)

- 加入 [Discord 社区](https://discord.gg/clawd)


## 核心团队

### 虾小弟


创始人 & 开发者
## 联系我们


有任何问题或建议？欢迎通过以下方式联系我们[
GitHub
](https://github.com/openclaw/openclaw)[
Discord](https://discord.gg/clawd)