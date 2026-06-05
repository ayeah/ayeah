---
title: "氛围交易：港大开源的量化交易Agent，接入OpenClaw使用指南"
date: 2026-06-05
description: "从Vibe Coding到Vibe Trading，港大HKUDS团队开源的量化交易Agent，支持A股/港股/美股/加密货币，一行命令接入OpenClaw智能体平台。"
author: "虾小弟"
slug: "vibe-trading-openclaw-guide"
cover: "/images/covers/vibe-trading-openclaw-guide.jpg"
tags:
  - "OpenClaw"
  - "量化交易"
  - "A股"
  - "开源项目"
categories:
  - "agent"
draft: false
---

## 从 Vibe Coding 到 Vibe Trading

如果你关注技术圈，一定听过 **Vibe Coding**——Andrej Karpathy 在 2025 年初提出的概念："不再逐行写代码，而是用自然语言描述需求，让 AI 帮你完成。" 这种"氛围编程"的方式迅速改变了软件开发的工作流。

那么，能不能用同样的方式做量化交易研究？

答案是：**可以。** 香港大学数据科学实验室（HKUDS）在 2026 年 4 月开源了 [Vibe-Trading](https://github.com/HKUDS/Vibe-Trading) 项目——一个"氛围交易"Agent。你只需要用自然语言描述你的投资问题或策略想法，它就能自动加载市场数据、生成策略代码、运行回测、输出报告。

不需要写 Python，不需要懂 Pandas，不需要配置数据源。说一句话就行。

---

## Vibe-Trading 是什么

Vibe-Trading 是一个开源的量化交易研究工作空间。它把"自然语言提问"和"可执行的量化分析"连在一起，覆盖了从数据获取、策略生成、回测验证到报告输出的完整链路。

| 能力 | 说明 |
|------|------|
| 自然语言研究 | 用日常语言提问，Agent 自动调用工具完成分析 |
| 跨市场数据 | A股、港股、美股、加密货币、期货、外汇 |
| 策略回测 | 生成可执行策略代码 + 指标验证 + 基准对比 |
| 多 Agent 团队 | 投资委员会、量化策略、风险评估等 29 个预设团队 |
| 影子账户 | 从券商交割单提取交易行为，诊断偏差 |
| Alpha 因子库 | 452 个预构建因子（Qlib、Kakushadze、国泰君安、学术经典） |
| 持久记忆 | 跨会话记住你的偏好和研究上下文 |

项目基于 MIT 协议开源，Python 3.11+ 运行，支持 12 个主流 LLM 提供商（DeepSeek、OpenAI、Gemini、Qwen、Kimi 等），也支持本地 Ollama 部署。

---

## 对 A 股的支持

Vibe-Trading 对 A 股的支持相当完善，这也是它区别于很多海外量化框架的亮点：

**数据源**：内置 5 个 A 股数据加载器，自动降级切换：
- **mootdx**：通达信 TCP 协议直连，无需 Token，无 IP 频率限制，支持日线 + 分钟线
- **AKShare**：免费开源，覆盖 A 股、港股、期货、外汇
- **Tushare**：需要 Token，提供 PIT（Point-in-Time）基本面数据，支持财报字段筛选
- **yfinance**：Yahoo Finance 备用源
- **富途 Futu**：港股 + A 股实时数据

**特色功能**：
- `ashare-pre-st-filter` 技能：自动过滤 ST/*ST 风险股票
- `alpha bench` 一行命令在沪深 300 上跑完 191 个国泰君安因子的 IC 测试
- 多因子策略回测支持 `income_total_revenue`、`fina_indicator_roe` 等财报字段
- 策略导出支持通达信公式（TDX 格式）

---

## 三个核心功能详解

### 1. run_swarm：投资委员会报告

`run_swarm` 是 Vibe-Trading 的多 Agent 协作引擎。它预设了 29 个专业团队模板，其中最值得关注的是 `investment_committee`（投资委员会）：

**工作流程**：
1. **多头分析师**：从基本面、技术面、资金面论证买入理由
2. **空头分析师**：系统性反驳，找出风险点和做空逻辑
3. **风控审查**：评估最大回撤、尾部风险、市场状态
4. **基金经理**：综合双方观点，给出最终决策建议

整个过程实时流式输出，每个 Agent 的推理过程透明可见，最终生成一份结构化的投资委员会报告。

其他预设团队同样强大：
- `global_equities_desk`：A股 + 港股/美股 + 加密货币研究员协同全球策略师
- `crypto_trading_desk`：资金费率 + 清算热力图 + 资金流向 → 风控经理
- `macro_rates_fx_desk`：利率 + 外汇 + 商品 → 宏观基金经理

### 2. quant_strategy_desk：量化策略回测

这个团队专注于从因子筛选到回测验证的完整量化流程：

**工作流程**：
1. **因子筛选员**：从 452 个预构建因子中筛选有效因子
2. **因子研究员**：对筛选结果做 IC 分析、分层回测、相关性检验
3. **回测执行**：在指定股票池和时间段运行策略回测
4. **风险审计**：检查回撤、夏普比率、信息比率等指标

一行命令就能启动：
```bash
vibe-trading --swarm-run quant_strategy_desk '{"universe": "CSI 300", "horizon": "6 months"}'
```

### 3. risk_committee：专项风险评估

专门用于策略上线前的风险审查：

**工作流程**：
1. **回撤分析师**：评估最大回撤、回撤持续时间、恢复周期
2. **尾部风险分析师**：蒙特卡洛模拟 + Bootstrap 置信区间
3. **市场状态审查**：识别策略在不同市场周期（牛市/熊市/震荡）的表现
4. **风控签字**：综合评估，给出策略上线建议

---

## 接入 OpenClaw：一行命令安装

Vibe-Trading 已发布到 ClawHub（OpenClaw 的技能市场），安装只需一行命令：

```bash
npx clawhub@latest install vibe-trading --force
```

> `--force` 参数是因为技能引用了外部 API，会触发 VirusTotal 自动扫描。代码完全开源，可放心审查。

安装完成后，Vibe-Trading 的 36 个 MCP 工具会自动注册到 OpenClaw 的技能目录。你的 OpenClaw Agent 立刻获得了完整的量化交易研究能力——不需要手动配置数据源、不需要安装 Python 依赖、不需要启动额外服务。

**前提条件**：
- OpenClaw 已安装并运行
- 至少有一个 LLM API Key（DeepSeek、OpenAI、Qwen 等均可）
- Node.js 环境（用于运行 `npx clawhub`）

---

## 使用案例

安装完成后，直接在 OpenClaw 中用自然语言交互。以下是几个实用场景：

### 案例 1：A 股个股深度研究

**你说**："帮我研究一下比亚迪（002594.SZ）：最近三个季度的营收趋势、分析师一致预期、期权异动、以及主要风险点。"

**Agent 做的事**：
- 自动选择 AKShare/mootdx 数据源加载 A 股行情
- 调用 `web_search` 搜索最新财报和分析师报告
- 分析期权链数据（如有）
- 输出一份结构化的个股研究报告

### 案例 2：量化策略回测

**你说**："在沪深 300 成分股上回测一个动量+价值+质量的多因子策略，过去 2 年，展示夏普比率和最大回撤。"

**Agent 做的事**：
- 加载 `multi-factor` 技能
- 获取沪深 300 成分股列表和历史数据
- 生成可执行的多因子策略代码
- 运行回测引擎，计算夏普比率、最大回撤、信息比率
- 与基准（沪深 300 指数）对比
- 输出回测报告 + 策略代码

### 案例 3：投资委员会辩论

**你说**："让投资委员会讨论一下：现在是不是买入腾讯（0700.HK）的好时机？"

**Agent 做的事**：
- 启动 `investment_committee` 团队
- 多头分析师列出买入理由（估值、业绩、政策利好）
- 空头分析师反驳（监管风险、竞争格局、宏观不确定性）
- 风控审查回撤和尾部风险
- 基金经理综合出具投资建议

### 案例 4：交易行为诊断

**你说**："这是我的同花顺交割单，帮我分析交易行为，看看有没有处置效应和过度交易的倾向。"

**Agent 做的事**：
- 解析同花顺导出的 CSV 文件
- 计算持仓天数、胜率、盈亏比、最大回撤
- 检测四种行为偏差：处置效应、过度交易、追涨杀跌、锚定效应
- 提取你的隐性交易规则
- 运行影子账户对比：如果严格执行规则，收益会有什么不同

### 案例 5：Alpha 因子批量测试

**你说**："把国泰君安的 191 个短周期因子在沪深 300 上跑一遍，2018 到 2025 年，找出 IC 最高的前 20 个。"

**Agent 做的事**：
- 调用 `alpha bench` 工具
- 加载 191 个 GTJA 因子
- 在沪深 300 上计算每个因子的 IC（信息系数）和 IR（信息比率）
- 分类标记：仍然有效 / 已反转 / 已失效
- 输出 Top 20 因子列表 + 详细指标

---

## 36 个 MCP 工具一览

安装后，OpenClaw Agent 可以调用的工具包括：

| 类别 | 工具 | 用途 |
|------|------|------|
| 研究 | `start_research_goal`、`get_research_goal` | 设定和跟踪研究目标 |
| 数据 | `get_market_data`、`read_url`、`web_search` | 获取行情、资讯、网络信息 |
| 回测 | `backtest`、`factor_analysis` | 策略回测和因子分析 |
| 团队 | `run_swarm`、`list_swarm_presets` | 启动多 Agent 协作团队 |
| 交易 | `trading_account`、`trading_positions`、`trading_quote` | 查看账户、持仓、行情 |
| 影子账户 | `analyze_trade_journal`、`extract_shadow_strategy` | 交易行为分析 |
| 文件 | `read_document`、`write_file`、`read_file` | 读写文档和策略代码 |

完整的 36 个工具列表可在 [项目文档](https://vibetrading.wiki/docs/) 查看。

---

## 注意事项

1. **数据源配置**：A 股数据默认使用 mootdx（免费，无需配置）。如需更丰富的基本面数据，可配置 Tushare Token。
2. **模型选择**：推荐使用 DeepSeek-V4-Pro 或 Qwen3-Max 作为 LLM 后端，工具调用能力较强。避免使用小模型（如 Nano/Flash-lite），工具调用不可靠。
3. **实盘交易**：Vibe-Trading 支持通过 Connector 连接券商（Tiger/Longbridge/Alpaca/OKX/Binance/Futu/IBKR），但默认只读。实盘交易需要用户主动提交 Mandate（交易约束），并随时可一键停止。
4. **本地数据缓存**：开启 `VIBE_TRADING_DATA_CACHE` 后，历史数据会缓存到 `~/.vibe-trading/cache`，避免重复请求和频率限制。

---

## ⚠️ 风险提示

**股市有风险，投资需谨慎。**

这句话在 A 股市场尤其重要。A 股不是一个成熟的交易市场，它高度受到以下因素的影响：

- **政策驱动**：监管政策、产业政策的变化可以在一天之内改变一个行业的估值逻辑
- **机构主导**：公募基金、保险资金、北向资金的集体行为会放大波动
- **媒体情绪**：一篇官媒文章可以引发板块级别的剧烈波动
- **制度特殊性**：T+1 交易、涨跌停板、ST 制度、注册制改革等，与海外市场有本质区别

Vibe-Trading 是一个**研究工具**，不是投资建议生成器。AI 的分析基于历史数据和统计规律，它无法预测政策突变、黑天鹅事件、或市场情绪的非理性转向。

**建议的使用方式**：
1. **先学习**：用 Vibe-Trading 理解量化策略的基本概念和评估指标
2. **再研究**：用回测功能验证你的投资假设，但要注意过拟合风险
3. **后验证**：在模拟盘上跟踪策略表现至少 3-6 个月
4. **切不可**：直接依据 AI 的分析结论进行实盘投资

记住：如果一个策略在回测中表现完美，那它很可能过拟合了。如果一个 Agent 告诉你"这只股票一定涨"，那它只是在重复训练数据中的模式，而不是在做真正的预测。

**Vibe-Trading 帮你更高效地做研究，但最终的投资决策，永远是你自己的。**

---

*项目地址：[github.com/HKUDS/Vibe-Trading](https://github.com/HKUDS/Vibe-Trading)*
*文档站点：[vibetrading.wiki](https://vibetrading.wiki/)*
*ClawHub 技能页：[clawhub.ai/skills/vibe-trading](https://clawhub.ai/skills/vibe-trading)*
