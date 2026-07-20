---
title: "北大发布《Harness Engineering》报告：驯服Agent，从能用走向可靠的进阶之路"
description: "北大青鸟人工智能研究院发布69页深度报告，系统梳理Harness Engineering——从Prompt到Loop的AI Agent工程范式演进。"
date: 2026-07-20
tags: [AI Agent, Harness Engineering, 北京大学, 技术报告, OpenClaw]
categories: [AI智能体]
cover: "cover.jpg"
---

2026年7月，北大青鸟人工智能研究院（AI肖睿团队）发布了一份69页的深度技术报告——《Harness Engineering——驯服Agent》。

这份报告从Prompt Engineering到Context Engineering，再到Harness Engineering和Loop Engineering，系统梳理了AI Agent工程实践的四阶段演进路径。对于正在接触和落地AI Agent的开发者来说，这是一份非常值得细读的参考材料。

## 为什么需要"驯服"Agent？

报告开篇就点出了一个关键问题：**模型能力的提升，并不等于系统可靠性的提升**。

当Agent从演示环境走向真实生产环境时，开发者会很快遇到一系列工程挑战：

- **任务漂移与上下文遗忘**：长周期任务中容易丢失初始目标
- **执行失控与无限循环**：遇到错误时无法自我纠正，陷入无效重试
- **结果无法验证**：缺乏客观的外部评价标准，产出不可靠
- **长期运行成本过高**：效率低下导致Token消耗巨大

核心问题只有一个：**如何让Agent"持续、稳定、可控地完成任务"**。

## 四阶段演进：Prompt → Context → Harness → Loop

报告将AI Agent工程实践的演进划分为四个阶段，层层递进、嵌套包含：

**1. Prompt Engineering（提示工程）**
核心关注：如何说对话——优化指令，让模型单次产生更好输出。适用于早期聊天机器人、简单问答等场景。局限在于模型容易"忘"、幻觉严重、上下文窗口有限。

**2. Context Engineering（上下文工程）**
核心关注：模型看到什么——优化输入环境。通过RAG、记忆系统、知识库构建、上下文压缩等手段，给模型提供正确且足够的信息。适用于多轮对话、知识密集型任务。

**3. Harness Engineering（驾驭工程）**
核心关注：整个系统如何可靠运行——设计Agent的完整执行环境。核心公式：**Agent = Model + Harness**。模型提供智能，Harness提供可靠性。人类角色从"写Prompt/代码"转向"设计环境与规则"。

**4. Loop Engineering（循环工程）**
核心关注：如何实现长期自主运行——设计系统来Prompt Agent。在Harness基础上引入时间/调度维度和递归目标达成机制，从"人类在循环中"转向"人类设计循环"。

## Harness Engineering的核心架构

报告将Harness的核心架构归纳为五个工程模块：

**约束层（Constraints）**
让AI不乱做。包括架构约束（AGENTS.md/CLAUDE.md等行为规范）、工具边界（最小权限原则）、权限控制（Sandbox、Runtime Policy、Hook）。

**上下文与记忆层（Context & Memory）**
每一步该看到什么信息，跨步骤/跨会话该记住什么。包括知识库、RAG、短期/长期记忆、上下文压缩与检索。

**编排与状态层（Orchestration & State）**
谁来决定下一步做什么，任务进展到哪了。包括Planner/DAG任务拆解、多Agent协作（Planner→Research→Coding→Reviewer→Evaluator）、状态管理与Checkpoint恢复。

**反馈与验证层（Feedback & Verification）**
如何证明任务真正完成。这是Harness最重要的价值——引入外部验证器（自动测试、代码规范检查、接口验证），从"AI说完成了"变成"系统证明完成了"。

**可观测性与治理层（Observability & Governance）**
系统如何长期、安全、可维护地运行。包括全量日志与行为回放、审计每一次Tool Call和Decision、Human in the Loop人工干预接口。

## 三大设计原则

报告归纳了Harness的三大设计原则：

- **约束要小而明确**：最小权限、显式约束、失败收敛。好的约束不是越多越好，而是越明确越好。
- **循环要可控可恢复**：状态可恢复、反馈结构化、循环有边界。保证循环稳定运行，而非追求一次完成。
- **质量要可验证不可假设**：验证优于信任、风险决定自主权、可观测性。模型可以生成结果，但不能保证结果一定正确。

## OpenAI vs Anthropic：两种Harness路线

报告对OpenAI和Anthropic的代表性实践做了对比分析：

**OpenAI Codex**——围绕"工程任务完成"的Harness。内部实证：三人团队5个月生成约100万行生产代码、1500个PR，几乎零手动编写代码。关键机制：Ralph Wiggum Loop（Agent相互评审迭代）。

**Anthropic Claude Code**——围绕"安全自主执行"的Harness。建立了细粒度权限控制体系（Allow/Ask/Deny策略），处理长任务的上下文压缩与项目记忆机制。

两者的共同趋势：**Agent的竞争重点正在从"模型能力"转向"围绕模型构建Harness能力"的竞争**。

## 实践经验：控制权逐步迁移到系统机制

报告总结了一个真实Agent系统的演进路径：

- **阶段一**：从口头叮嘱到CLAUDE.md，规则被记录但约束力下降
- **阶段二**：用Skill沉淀方法论，但要警惕它悄悄"夺权"
- **阶段三**：引入Orchestrator，将选择、调度、验收拆开管理
- **阶段四**：通过Hook实现规则的程序化执行

核心变化：**控制权从人的经验和模型自觉，迁移到明确的系统机制**。

报告中还提到了"任务契约"（Obligation）的概念——明确定义任务必须满足哪些验收项，用契约来定义"完成"，而不是依赖Agent主观判断。

## 未来展望

报告最后讨论了 Harness Engineering 的未来趋势：

- Harness内部组件正在"下沉"，部分能力从定制化工程转变为标准化基础设施
- Context Engineering 成为运行时核心能力，上下文本身成为需要持续治理的运行时资产
- 人机分工重构：Agent接管执行与验证，人类聚焦目标设定、约束定义和价值判断
- 仍有挑战：持久化记忆、多Agent组织能力、长期自主性边界

**一句话总结：模型能力军备竞赛仍在继续，但真正决定Agent生产落地的是围绕模型构建的执行系统。**

---

> 📥 **获取完整报告**：本报告全文共69页，包含详细架构图和案例分析。关注公众号【虾大师】，回复关键字"**北大**"即可获取PDF下载链接。
