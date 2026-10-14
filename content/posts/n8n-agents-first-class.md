---
title: "n8n 把 Agent 做成一等公民，工作流全变成它的工具"
date: 2026-10-14
description: "n8n 把 Agent 做成了一等公民：模型、指令、工具、技能、知识库、记忆、子代理全可配，发布后能接 Slack、Telegram，也能定时自跑。本文拆解这个新功能，并和 Dify、WorkBuddy 类应用比定位、比架构、比用法。"
author: "虾小弟"
slug: "n8n-agents-first-class"
cover: "/images/covers/n8n-agents-first-class.jpg"

tags:
  - "n8n"
  - "AI Agent"
  - "工作流自动化"
  - "Dify"
categories:
  - "agent"
---

> n8n 把 Agent 做成了产品里的一等公民。它跟老的 AI Agent 节点是两回事：这是和 workflow 平级的独立产物，有自己的模型、指令、工具、技能、知识库、记忆和子代理，有草稿和发布两套版本，发布后能挂 Slack、Telegram、Linear，也能定时自跑。更要命的是反过来那半句：你攒了多年的工作流，现在成了它随手可调的工具。

![n8n 官方界面截图：描述你想自动化的东西，它替你起草](/images/illustrations/n8n-agents-first-class/01-build-with-ai.png)

## 一、Agent 不再是你流程里的一段，而是主角

以前在 n8n 里做 AI，是往 workflow 画布里塞一个 AI Agent 节点：你编排流程，AI 负责其中一段。新 Agent 把关系翻了过来，它和 workflow 并列存在项目里，自己判断下一步该调工具、查知识库、转给子代理，还是反问一句。workflow 从主角变成了「Agent 可调用的工具之一」。

官方给的判断标准很直白：一件事太开放、用固定流程框不住，才该上 Agent。

版本上，Cloud 所有套餐默认可用，自托管从 2.32.3 起（2.32 发布于 2026 年 7 月 21 日，眼下最新已到 2.43）。开关在 `Settings > Agents`，实例管理员能整体关掉，不影响老的那个 AI Agent 节点。

### 一个 Agent 由什么组成

它跑的是一个推理循环：你发消息，或者定时器把它叫醒，它读指令、看请求，决定下一步做什么，循环到给出最终答复。每次对话是一个 session，n8n 存下来，所以能接着聊。

十个可配置部件：

| 部件 | 作用 |
| --- | --- |
| Model | 负责推理的模型 |
| Instructions | 系统提示词：角色、语气、边界、优先用哪个工具 |
| Tools | 能执行的动作：workflow、自定义代码、内置集成、MCP server |
| Web search | 联网查最新信息；模型自带优先，否则挂 Brave Search 或自建 SearXNG |
| Skills | 指令加工具打包成的可复用能力块 |
| Channels | Slack、Telegram、Linear |
| Schedules | 发布后按小时 / 天 / 周 / 月 / cron 自跑 |
| Sub-agents | 可转交工作的其他已发布 Agent |
| Knowledge base | 可搜可读的文件：csv、pdf、markdown、txt |
| Memory | 会话记忆管当前对话，情景记忆想起更早的会话 |

![挂多少工具，它就有多少本事](/images/illustrations/n8n-agents-first-class/02-tools.png)

草稿和发布是两套版本，这点设计得挺像样。草稿随便改、自动存，发布版才是线上跑的那个。每次发布等于给草稿拍快照，所以改草稿不会影响线上，历史版本能回滚，也能随时下线。上线前用 Preview 拿草稿开测试会话；Preview 点不动说明草稿有配置错误，n8n 会把待处理项列出来。

![接上向量库之后，Agent 就能先检索再回答](/images/illustrations/n8n-agents-first-class/03-rag-knowledge.png)

### 它能出现在哪些地方

除了自带聊天面板，还有四条路：渠道（Slack、Telegram、Linear）、定时任务、工作流里的 Message an Agent 节点、MCP 客户端（Claude Desktop 和 Claude Code 能直接管 Agent，但之前连过的客户端得去 `Settings > Instance-level MCP` 重连一次才拿得到新权限）。

Message an Agent 节点有几个细节值得记：输出里带 `structuredOutput`、`toolCalls`、`session` 这些字段；打开 Require Specific Output Format 能把回复约束成 JSON schema，后面节点才接得稳；Session ID 最长 74 字符；手动和聊天执行走草稿，生产执行走发布版，改了 Agent 记得重新发布。

![执行日志里能看清它调了什么、输入输出是什么](/images/illustrations/n8n-agents-first-class/04-run-logs.png)

### 几条硬约束

| 项目 | 现状 |
| --- | --- |
| 成熟度 | Preview，会犯错，行为可能变 |
| 自托管 | 暂不支持队列模式，渠道连接可能失败，接渠道要公网 WEBHOOK_URL |
| 知识库 | Cloud 可用；自托管要配 Daytona sandbox，且属 Preview |
| 情景记忆 | 需要 OpenAI 凭证 |
| 计费 | 一轮对话算一次执行，和 workflow 共用额度 |
| 敏感工具 | 可要求人工批准，Agent 停下来等你点 Approve 或 Reject |

## 二、和 Dify、WorkBuddy 类应用差在哪

这三个东西常被摆在一起问，其实不在一个赛道。

**定位**。n8n 是工作流自动化平台，Agent 是它新加的一等产物，卖的是「不锁定框架」加 500 多个现成集成，还能自己托管。Dify 是开源的 LLM 应用开发平台，产出是**应用**：agent、agentic workflow、chatbot，做完发布成 Web App 或 API 给别人用，知识库和 RAG 是它的看家本事。WorkBuddy 这类桌面 Agent 应用是**直接替你干活的助手**，不要你搭什么，提需求给交付物。一句话：n8n 造长期运行的自动化服务，Dify 造给别人用的 AI 应用，WorkBuddy 这类直接产出成果。

**架构**。n8n 的底子是节点图和执行引擎，Agent 站在节点图旁边，工具可以是节点、同项目的工作流、JSON schema 自定义工具或 MCP server，也能反过来嵌回 workflow 里；session 和发布历史都存在 n8n 自己的库里。Dify 走 BaaS 分层（Dataset / LLM / App），可视化画布配知识库和插件市场，自托管用 Docker Compose 几分钟能起。WorkBuddy 类是本地优先，直接读写本地文件和浏览器，能力靠 Skills、Connectors、Experts 往外扩。

**使用方式**。n8n：建 Agent → 写指令 → 挂工具 → Preview → Publish → 挂渠道或定时，改的时候动草稿。Dify：建应用 → 选类型 → 画布编排 → 调试 → 发布成 Web App / API。WorkBuddy：直接说需求，边做边给结果。

| 维度 | n8n Agents | Dify | WorkBuddy 类应用 |
| --- | --- | --- | --- |
| 一句话定位 | 把 Agent 当自动化产物的平台 | 造 AI 应用并发布的平台 | 直接替你干活的助手 |
| 交付物 | 长期运行的 Agent 服务 | 可发布的应用（Web / API） | 具体成果物（文档 / 代码 / 网页） |
| 谁在用 | 技术团队、自动化工程师 | 产品、开发者 | 个人与业务团队 |
| 上手成本 | 中高，要懂节点和凭证 | 中，画布式 | 低，直接对话 |
| 能力从哪来 | 500+ 集成、工作流、MCP | 插件市场、OpenAPI 自定义工具 | Skills、Connectors、Experts |
| 对外触达 | Slack / Telegram / Linear | Web App / API / MCP Server | 桌面端对话 |
| 部署 | Cloud 或自托管 | Cloud 或自托管 | 桌面应用 |
| 计费口径 | 执行次数，与 workflow 共用额度 | 应用 / 额度 | 订阅 / 额度 |

三者不冲突。跑得顺的团队一般这么分工：n8n 把系统连起来、长期值守，Dify 把能力包装成给外部用户用的应用，WorkBuddy 这类助手把日常的活直接干掉。

## 三、两个能直接抄的场景

### 1. 自媒体人的行业情报周报

每周一早上把过去一周 AI 圈的事整理成带来源的选题简报，落到手机上。

模型随便挑一个能打中文的。指令写死三件事：角色（AI 行业情报分析员）、输出格式（事件 + 来源链接 + 为什么值得写 + 可切入的角度）、边界（没来源的判断不许写）。Capabilities 里开 Web search。Knowledge 传上你自己写过的文章和选题库，让它别重复推荐。Tools 加一个 Google Sheets 或 Notion 把结果落库，慢慢攒成选题资产。Channels 接 Telegram，Schedules 选 Weekly 周一 09:00，然后 Publish。

每周的信息形态都不一样，有时一条新闻，有时一篇长文，有时一整个产品发布。固定流程预判不了这些分支，Agent 可以。

### 2. Slack 里的订单 Agent，动钱的动作要人点头

客服在 Slack 里问一句「订单 12345 现在什么情况」，Agent 自己查订单、算退款、给建议，真要退款时停下来等人批准。

Tools 里接你自己的订单系统，可以是同项目的一个 workflow，也可以是自定义 JSON schema 的工具。关键是把能力拆开：查订单、查物流、算退款额这三个是「读」，自动跑；执行退款那个是「写」，添加时开启审批要求。Channels 接 Slack。上线后去 Sessions 面板能回看聊了什么、调了哪些工具、有没有待批的请求。

读的放开、写的挂审批，比在提示词里反复叮嘱「不要乱退款」靠谱得多。

另外两个方向也值得试。**夜间巡检**：把已有的巡检 workflow 直接当 Tool 挂给 Agent，再用 Message an Agent 节点把它的回复接回流程，异常时它会先查日志、翻部署记录，判断是不是老毛病，再决定叫不叫人。**多 Agent 深度研究**：建几个专职 Agent（检索、核查、成稿）挂成 sub-agent，主 Agent 负责拆题和汇总。注意子代理必须是已发布的 Agent，草稿状态的挂不上去。

![多 Agent 协作：主 Agent 拆题，Critic 挑错，Refiner 改稿，Evaluation 打分](/images/illustrations/n8n-agents-first-class/05-multi-agent.png)

## 四、什么时候别用 Agent

流程完全确定、分支固定的，老老实实写 workflow，Agent 只会让它更贵更慢更难查。要毫秒级确定响应的也别用，推理循环再快也是秒级起步。团队接受不了不确定性的，先在内部跑一两个月摸清脾气再说。自托管还开着队列模式的，现在不支持。

## 五、最后

n8n 这一步，是把自动化从一条条流水线，升级成了一个会自己找路的岗位。你过去搭的每一个工作流，都是它的简历。
