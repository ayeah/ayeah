---
title: "WorkBuddy技能推荐：仓颉 Skill v2.5 蒸馏整本书"
date: 2026-09-16
description: "把读过的书变成 Agent 能调用的能力：看懂仓颉 Skill 的 RIA-TV++ 方法论，以及从 165 个顶级 AI 产品提示词蒸馏出的 System Prompt Skills。"
author: "虾小弟"
slug: "cangjie-skill"
cover: "/images/covers/cangjie-skill.jpg"

tags:
  - "Agent Skill"
  - "提示词"
  - "AI Agent"
categories:
  - "agent"
---

> 仓库 github.com/kangarooking/cangjie-skill ｜ 官网 cangjie-skill.com ｜ MIT ｜ v2.5.0 ｜ 10,099 Star

书读完了，遇到问题时脑子里浮现的却是「我好像在哪看过一个方法」，而不是「第一步做什么」。笔记、导图、读后感都是为**人**设计的，靠记忆调用；而 Agent 不靠记忆，靠**读取一份可执行的本地文件**获得能力。cangjie-skill 就冲着这个断层来：把书、长视频、播客、课程蒸馏成 Agent 可按需调用的 Skill。

![把读过的书，变成 Agent 能调用的能力](/images/illustrations/cangjie-skill/01-books-to-cards.png)

## 一、功能概述

- **元技能**：根目录 `SKILL.md` 即一条完整拆书流水线，说一句「帮我拆《穷查理宝典》」就能启动。只做方法论与流程，不做书摘、读后感、作者人设扮演。
- **Registry 目录**：官网收录 **22 个 Skill Pack、约 300 个原子 Skill**。代表作品：巴菲特致股东信、毛选、AI for Everyone、黄帝内经、段永平问答录、爆款文案。
- **双输出模式**：`single` 用一个路由入口承载全书，`pack` 只把少数晋级能力拆成独立 Skill——回应「一本书拆出十几个 Skill」的安装成本。
- **跨宿主安装**：官网提供供 Agent 读取的安装规范，覆盖 Codex / Claude Code / Cursor / WorkBuddy 等，用户只需把一条提示词发给 Agent。

![同一本书，两种装法](/images/illustrations/cangjie-skill/04-two-output-modes.png)

## 二、技术原理

**核心洞察**：现有读书方法都是为人类读者蒸馏，不是为 Agent 执行者蒸馏。

| | 给人看 | 给 Agent 用 |
|---|---|---|
| 关键字段 | 故事 / 金句 | trigger / 步骤 / 判停标准 |
| 失败模式 | 读完就忘 | trigger 不准 → 乱调用 |
| 成功标准 | 「有收获」 | 问题被解决 |

**RIA-TV++** = RIA（赵周拆书法）+ TV（三重验证）+ ++（E 执行 + B 边界）。七阶段流水线：整书理解 → 5 个 sub-agent 并行提取 → 三重验证 → 晋级门 → RIA++ 能力卡 → 卡片盒链接 → 压力测试与编译交付。

![层层筛选，只剩少数经得起检验的能力](/images/illustrations/cangjie-skill/02-funnel-pipeline.png)

**能力卡六段**：R 原文引用、I 方法论骨架、A1 书中的应用（标明亲历 / 转述 / 合成演练，不编造）、**A2 触发场景**、E 可执行步骤（每步有完成标准与判停条件）、**B 边界**。A2 与 B 是「++」的部分，也是人写笔记里几乎不出现、但 Agent 最需要的两段。

![能力卡还差两块拼图](/images/illustrations/cangjie-skill/03-two-missing-pieces.png)

**Capability Bundle**：所有能力卡集中在 `.cangjie/capabilities/`，**single 与 pack 从同一份 Bundle 确定性编译**，引用同一组 `capability_id`——产物是派生物，不是手写文件。配套还有写锁、原子发布、快照回滚与增量更新。

**生态**：nuwa-skill 蒸馏**人**、cangjie-skill 蒸馏**书**、darwin-skill **进化**任意 skill；评测用例格式互通，产物可直接接入自动进化。

## 三、官方案例

**System Prompt Skills**——与本博客主题最贴合的官方成品：从 **165 个顶级 AI 产品系统提示词**（Anthropic、OpenAI、Google、Perplexity 等，源自公开语料 asgeirtj/system_prompts_leaks）蒸馏出 **15 个可复用的 Agent skill**。它明确不是「泄露提示词合集」，而是可迁移的方法论，按四层组织：

- **核心架构**：身份（persona-design）、人格、工具、安全防线、记忆
- **交互控制**：输出格式、对话流程、搜索集成、引用溯源
- **工程支撑**：上下文管理、子代理分工、注入防御
- **场景适配**：语音、移动端、编程代理

![从 165 份提示词，提炼成可复用的方法](/images/illustrations/cangjie-skill/05-system-prompts.png)

以 `persona-design` 为例：跨 165 份提示词归纳出「身份 = 角色声明 + 能力边界 + 行为修饰符 + 关系框架」四维矩阵；`injection-defense` 则给出可执行步骤（信任分级 → 三层防御链 → 规则不可变声明）。这正是仓颉把「语料」蒸馏成「可执行方法」的实证，且淘汰候选同样在 `rejected/` 留档可查。

调用示例：「请使用『System Prompt Skills』中最适合的方法处理我的任务，开始前先说明你选择了哪个原子 Skill 及其工作流程。」

## 四、核心价值

解决四个问题：读了不等于用了；摘要是压缩而非结构化复用；只有少数内容值得变成工具；现有方法为「人」设计，蒸馏必须执行导向。

| 传统做法 | 仓颉做法 | 变化 |
|---|---|---|
| 摘要 / 笔记 | 六段能力卡 | 从「知道」到「能执行」 |
| 读完就完 | 评测用例 + 压力测试 | 调用准确性可验证 |
| 一次性产物 | Bundle + 增量更新 + 回滚 | 源书修订时可演进 |

最难得的是**可审计**：`coverage-audit.md` 回答的不是「这本书讲了什么」，而是「哪些留下了、哪些扔了、为什么」。

## 五、适用场景

- **个人知识管理**：把读过但没用上的书变成可调用的判断工具。
- **投资与商业决策**：用特定框架审视持仓或商业计划，而非给泛泛的「AI 观点」。
- **内容创作与营销**：《爆款文案》《文案创作完全手册》《疯传》《1000 个铁粉》——把方法论变成写稿前自动调用的检查项。
- **组织、学习与工程**：《不拘一格》《毛选》《认知红利》《第一性原理》，加上本案例的 System Prompt Skills。
- **元用法**：把团队内部的 SOP、复盘记录按同一流水线做成 Skill。

**不适用**：想要更长的摘要、想扮演作者人设（用 nuwa-skill）、手头没有源文本。

## 结语

仓颉真正有意思的，不是「能把书变成 Skill」，而是它做出的判断：**当 Agent 成为知识的主要消费者，知识的组织方式必须重写。** 人读书要故事与金句，Agent 要 trigger 与判停条件。

此技能已上架WorkBuddy技能市场，在技能中搜索`仓颉Skill`，推荐的便是此技能。
