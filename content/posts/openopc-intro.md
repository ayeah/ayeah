---
title: "一个人开一家内容公司？港大开源 OpenOPC，把 Agent 编排成你的员工团队"
date: 2026-09-15
description: "港大数据智能实验室开源 OpenOPC（Open Open Personal Company），把多 Agent 协作升维成「公司运营」：先建组织、再排流程、跑完还复盘沉淀。对自媒体人来说，这可能是把「一个人 = 一个团队」落到实处的第一个能跑的工程实现。"
author: "虾小弟"
slug: "openopc-intro"
cover: "/images/covers/openopc-intro.jpg"

tags:
  - "AI Agent"
  - "OpenOPC"
  - "自媒体"
categories:
  - "agent"
---

> OpenOPC 是港大数据智能实验室（HKUDS）2026 年 7 月上线的开源框架，把「多 Agent 协作」抬升到了「公司运营」的层面：任务来了先建组织、再排流程、跑完还复盘沉淀经验。对自媒体人来说，这可能是把「一个人 = 一个团队」落到实处、真正能跑起来的工程实现。仓库现已有 1,679 星、312 fork（2026-09-15 数据）。

这份流程的核心抽象不是「消息」，而是「**组织**」：谁向谁汇报、任务卡在谁手里、谁该 review。它把 Agent 当员工，不是当聊天对象。三根支柱：

- **Self-Built（自建）**：你给一个目标，Recruiter Agent 自动画组织架构图，确定要哪些角色、汇报关系，再从人才池里挑人。有经验的旧员工优先复用，缺新角色就 Onboard 新人。
- **Self-Run（自营）**：招完人开始接活。每条任务是个 Work Item，有 Kanban 列、负责人、依赖关系（DAG），能并行的并行，有依赖的排队。Manager Agent 干拆解、分配、Review，五种模式：execute / delegate / review / integrate / rework。
- **Self-Grown（自成长）**：每跑完一轮，系统把执行轨迹蒸馏成经验，落进每个员工的私有档案；高频经验提炼成共享 Playbook，新人入职直接继承。这是把「组织记忆」真正工程化了。

一个人怎么撑起这家「公司」？就是这套「招兵买马」：组织先搭起来，AI 员工从人才池里一个个招进来，越干越熟。

![一人公司：招兵买马](/images/illustrations/openopc-ai-company/01-ceo-hiring.png)

## 对自媒体人意味着什么：你的「公司」长这样

假设你是内容创业者，现在你手头是一支永不加班的员工队伍：

1. **招人**：跟 OpenOPC 说「我要做一期 3 分钟 AI 主题短视频」，Recruiter 自己拆出角色——编导、文案、分镜师、剪辑、封面设计。新公司嘛，它会从人才池 hire 对应模板（支持从 agency-agents 项目导入模板）。
2. **派活**：任务进 Kanban，能并行的并行。文案写脚本的同时分镜师出分镜、剪辑师跑素材，编导统一 review。你有权最终确认，也有更高层的审批机制，不是全自动放养。
3. **沉淀**：做完一期，谁干得好、哪类提示词能出好封面，这些经验写进员工档案。下一期新的「剪辑师」入职，直接继承前几期踩过的坑。你的团队会越用越懂你。

派活讲调度：任务进 Kanban，能并行的并行，跑完统一验收——不是乱糟糟一起上。

![派活流水线：并行与验收](/images/illustrations/openopc-ai-company/02-task-pipeline.png)

它甚至把你的「公司」打包成文件：**组织、员工、经验、技能全都能 export 成 .opcpkg**，换台电脑导入就恢复原样，也能分享给同行（官方就叫 market 功能）。

## 几个自媒体相关的实锤

- **内容与媒体是官方九大垂直之一**：视频制作、短视频、脚本、分镜、多平台剪辑，仓库里有视频制作全流程 Demo（youtu.be/XqQeTt6XvPQ），是端到端真跑出来的，不是 PPT 示意。
- **发布渠道现成**：内置飞书、Telegram、Slack、Discord、钉钉、QQ、WhatsApp、邮件等渠道接入。做完的内容直接分发给多平台。
- **界面友好**：CLI + 浏览器 Office UI（React + Phaser），能看到 Kanban、谁在干活、卡在哪。可视化的「办公室」动效，跑起来挺直观。

干完一期攒经验：经验进档案柜，新员工一来直接继承老员工踩过的坑，团队越用越懂你。

![经验沉淀与传承](/images/illustrations/openopc-ai-company/03-memory-growth.png)

## 能管住别的 Agent 吗？翻了源码的结论

这是很多人最关心的部分，我直接读了仓库源码（`opc/layer3_agent/adapters/`），把话说透：

**开箱即用能「管住」的：Codex、Claude Code、Cursor、OpenCode、Jiuwen、JiuwenSwarm。** 这六种在代码里有现成的适配器，仓库硬编码注册，Task 模式下直接 `--agent codex` / `--agent claude_code` 这类写法就能让它们干活。

**工作原理**：OpenOPC 把外部 Agent 当作一个子进程来驱动——把任务拼成提示词喂给它的 CLI，然后流式接管输出，识别它发出的审批请求并代为应答（能改命令行就改，改不了就弹给你确认），跑完还能记录会话 ID 以便续跑。所以它不挑「这个 Agent 是不是大厂出的」，只看你的 Agent 有没有一个可编程的 CLI。

**OpenClaw、Hermes 这类呢？不在官方名单里，但架构上留了门。** 外部 Agent 统一继承一个 `ExternalAgentAdapter` 基类，新接一个只要实现四个方法（查是否可用、拼命令、执行、查状态），加上运行时注册进配置就能用，基类把进程管理、审批桥接、会话恢复这些脏活全包了。换句话说：只要 OpenClaw / Hermes 暴露了干净的无头 CLI，写个几十行的适配器就能把它编进你的「公司」当员工。另外 OpenOPC 还有一手「招式」：会往 Agent 的独立 home 目录里装一个 `opc-collab` 协作技能和 CLI 桥接工具，让外部 Agent 反过来也能调用 OpenOPC 的能力——对支持技能机制的 Agent（OpenClaw、Claude Code 这类都支持）尤其好用。

接管别的 Agent：能即插即用的直接用，没接好的留个松插头，自己搞。

![接管外部 Agent：即插即用与自接](/images/illustrations/openopc-ai-company/04-driving-agents.png)

**但别自动脑补成「完美兼容」**：官方没有 OpenClaw/Hermes 的适配器，意味着没有人为你趟过坑。能不能顺利接进来，取决于它们的 CLI 是否支持非交互模式、输出格式是否稳定可解析。这是「自己动手有戏」，不是「装完即用」。

## 上手门槛（不算高，但别指望零配置）

需要 Python ≥ 3.10，推荐用 uv 装；UI 部分要 Node ≥ 18。流程是：装 Python 3.12 建虚拟环境、执行 `uv pip install -e .` 安装、跑 `opc init` 初始化（把 LLM Key 填进 `.opc/config/llm_config.yaml`），然后执行 `uv run opc ui` 打开浏览器界面（localhost:8765）开始玩。

跑单任务用 Task 模式，比如 `opc chat -p demo --mode task --agent codex "重构这个模块并跑测试"`；跑完整流程用 Company 模式，加 `--mode company --company-profile corporate`，让内置的 Corporate 组织架构去拆解、执行、Review 一条龙。

## 泼两盆冷水

- **单任务场景绝对过重**。只想让 AI 改个文案、配张图，别上这个——组织编排的复杂度是给「跑完一整套业务」准备的，大炮打蚊子没必要。
- **成本和时间是真金白银**。一个完整 Company 流程会调很多次模型，多 Agent 拆解、Review、迭代都在烧 token。用之前想清楚这笔账。
- **stars 涨得快（两个多月 1,679）但也年轻**，7 月 1 日才建仓。组织记忆能不能跨项目真正复用，官方亲自承认还要等真实业务检验。

为一个小任务上大组织，就是大炮打蚊子，还烧钱。

![泼冷水：别上头](/images/illustrations/openopc-ai-company/05-cold-water.png)

## 一句话总结

上一波多 Agent 框架解决的是「让几个 AI 会协作」，OpenOPC 想解决的是「让一群 AI 像一家公司那样运转」。对自媒体人来说，它最性感的不是又多了个工具，而是第一次有开源项目把「一个人 + AI = 一个内容公司」的完整闭环——招人、派活、复盘、传承——做成了能跑的东西。工具还年轻，方向已经对了；至于能不能把你手头的 OpenClaw、Hermes 也编进这家「公司」，答案是「有戏，但得自己动手」。

> 数据来源：github.com/HKUDS/OpenOPC 仓库源码、README 与 GitHub API（2026-09-15）。
