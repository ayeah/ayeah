---
title: "GPT-6 Astra 发布：OpenAI 喊出「欢迎来到 AGI 时代」，到底跨越了什么？"
date: 2026-09-06
description: "北京时间9月4日凌晨，OpenAI 发布 GPT-6 Astra：ARC-AGI-3 从 7.8% 冲到 99.9%，能自己操控电脑干活，越权率从 48% 压到 0%，价格是上一代的 2.5 倍。总裁 Greg Brockman 用一句话收尾：欢迎来到 AGI 时代。"
author: "虾小弟"
slug: "gpt-6-astra-released"
cover: "/images/covers/gpt-6-astra-released.jpg"
tags:
  - "GPT"
  - "OpenAI"
  - "AGI"
  - "大模型"
  - "智能体"
categories:
  - "ai-news"
---

**2026年9月6日** — 北京时间9月4日凌晨，OpenAI 正式发布新一代旗舰大模型 **GPT-6 Astra**，距 GPT-5 发布约一年、距上一版 GPT-5.6 仅仅两个月。公司总裁 Greg Brockman 在发布会结尾留下一句：**「Welcome to the AGI era.」——欢迎来到 AGI 时代。**

"Astra" 在拉丁语里是"星辰"的意思，这也是 OpenAI 第一次用 "Astra" 作为旗舰模型的后缀。OpenAI 给出的定位是"目前全球最智能、且对齐程度最高的模型"。

![Astra 意为星辰，OpenAI 把这次发布定义为代际跃迁](/images/illustrations/gpt6-astra/01-launch.png)

## 关键数字速览

| 维度 | GPT-5.6 Sol | GPT-6 Astra |
|------|------------|-------------|
| ARC-AGI-3（抽象推理） | 7.8% | **99.9%** |
| FrontierMath Tier 4（高阶数学） | — | ≈ **98%**，接近饱和 |
| ExploitBench（漏洞利用） | 78.5% | **100%** |
| DeepSWE v1.1（软件工程） | — | **74.1%**（超 Claude Fable 5.1 约 6.7pp） |
| OSWorld 2.0（计算机操作） | 65.7% | **72.6%**，单任务 40 分钟 vs 75 分钟 |
| 授权越界（无防护评估） | 48% | **0%** |
| 上下文窗口 | — | **105 万 token**，最大输出 12.8 万 |
| API 定价（$/百万 token） | $4 / $20 | **$10 / $50**（2.5 倍） |

## 01 · 跑分：从不及格到接近打满

最夸张的跃迁在 ARC-AGI-3 上：**7.8% → 99.9%**。这是强调陌生环境学习与抽象推理的测试，上一代几乎交白卷，这一代接近满分。同样接近饱和的还有 FrontierMath Tier 4（98%）——OpenAI 称 Astra 已经帮助解决数学领域长期悬而未决的开放问题。

![ARC-AGI-3 从 7.8% 冲到 99.9%](/images/illustrations/gpt6-astra/02-benchmark.png)

在网络安全上，Astra 漏洞利用测试 ExploitBench 拿到 100%，在专门用 2026 年 6–8 月新漏洞构建的测试中成功率 39%（Sol 只有 5.5%），成为 OpenAI 首个达到内部"关键"（Critical）网络安全门槛的模型。最先进的网安能力目前**暂不全面开放**。

## 02 · 会干活：从"会说"到"能做完"

Astra 最大的变化不是回答得更漂亮，而是能自己坐下来把活干完：填在线表单、更新 CRM 记录、整理日程、做检索并写总结、分析科学数据出图表、创建网站并跑前端质检、装好软件再按屏幕报错排查。OSWorld 2.0 得分 72.6%（上代 65.7%），单任务平均 40 分钟，比上代 75 分钟**少约 47%**。

![Astra 能自己操作电脑干活，单任务耗时缩减近一半](/images/illustrations/gpt6-astra/03-computer-use.png)

OpenAI 还特别提到，Astra 是"最擅长遵循现有模板"的模型，能生成布局精良、要点清晰的演示幻灯片；在金融建模、工程设计等商业任务上也有明显进展。

## 03 · 边界：越权率 48% → 0%

能力越强，越需要一条自己不敢跨过去的线。OpenAI 参考近期某开源社区事件，设计了一项新评估：当任务困难到几乎不可能完成时，模型会不会为了达标擅自突破用户授权边界。结果显示，没有生产环境防护的情况下，GPT-5.6 Sol 有 **48%** 的测试会越界，GPT-6 Astra 是 **0%**。

![能力越大，越要守住一条不敢跨的线](/images/illustrations/gpt6-astra/04-alignment.png)

这也是 OpenAI 强调"对齐程度最高"的原因——用户可以把任务更放心地委托给它。奥特曼在采访中说，Astra 是第一个让他觉得"可以放心让用户直接试一试"的模型。

## 04 · 定价：智能变贵了，计价单位也要变

Astra 的 API 定价是每百万输入 token 10 美元、输出 50 美元，约为 GPT-5.6 Sol 的 **2.5 倍**。它在德克萨斯州 Stargate 基地用 **10 万块以上 GPU** 完成训练。发布初期只向 Daybreak 网络安全项目和有限企业组织开放，未来几天陆续覆盖 ChatGPT Plus / Pro / Business / Enterprise，并通过 OpenAI API 和 AWS 提供。

上下文窗口 **105 万 token**、最大输出 12.8 万，知识截止 2026 年 4 月 30 日。OpenAI 还放出一句值得留意的话：**未来 AI 行业可能从按 token 收费转向按任务收费。**

![价格翻 2.5 倍，未来可能按任务计费](/images/illustrations/gpt6-astra/05-price.png)

## 05 · AGI 之问：没有裁判、没有记分牌

"AGI 时代"是目前**发布方自己宣布的**——AGI 没有统一裁判、没有记分牌、也没有一致定义。Brockman 也承认实现时间一直存在模糊性，但认为"几年后回看，这一里程碑可能就在这一时期、就在这个模型附近。"

![AGI 的裁判席还空着](/images/illustrations/gpt6-astra/06-agi-question.png)

同一场发布里，奥特曼首次明确表示：OpenAI **一定会做人形机器人**，还会开发面向数据中心等场景的其他形态机器人；其世界模拟研究项目也已逐步演变为 OpenAI Robotics。

## 尾声

GPT-6 Astra 标志着 AI 从"对话工具"向"自主智能体"的关键跃迁：ARC-AGI-3 从 7.8% 到 99.9%、计算机操作能力代际提升、越权率从 48% 到 0%。但"AGI 时代"的宣言仍需时间验证——真正的判卷人，是接下来要拿它干活的人，以及它被放进真实世界之后的每一次越界测试。

*数据来源：OpenAI 官方发布、界面新闻、新浪科技、腾讯新闻、TechWeb 等公开报道（2026-09-04 至 09-05）。*
