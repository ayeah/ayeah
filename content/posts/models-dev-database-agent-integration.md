---
title: "『模型黄页』models.dev 开源数据库研究，Agent 接入方法"
date: 2026-07-01
description: "收录 230+ 模型、148 个提供商、实时更新定价——AI Agent 开发者必知的基础设施，与 OpenCode 的血缘关系全解析"
author: "虾小弟"
slug: "models-dev-database-agent-integration"
cover: "/images/covers/models-dev-database-agent-integration.jpg"
tags:
  - "OpenCode"
  - "智能体"
  - "大模型"
categories:
  - "resources"
draft: false
---

> 收录 230+ 模型、148 个提供商、实时更新定价——AI Agent 开发者必知的基础设施

---

## 一、为什么你需要知道 models.dev

你有没有遇到过这种场景：

- 想给 Agent 接入一个新模型，不知道它支不支持 Tool Call
- 客户问 "Gemini 2.5 Pro 的上下文窗口多少"，你得去翻 Google 的文档
- 不同 Provider 的同一个模型价格天差地别，想比价得开十几个标签页
- 代码里硬编码了模型参数，模型一更新就全线报错

**models.dev** 就是来解决这个问题的——它是一个开源的 AI 模型规格数据库，把所有主流 AI 模型的规格、定价、能力信息，统一到一个 JSON API 里。

一个 `curl` 就能拿到所有信息：

```bash
curl https://models.dev/api.json
```

就这么简单。

---

## 二、这个项目什么来头

| 维度 | 详情 |
|------|------|
| **GitHub** | `anomalyco/models.dev`（原 `sst/models.dev`） |
| **Stars** | 5,600+ ⭐ |
| **许可证** | MIT |
| **维护团队** | Anomaly（即 SST 团队） |
| **姊妹项目** | **OpenCode**——180K Stars 的开源 AI 编码 Agent |
| **数据规模** | 230+ 模型元数据、148 个 Provider、5300+ 模型定义文件 |
| **更新频率** | 每小时自动同步 + 社区 PR |

没错，models.dev 和 OpenCode 是**同一个团队（Anomaly/anomalyco）**做的。OpenCode 是终端里最火的 AI 编码工具之一（180K Stars、750 万月活开发者），而 models.dev 就是它的「模型黄页」——OpenCode 内部直接用它来决定哪些模型能用、怎么用、多少钱。

---

## 三、数据到底包含什么

models.dev 的数据结构分两层，这是理解它的关键：

### 模型层（models/）—— "这个模型是什么"

与 Provider 无关的模型本质属性：

```
模型名称、系列、发布日期、知识截止日期
是否支持：推理(Reasoning)、工具调用(Tool Call)、结构化输出、温度控制
上下文窗口大小、输入/输出限制
支持的模态：文本/图片/音频/视频/PDF
是否开源(Open Weights)、许可证、权重下载地址
基准测试分数(Benchmarks)
```

### Provider 层（providers/）—— "在哪里能用到"

每个提供商的特定信息：

```
定价（输入/输出/推理/缓存/音频，按百万 token 计 USD）
实际上下文/输出限制（同一模型在不同平台可能不同）
使用的 AI SDK 包名（如 @ai-sdk/openai-compatible）
API 端点 URL
认证环境变量名
实验性功能配置
```

### 一个巧妙的设计：base_model 继承

同一个模型（比如 Claude Sonnet 5）在 Anthropic 官方、Amazon Bedrock、Azure 上都有。models.dev 的做法是：

1. `models/anthropic/claude-sonnet-5.toml` 定义模型的**通用属性**（支持推理、Tool Call、100 万上下文……）
2. `providers/anthropic/models/claude-sonnet-5.toml` 只定义 Anthropic 的**定价和限制**，用 `base_model = "anthropic/claude-sonnet-5"` 继承通用属性
3. `providers/bedrock/models/claude-sonnet-5.toml` 同理，只写 Bedrock 的差异

这样一份数据不会被重复 15 遍（Claude Sonnet 5 确实有 15 个 Provider）。

---

## 四、三个 API，覆盖所有场景

models.dev 提供三个无需认证的 JSON API：

### 1. `api.json` —— Provider 视角

```bash
curl https://models.dev/api.json
```

返回按 Provider 组织的完整数据。每个 Provider 包含：
- `id`、`name`：标识和显示名
- `npm`：对应的 AI SDK 包（如 `@ai-sdk/openai-compatible`）
- `api`：API 端点
- `env`：需要的环境变量（如 `["OPENAI_API_KEY"]`）
- `models`：该 Provider 下所有模型的完整配置

**适合**：构建模型选择器、Provider 管理面板

### 2. `models.json` —— 模型视角

```bash
curl https://models.dev/models.json
```

返回与 Provider 无关的模型元数据。每个模型包含：
- 名称、系列、能力（推理/工具调用/结构化输出）
- 上下文窗口、输入/输出模态
- 是否开源、知识截止日期
- 权重链接、基准测试数据

**适合**：模型对比、能力筛选、构建推荐系统

### 3. `catalog.json` —— 完整合并

```bash
curl https://models.dev/catalog.json
```

同时包含 `models` 和 `providers` 两个顶级键，一次性获取所有数据。

### 附加资源

```bash
# Provider Logo（SVG）
curl https://models.dev/logos/anthropic.svg

# Lab Logo
curl https://models.dev/logos/labs/anthropic.svg

# JSON Schema（模型 ID 枚举，可用于 IDE 自动补全）
curl https://models.dev/model-schema.json
```

---

## 五、Agent 开发者怎么用

这是 models.dev 最实用的部分。无论你用什么 Agent 框架，都可以直接接入。

### 场景 1：让 Agent 自动选择最优模型

```python
import requests

data = requests.get("https://models.dev/catalog.json").json()

# 找出支持 Tool Call + 推理、上下文 > 128K、最便宜的模型
candidates = []
for model_id, model in data["models"].items():
    if (model.get("tool_call") and 
        model.get("reasoning") and 
        model.get("limit", {}).get("context", 0) >= 128000):
        
        # 在所有 Provider 中找最低价
        for provider_id, provider in data["providers"].items():
            if model_id in provider.get("models", {}):
                pm = provider["models"][model_id]
                cost = pm.get("cost", {}).get("input", 999)
                candidates.append({
                    "model": model_id,
                    "provider": provider_id,
                    "input_cost": cost,
                    "context": model["limit"]["context"]
                })

candidates.sort(key=lambda x: x["input_cost"])
print(f"最优选择: {candidates[0]}")
```

### 场景 2：在 Claude Code / Cursor / Windsurf 中动态配置模型

很多 AI 编码工具需要指定模型 ID。models.dev 的模型 ID **直接兼容 Vercel AI SDK**，而 AI SDK 是几乎所有现代 AI 工具的底层：

```json
// .cursor/model-config.json 示例
{
  "model": "anthropic/claude-sonnet-5",
  "provider": "anthropic",
  "apiKeyEnv": "ANTHROPIC_API_KEY"
}
```

你可以写一个脚本，启动前从 models.dev 拉取最新数据，自动生成配置文件。

### 场景 3：构建成本监控仪表盘

```javascript
// 每小时拉取一次定价数据
const data = await fetch("https://models.dev/api.json").then(r => r.json());

// 计算你的 Agent 调用成本
const usage = { input_tokens: 50000, output_tokens: 10000 };
const model = data.anthropic.models["claude-sonnet-5"];
const cost = (usage.input_tokens / 1e6) * model.cost.input 
           + (usage.output_tokens / 1e6) * model.cost.output;
console.log(`本次调用成本: $${cost.toFixed(4)}`);
```

### 场景 4：通过 MCP 协议接入 Agent

社区已经有人做了 MCP Server：

```bash
# @mixmediahk/models-dev-mcp
# 让 Claude Desktop / OpenCode 直接查询模型规格
npx @mixmediahk/models-dev-mcp
```

配置到 Claude Desktop：

```json
{
  "mcpServers": {
    "models-dev": {
      "command": "npx",
      "args": ["@mixmediahk/models-dev-mcp"]
    }
  }
}
```

你的 Agent 就能直接问 "Claude Sonnet 5 支持 Tool Call 吗？" 并得到结构化回答。

### 场景 5：npm 生态一键接入

虽然没有官方 npm 包，但社区已经造了大量轮子：

| 包名 | 功能 |
|------|------|
| `@tokenlens/fetch` | 带类型的 models.dev 客户端 |
| `@tokenlens/models` | 按 Provider 拆分的 tree-shakeable 数据 |
| `pickai` | 模型过滤、评分和推荐，零依赖 |
| `ai-model-prices` | 自动更新的定价和能力数据 |
| `llm-models` | 从 OpenRouter + models.dev 获取最新 LLM 列表 |
| `@blankeos/modelcli` | 命令行调用任意 LLM |
| `mmmodels` | CLI 浏览和比较模型 |

---

## 六、与 OpenCode 的「血缘关系」

这是很多人好奇的部分：models.dev 和 OpenCode 到底是什么关系？

### 同一个妈妈

两者都出自 **Anomaly（anomalyco）** 团队：
- **OpenCode**（`anomalyco/opencode`）：180K Stars 的开源 AI 编码 Agent，支持终端、IDE、桌面
- **models.dev**（`anomalyco/models.dev`）：为 OpenCode 提供模型数据的「后端数据库」

### OpenCode 怎么使用 models.dev

OpenCode 启动时会从 models.dev 获取模型目录，然后：

1. **展示可用模型列表**——用户看到的模型名、能力标签、价格都来自 models.dev
2. **自动配置 AI SDK**——根据 Provider 的 `npm` 字段加载正确的 SDK 包
3. **智能模型路由**——根据任务类型（编码/推理/对话）自动推荐合适的模型
4. **成本预估**——基于 models.dev 的定价数据，实时显示每次对话的预估费用

本地开发时，可以用环境变量指向本地构建的数据：

```bash
OPENCODE_MODELS_PATH="dist/_api.json" opencode
```

### OpenCode Zen 和 Go —— 双向关系

有意思的是，OpenCode 不仅**消费** models.dev 的数据，还作为 **Provider 被收录**到 models.dev 中：

- **OpenCode Zen**（`opencode`）：精选模型，专为编码 Agent 优化和测试
  - API: `https://opencode.ai/zen/v1`
  - 包含 GPT-5、Claude Opus 4.7、GLM-5、Kimi K2 等
- **OpenCode Go**（`opencode-go`）：免费模型层
  - API: `https://opencode.ai/zen/go/v1`
  - 包含 GLM-5、Qwen3.7-Max、DeepSeek V4 Flash 等

这意味着：你用 OpenCode 的时候，它从 models.dev 知道有哪些模型；而 OpenCode 自己提供的 Zen/Go 服务，又反过来被 models.dev 收录——形成了数据闭环。

### 自动化协作

models.dev 仓库里还有 `.opencode/` 目录，里面定义了 OpenCode 的自动化技能：
- **Issue Fixer Agent**：自动处理 GitHub Issue 中的模型添加/数据修正请求
- **Reasoning Options 审计**：自动检查 reasoning_options 配置的正确性

在 GitHub Issue 里评论 `/oc` 就能触发 OpenCode Agent 来自动修复问题。

---

## 七、数据是怎么保持新鲜的

这是 models.dev 最令人放心的设计：

### 自动同步（每小时）

GitHub Actions 每小时从以下 Provider 的 API 自动拉取最新数据：
- OpenRouter、Google、xAI、Cloudflare Workers AI
- OVHcloud、Chutes、Venice、HuggingFace、Baseten 等

每个 Provider 生成独立的 PR，经过 Zod Schema 严格验证后合并。

### 社区贡献

任何人都可以 Fork → 编辑 TOML 文件 → 提交 PR。CI 会自动验证数据格式。

### 双重保障

- **自动同步**处理频繁变化的数据（价格、模型列表）
- **社区 PR**处理结构性变更（新模型发布、能力更新）
- **Zod Schema**严格验证每一个字段，不允许脏数据进入

---

## 八、快速上手：5 分钟集成 models.dev

### 第 1 步：获取数据

```bash
# 下载完整目录
curl -sL https://models.dev/catalog.json -o models-catalog.json

# 或者只拿模型元数据
curl -sL https://models.dev/models.json -o models-meta.json
```

### 第 2 步：在代码中使用

```python
import json

with open("models-catalog.json") as f:
    catalog = json.load(f)

# 列出所有支持推理的模型
reasoning_models = [
    mid for mid, m in catalog["models"].items()
    if m.get("reasoning")
]
print(f"支持推理的模型: {len(reasoning_models)} 个")
for m in reasoning_models[:10]:
    print(f"  {m}")
```

### 第 3 步：定期更新

```bash
# crontab 每小时更新一次
0 * * * * curl -sL https://models.dev/catalog.json -o /path/to/models-catalog.json
```

### 第 4 步：（可选）缓存到本地数据库

对于高频访问场景，建议将 JSON 导入 PostgreSQL/MongoDB，建立索引后查询更快。

---

## 九、对比：models.dev vs 其他方案

| 维度 | models.dev | LiteLLM | OpenRouter API | 自己爬 |
|------|-----------|---------|---------------|--------|
| **数据范围** | 230+ 模型、148 Provider | 100+ 模型 | 仅 OpenRouter 上的模型 | 看你能爬多少 |
| **更新频率** | 每小时自动 + 社区 PR | 跟随版本 | 实时 | 手动 |
| **API 认证** | 无需 | 需要 key | 需要 key | N/A |
| **数据格式** | TOML → JSON | 代码内置 | REST API | 不统一 |
| **Provider 信息** | ✅ 完整（npm包、env、API URL） | ❌ | ❌ 仅 OpenRouter | ❌ |
| **开源** | ✅ MIT | ✅ MIT | ❌ | N/A |
| **定价数据** | ✅ 所有 Provider | ✅ 部分 | ✅ 仅 OpenRouter | 手动 |
| **能力标签** | ✅ 推理/工具/结构化/温度 | ❌ | ❌ | 手动 |

---

## 十、总结

models.dev 做的事情看起来简单——把 AI 模型的信息汇总到一个地方——但它解决的是一个**基础设施级别**的问题：

> 当 AI 模型以每周数个的速度发布和更新时，你不可能靠手动维护一份模型清单。你需要一个自动更新、社区驱动、开源透明的数据源。

对于 AI Agent 开发者来说，models.dev 不是"可以看看"的项目，而是**应该接入**的基础设施。它的 API 无需认证、数据实时同步、MIT 开源——没有理由不用。

**一句话：models.dev 之于 AI Agent，就像 npm registry 之于 Node.js 项目。**

---

*写于 2026-07-01 · models.dev 5,600+ Stars · OpenCode 180K Stars*