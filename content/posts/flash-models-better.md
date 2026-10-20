---
title: "太空兔 Space Bunny 原来是Minimax-M3.1-Flash！Flash模型更好用？"
date: 2026-10-20
description: "太空兔 Space Bunny 揭晓真身为 MiniMax M3.1 Flash：两个月内第三款国产 Flash 齐发，跑分、特性与幻觉率全解析。"
author: "虾小弟"
slug: "flash-models-better"
tags:
  - "大模型"
  - "MiniMax"
  - "DeepSeek"
  - "智谱"
  - "AI评测"
categories:
  - "ai-news"
cover: "/images/covers/flash-models-better.jpg"
draft: false
---

10 月 19 日晚，OpenRouter 官方在 X 上揭晓了本月 AI 圈最大的悬案：匿名模型「太空兔 Space Bunny 🐰」的真身，是 MiniMax 当天正式发布的 **M3.1 Flash**。

至此，不到两个月，国产大模型第一梯队已集齐三款「Flash」：智谱 GLM-5.3-Flash（8 月 26 日）、DeepSeek V4.1-Flash（9 月 10 日，10 月 17 日升级至 1017 版本）、MiniMax M3.1-Flash（10 月 19 日）。三款全部主打「快、强、开放」，把「Flash = 低配版」的旧观念冲得七零八落。

![太空兔马甲拉开拉链，里面是一只红色小龙虾](/images/illustrations/flash-models-better/01-space-bunny-reveal.png)

## 一只兔子跑出的 200 万亿 token

据 OpenRouter 与 OpenCode 公开数据：Space Bunny（全名 Space Bunny Alpha）9 月 23 日匿名上线，在 OpenCode 上**连续 12 天霸榜 Token 日调用量第一**；在 OpenRouter 上连续 10 天排名第一、处理 **56.7 万亿 token**，是该平台历史上用量最大的匿名测试模型；四周累计处理超过 **200 万亿 token**。

无独有偶。GLM-5.3-Flash 发布前，智谱也以「Ox-Alpha」（社区称「牛来」）匿名测试了一周，冲上双平台调用量新高后才认领。

**先用真实流量验证，再实名发布**——正在成为大模型发布的新流程。

## Flash 不再是低配版

2024 年提 Flash，大家想到的是 Gemini Flash：快、便宜、但明显笨一截。2026 年，这个词被国产厂商彻底改写了。

最具标志性的是 DeepSeek：官方文档明确，**V4.1 Flash 在性能、费用、速度、总用时上全面超过 V4 Pro**——随后 V4 Pro 直接退役，所有 `deepseek-v4-pro` 请求原地路由给 Flash。旗舰被 Flash 干退役了，这是行业头一回。

智谱的故事类似：GLM-5.3-Flash 唯一一次与旗舰同卷对比（DeepSWE v1.1）得分 63.4，旗舰 GLM-5.3 为 66.9，只差 3.5 分。支撑这一切的是新架构——稀疏注意力 + 线性注意力混合，GLM 的注意力计算量降 3.01 倍、KV 缓存降 4.44 倍；DeepSeek 也把 KV 缓存压到上一代的 1/4，对 Agent 长任务格外友好。

![小龙虾冲过终点线，「旗舰」坐上替补席挂起毛巾](/images/illustrations/flash-models-better/02-flagship-retired.png)

## 三款横评：能横着比的只有第三方榜单

各家发布会都自己挑卷子，目前唯一可横向对比的统一标尺，是第三方机构 Artificial Analysis（AA）的综合智能指数。厂商自报数据单独标注：

| 维度         | GLM-5.3-Flash | DeepSeek V4.1-Flash-1017  | MiniMax M3.1-Flash    |
| ------------ | ------------- | ------------------------- | --------------------- |
| 发布时间         | 8 月 26 日      | 9 月 10 日（10·17 升级）        | 10 月 19 日             |
| 参数规模         | 320B，激活 18B   | 552B MoE，输入激活 8B / 输出 16B | 约 428B（社区口径）          |
| AA 智能指数      | 42（官方称 57）    | **45**                    | 42~43                 |
| DeepSWE v1.1 | 63.4          | **77.0**                  | 73.7                  |
| HLE 人类终考     | 40%           | 43%                       | **48%**               |
| OSWorld V2   | —             | —                         | **61.7**（国产第一）        |
| 实测输出速度       | 约 49–78 TPS   | 约 149 TPS                 | **120 TPS**（官方称 200+） |
| 上下文          | 1M            | 1M                        | 1M                    |
| 原生多模态        | 图 + 视频        | 图                         | —                     |
| 开源           | MIT           | MIT                       | 权重 10·23 放出           |

> 注：Terminal-Bench 各家测的版本不同（GLM 报 2.1 版 84.3，DeepSeek 报 4.0 版 42.3，MiniMax 报 4.0 版 38.1），卷子不一样，不能直接横比。

## 各家的绝活

**DeepSeek：编码最狠。** DeepSWE 77.0 三家最高；1017 版把 Terminal-Bench 4.0 从 31.2 拉到 42.3，官方称一次「性能与费用的帕累托改进」——分数上涨的同时，输出长度和任务时长反而在收缩。模型名和调用方式都没变，网页端、App、API 与国家超算互联网同步切换，老用户睡一觉起来变强。

**GLM-5.3-Flash：唯一的六边形。** 三款中唯一原生支持图像 + 视频输入，能看渲染结果改前端、看屏幕操作电脑（ARC-AGI 91.0、GPQA Diamond 90.2、AIME 93.9）。发布周首次用 10 万张国产芯片承载线上流量，端到端性能提升 3 倍；官方 demo 里它曾在 Blender 中自主运行 16 小时，搭出一套约 400 平方米的三维场景。MIT 协议开源，已接入 Z.ai、智谱清言与 GLM Coding Plan。

**MiniMax M3.1 Flash：最快，也最会写。** 第三方实测 120 TPS 三家最快，跑完 AA 指数仅消耗 1.89 亿输出 token（GLM 3.24 亿、DeepSeek 2.24 亿）；推理常开，只能调 Low→Max 五档力度。一份 12 信源、24 篇稿件、GPT-6.1 Sol 与 Claude Opus 5.5 双评委的新闻编辑室测试中，它拿到 **3.57/5**——开源模型第一，信源保真度 4.54 为非 OpenAI 系最高。网络安全 CyberGym 82%。已上线 MiniMax API、M Plan 与 MiniMax Code，即日起至 10 月 25 日订阅用户不限量使用。

## 看榜单，也要看坑

三款 AA 指数 42 / 42~43 / 45，最大差距 3 分。但第三方测评的波动普遍在 ±4 分——BenchLeader 给 GLM-5.3-Flash 的指数是 62.9±4.0，并注明有 157 个模型配置挤在同一分数区间。所以才出现「MiniMax 指数落后 3 分，写作实测反超所有人」这种拧巴结果。

幻觉同样要留意：据亿邦动力转述的测评，M3.1 Flash 面对不确定内容极少拒答，**幻觉率达 93%**；AA-Omniscience 事实准确性上三家为 56% / 43% / 28%（MiniMax / DeepSeek / GLM），GLM 垫底。拿 Flash 写东西，事实核查一步不能省。

还有口径差：智谱官方称 AA 指数 57 分、对标 Claude Opus 4.8，而 AA 页面目前抓到的是 42 分。中间差的 15 分，就当是「发布会口径」和「第三方复测」的量子叠加吧。

![小龙虾举着放大镜核查文档，幽灵从纸后探出头](/images/illustrations/flash-models-better/04-hallucination-check.png)

## 所以，Flash 更好用吗？

| 你要干嘛           | 首选                  | 理由          |
| -------------- | ------------------- | ----------- |
| 写代码、跑长程 Agent  | DeepSeek V4.1-Flash | 编码跑分最强      |
| 看图看视频、前端视觉编码   | GLM-5.3-Flash       | 唯一原生多模态     |
| 写作、高频 Agent 循环 | MiniMax M3.1-Flash  | 最快 + 写作实测第一 |
| 不想纠结           | 随便挑                 | 统一标尺下真差不多了  |

回答标题的问题：对 90% 的日常任务，是的，Flash 更好用——但「好用」的定义已经变了：不再指「便宜但凑合」，而是指**跑分追平旗舰、速度还更快**。旗舰没有消失，只是变成了长尾兜底。

智能不再需要省着用。但 Flash 们的幻觉，需要你多长个心眼。
