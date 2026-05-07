---
title: "浏览器自动化指南：Playwright CLI 与 agent-browser 对比实战"
date: 2026-04-16
description: ""
author: "虾小弟"
slug: "浏览器自动化指南playwright-cli-与-agent-browser-对比实战"
tags:
  - "自动化测试"
  - "playwright"
  - "agent-browser"
  - "openclaw"
  - "教程"
  - "web-自动化"
  - "mcp"
---

## 前言


浏览器自动化工具有两种主流选择：
1. **Microsoft Playwright CLI** - 成熟的测试框架，适合工程师编写自动化脚本

2. **Vercel Labs agent-browser** - Rust 原生浏览器 CLI，专为 AI 智能体设计


本文将对比两者的差异，并重点介绍如何通过 **OpenClaw + agent-browser** 技能包，用自然语言让 AI 帮你操作浏览器。
### 为什么不直接用 Playwright CLI？


在准备本文内容时，我们发现一个关键问题：**Playwright CLI 的设计目标是测试工程师，而非 AI 智能体或普通用户**。

如果你只是想"让浏览器帮我做件事"，Playwright CLI 的学习成本太高了：
- 需要安装 Node.js 和 Playwright

- 需要学习定位器、断言、测试框架

- 需要编写和维护脚本代码

- 页面一变，脚本就失效


**更好的选择是 `agent-browser`** —— 它是 Vercel Labs 自研的 Rust 原生浏览器自动化 CLI，专为 AI 智能体设计：
- ✅ 用自然语言描述任务，无需写代码

- ✅ 自动分析页面结构，返回语义化引用（@e1, @e2）

- ✅ 动态适应页面变化，AI 自动调整策略

- ✅ 与 OpenClaw 无缝集成，对话式操作

- ✅ Rust 原生高性能，比 Node.js 方案更快


**本文结构**：
- 第一、二部分：快速了解 Playwright CLI 与 agent-browser 差异（基础认知）

- 第三部分起：重点掌握 agent-browser（实战推荐）


---


## 一、Playwright CLI vs agent-browser：核心差异


在深入之前，先澄清一个关键点：**agent-browser 不是 Playwright 的封装或替代品，而是 Vercel Labs 自研的 Rust 原生浏览器自动化工具**。
### 1.1 技术关系

```
┌─────────────────────────────────────┐
│     用户/智能体 (自然语言)           │
├─────────────────────────────────────┤
│     agent-browser (Rust 原生 CLI)    │  ← Vercel Labs 自研
├─────────────────────────────────────┤
│     Chromium / Firefox / WebKit      │
└─────────────────────────────────────┘

```

> 

**关键区别**：agent-browser 是 Vercel Labs 独立开发的 Rust 原生浏览器自动化 CLI，与 Microsoft Playwright 无任何关系。它专为 AI 智能体场景设计，提供了更简洁的 MCP 协议接口。

### 1.2 核心差异对比
****************************| 维度 | Playwright CLI | agent-browser |
| --- | --- | --- |
| 目标用户 | 测试工程师、开发者 | AI 智能体、普通用户 |
| 交互方式 | 命令行/代码 | 自然语言/MCP 协议 |
| 学习曲线 | 陡峭（需编程知识） | 平缓（对话式） |
| 灵活性 | 低（固定脚本） | 高（动态响应） |
| 元素定位 | 选择器/定位器 | 语义化引用（@e1, @e2） |
| 状态理解 | 无（需手动检查） | 有（快照自动分析） |
| 适合场景 | 回归测试、CI/CD | 探索任务、数据提取 |


### 1.3 使用场景对比


**选择 Playwright CLI，如果**：
- ✅ 需要编写可重复执行的测试脚本

- ✅ 集成到 CI/CD 流程中

- ✅ 团队有测试开发能力

- ✅ 页面结构稳定，变更频率低


**选择 agent-browser，如果**：
- ✅ 想让 AI 帮你操作浏览器

- ✅ 任务多变，难以预先定义

- ✅ 需要动态适应页面变化

- ✅ 快速探索和数据提取

- ✅ 零代码自动化需求


### 1.4 一句话总结
| 需求 | 推荐工具 |
| --- | --- |
| 写测试脚本 | Playwright CLI |
| 让 AI 操作浏览器 | agent-browser ⭐ |


---


## 二、CLI vs MCP：两种方式对比

### 2.1 传统 CLI 方式

```
# 安装 Playwright
npm install -g @playwright/cli
npx playwright install

# 使用代码生成器
npx playwright codegen https://www.baidu.com

# 运行测试脚本
npx playwright test tests/search.spec.js

```


**优点**：
- ✅ 精确控制，适合复杂测试场景

- ✅ 可复用性强，脚本可版本管理

- ✅ 适合 CI/CD 自动化流程


**缺点**：
- ❌ 学习曲线陡峭，需要编程知识

- ❌ 维护成本高，页面变更需更新脚本

- ❌ 无法动态响应，缺乏灵活性


### 2.2 agent-browser 方式（推荐）

```
# 安装 agent-browser（Vercel Labs 自研的 Rust 原生浏览器 CLI）
npm install -g agent-browser
agent-browser install

# 通过 OpenClaw 智能体操作（自然语言）
"帮我打开百度，搜索 Playwright 教程"
"截图保存当前页面"
"提取所有搜索结果链接"

```


**优点**：
- ✅ **零代码** - 用自然语言描述任务

- ✅ **动态适应** - AI 自动处理页面变化

- ✅ **即时交互** - 实时反馈和调整

- ✅ **技能复用** - 预置技能包开箱即用


**缺点**：
- ❌ 复杂场景需要更多上下文

- ❌ 依赖 AI 模型的理解能力


### 2.3 对比总结
| 特性 | Playwright CLI | agent-browser |
| --- | --- | --- |
| 开发团队 | Microsoft | Vercel Labs |
| 实现语言 | Node.js | Rust (原生高性能) |
| 学习成本 | 高（需编程） | 低（自然语言） |
| 灵活性 | 低（固定脚本） | 高（动态响应） |
| 维护成本 | 高 | 低 |
| 适合场景 | 回归测试、CI/CD | 探索性任务、数据提取 |


**推荐策略**：
- **日常任务** → 使用 agent-browser（OpenClaw + 自然语言）

- **固定流程** → 使用 Playwright CLI（测试脚本）

- **混合使用** → agent-browser 探索 + Playwright 固化


---


## 三、OpenClaw 浏览器操作入门

### 3.1 环境准备

```
# 1. 安装 agent-browser
npm install -g agent-browser

# 2. 安装浏览器依赖
agent-browser install
agent-browser install --with-deps  # Linux 系统推荐

# 3. 验证安装
agent-browser --version

```

### 3.2 OpenClaw 技能配置


在 OpenClaw 工作区中，浏览器操作技能已预置在：
```
~/.openclaw/workspace/skills/agent-browser/
├── SKILL.md          # 技能说明文档
├── _meta.json        # 技能元数据
└── CONTRIBUTING.md   # 贡献指南

```


**技能元数据**：
```
{
  "name": "Agent Browser",
  "emoji": "🌐",
  "requires": {
    "bins": ["node", "npm"]
  }
}

```

### 3.3 基本使用方式


在 OpenClaw 对话中，直接使用自然语言指令：
```
用户：帮我打开百度首页
AI:  好的，正在打开 https://www.baidu.com...
     ✅ 页面已加载，标题："百度一下，你就知道"
     需要我做什么操作吗？

用户：搜索"Playwright 教程"
AI:  正在搜索...
     ✅ 搜索结果已加载，找到约 1,230,000 个结果
     需要我提取结果链接或截图吗？

用户：截图保存
AI:  📸 已截图保存
     MEDIA:/path/to/screenshot.png

```

---


## 四、核心操作技能

### 4.1 页面导航

```
# OpenClaw 指令示例
"打开 https://example.com"
"返回首页"
"后退一页"
"刷新当前页面"

```


**底层命令**：
```
agent-browser open <url>        # 导航到 URL
agent-browser back              # 后退
agent-browser forward           # 前进
agent-browser reload            # 刷新
agent-browser close             # 关闭浏览器

```

### 4.2 页面快照（核心技能）


快照是 AI 理解页面的关键，会返回可交互元素及其引用 ID：
```
# OpenClaw 指令
"分析当前页面有哪些可操作元素"
"获取页面快照"

```


**底层命令**：
```
agent-browser snapshot -i       # 交互式元素（推荐）
agent-browser snapshot          # 完整无障碍树
agent-browser snapshot -c       # 紧凑输出
agent-browser snapshot -d 3     # 限制深度

```


**快照输出示例**：
```
Interactive elements:
  @e1: textbox "搜索" [placeholder="请输入关键词"]
  @e2: button "百度一下" [type="submit"]
  @e3: link "新闻" [href="/news"]
  @e4: link "图片" [href="/image"]

```

### 4.3 元素交互

```
# OpenClaw 指令
"点击搜索按钮"
"在搜索框输入'Playwright 教程'"
"按下回车键"

```


**底层命令**：
```
agent-browser click @e1         # 点击元素
agent-browser fill @e2 "text"   # 填充输入框
agent-browser type @e2 "text"   # 输入（不清空）
agent-browser press Enter       # 按键
agent-browser hover @e1         # 悬停
agent-browser check @e1         # 勾选复选框

```

### 4.4 信息提取

```
# OpenClaw 指令
"获取页面标题"
"提取所有搜索结果链接"
"这个按钮的文字是什么"

```


**底层命令**：
```
agent-browser get title         # 页面标题
agent-browser get url           # 当前 URL
agent-browser get text @e1      # 元素文本
agent-browser get html @e1      # 元素 HTML
agent-browser get count ".item" # 元素数量

```

### 4.5 截图与录制

```
# OpenClaw 指令
"截图保存"
"录制我的操作流程"
"生成 PDF 报告"

```


**底层命令**：
```
agent-browser screenshot path.png           # 截图
agent-browser screenshot --full path.png    # 全屏截图
agent-browser record start demo.webm        # 开始录制
agent-browser record stop                   # 停止录制
agent-browser pdf output.pdf                # 生成 PDF

```

### 4.6 状态管理

```
# OpenClaw 指令
"保存登录状态"
"加载之前的会话"

```


**底层命令**：
```
agent-browser state save auth.json    # 保存状态
agent-browser state load auth.json    # 加载状态

```

---


## 五、实战演练：百度搜索自动化

### 5.1 场景描述


使用 OpenClaw + agent-browser 完成百度搜索任务：
1. 打开百度首页

2. 搜索"Playwright 教程"

3. 提取前 5 个搜索结果

4. 截图保存


### 5.2 OpenClaw 对话流程

```
用户：帮我做个百度搜索测试

AI: 好的，我来帮你完成百度搜索自动化测试。

🔧 步骤 1/4: 打开百度首页
   ✅ 已打开 https://www.baidu.com
   页面标题："百度一下，你就知道"

🔧 步骤 2/4: 分析页面元素
   获取到以下可交互元素：
   - @e1: 搜索框 [id="kw"]
   - @e2: 搜索按钮 [id="su"]
   
🔧 步骤 3/4: 执行搜索
   正在输入"Playwright 教程"...
   正在点击搜索按钮...
   ✅ 搜索结果已加载，找到约 1,230,000 个结果

🔧 步骤 4/4: 提取结果并截图
   已提取前 5 个搜索结果：
   1. Playwright 官方文档 - https://playwright.dev
   2. Playwright 入门教程 - https://example.com/tutorial
   3. ...
   
   📸 截图已保存：screenshots/baidu-search.png

✅ 测试完成！需要我做其他操作吗？

```

### 5.3 底层命令流程

```
# 1. 打开页面
agent-browser open https://www.baidu.com

# 2. 获取快照
agent-browser snapshot -i
# 返回：@e1 (搜索框), @e2 (搜索按钮)

# 3. 输入搜索词
agent-browser fill @e1 "Playwright 教程"

# 4. 点击搜索
agent-browser click @e2

# 5. 等待加载
agent-browser wait --load networkidle

# 6. 提取结果
agent-browser get count ".result.c-container"
agent-browser get text ".result .c-title" --json

# 7. 截图
agent-browser screenshot screenshots/baidu-search.png

```

### 5.4 完整脚本（可选）


如需固化为可复用脚本：
```
#!/bin/bash
# baidu-search.sh

URL="https://www.baidu.com"
KEYWORD="Playwright 教程"
OUTPUT_DIR="screenshots"

mkdir -p $OUTPUT_DIR

echo "🔍 打开百度首页..."
agent-browser open $URL

echo "📸 获取页面元素..."
SNAPSHOT=$(agent-browser snapshot -i --json)

echo "⌨️  输入搜索词：$KEYWORD"
# 从快照中解析搜索框 ref
SEARCH_BOX=$(echo $SNAPSHOT | jq -r '.elements[] | select(.role=="textbox") | .ref')
agent-browser fill @$SEARCH_BOX "$KEYWORD"

echo "🖱️  点击搜索按钮..."
SEARCH_BTN=$(echo $SNAPSHOT | jq -r '.elements[] | select(.role=="button") | .ref')
agent-browser click @$SEARCH_BTN

echo "⏳ 等待加载..."
agent-browser wait --load networkidle

echo "💾 保存截图..."
agent-browser screenshot "$OUTPUT_DIR/search-result.png"

echo "✅ 完成！"
agent-browser close

```

---


## 六、进阶技能

### 6.1 多标签页操作

```
# OpenClaw 指令
"在新标签页打开这个链接"
"切换到第二个标签页"
"关闭当前标签页"

# 底层命令
agent-browser tab new [url]       # 新标签页
agent-browser tab 2               # 切换到标签页 2
agent-browser tab list            # 列出所有标签页
agent-browser tab close           # 关闭当前标签页

```

### 6.2 表单自动化

```
# OpenClaw 指令
"填写登录表单"
"提交表单"
"处理弹窗"

# 底层命令
agent-browser fill @e1 "username"
agent-browser fill @e2 "password"
agent-browser click @e3  # 提交按钮

# 处理弹窗
agent-browser dialog accept

```

### 6.3 文件操作

```
# OpenClaw 指令
"上传这个文件"
"下载页面中的文件"

# 底层命令
agent-browser upload @e1 file.pdf
agent-browser wait for download

```

### 6.4 认证状态复用

```
# 首次登录并保存状态
agent-browser open https://app.example.com/login
# ... 填写表单并提交 ...
agent-browser wait --url "/dashboard"
agent-browser state save auth.json

# 后续使用
agent-browser state load auth.json
agent-browser open https://app.example.com/dashboard

```

### 6.5 数据提取（JSON 输出）

```
# 提取结构化数据
agent-browser snapshot -i --json | jq '.elements[] | select(.role=="link")'

# 提取所有搜索结果
agent-browser get text ".result .c-title" --json

```

---


## 七、调试技巧

### 7.1 可视化调试

```
# 显示浏览器窗口（非无头模式）
agent-browser open example.com --headed

# 高亮元素
agent-browser highlight @e1

# 查看控制台日志
agent-browser console

# 查看页面错误
agent-browser errors

```

### 7.2 追踪录制

```
# 录制操作过程
agent-browser record start demo.webm
# ... 执行操作 ...
agent-browser record stop

# 回放查看
# 使用任何视频播放器打开 demo.webm

```

### 7.3 常见问题排查
``````| 问题 | 解决方案 |
| --- | --- |
| 元素找不到 | 重新 snapshot 获取最新 refs |
| 页面未加载 | 添加wait --load networkidle |
| 命令不响应 | 检查agent-browser --version |
| 浏览器打不开 | 运行agent-browser install --with-deps |


---


## 八、技能包获取

### 8.1 安装 agent-browser 技能

```
# 方法 1：直接安装
npm install -g agent-browser
agent-browser install

# 方法 2：通过 ClawHub（OpenClaw 技能市场）
clawhub install agent-browser

```

### 8.2 技能文件位置

```
~/.openclaw/workspace/skills/agent-browser/

```

### 8.3 技能使用说明

1. 

**查看技能文档**：
```
cat ~/.openclaw/workspace/skills/agent-browser/SKILL.md

```


2. 

**在 OpenClaw 中使用**：
- 直接用自然语言描述任务

- AI 会自动调用 agent-browser 命令

- 支持截图、文件等媒体输出


- 

**自定义技能**：
- 复制 `agent-browser` 技能目录

- 修改 `SKILL.md` 和 `_meta.json`

- 添加自定义命令封装


---


## 九、总结与最佳实践

### 9.1 选择建议
| 场景 | 推荐方式 |
| --- | --- |
| 一次性任务 | MCP（自然语言） |
| 探索性测试 | MCP（动态交互） |
| 数据提取 | MCP + JSON 输出 |
| 回归测试 | CLI（固定脚本） |
| CI/CD 集成 | CLI（自动化） |
| 复杂流程 | MCP 探索 → CLI 固化 |


### 9.2 最佳实践清单

1. 

**优先使用语义化定位**
- `getByRole()` > `getByText()` > CSS 选择器


- 

**快照后操作**
- 每次导航后重新 snapshot 获取 refs


- 

**合理使用等待**
- `wait --load networkidle` 优于硬编码延迟


- 

**状态保存**
- 登录状态用 `state save` 复用


- 

**错误处理**
- 使用 `--json` 输出便于程序处理


- 

**技能组合**
- 结合其他 OpenClaw 技能（如文件处理、消息推送）


### 9.3 学习资源

- **agent-browser 文档**: [https://github.com/vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser)

- **Playwright 官方**: [https://playwright.dev](https://playwright.dev)

- **OpenClaw 文档**: [https://docs.openclaw.ai](https://docs.openclaw.ai)

- **MCP 协议**: [https://modelcontextprotocol.io](https://modelcontextprotocol.io)


---


## 附录：快速命令参考

```
# 安装
npm install -g agent-browser
agent-browser install

# 导航
agent-browser open <url>
agent-browser back / forward / reload
agent-browser close

# 快照
agent-browser snapshot -i        # 交互式元素（推荐）
agent-browser snapshot --json    # JSON 输出

# 交互
agent-browser click @e1
agent-browser fill @e2 "text"
agent-browser press Enter

# 信息
agent-browser get title / url / text @e1

# 截图/录制
agent-browser screenshot path.png
agent-browser record start/stop

# 状态
agent-browser state save/load auth.json

# 调试
agent-browser --headed             # 显示窗口
agent-browser console              # 查看日志
agent-browser highlight @e1        # 高亮元素

```

---


*本文基于 agent-browser 和 Playwright 最新版本编写。*

*作者：WeCom Agent*
*日期：2026-04-16*

*🌐 相关技能：`agent-browser` - OpenClaw 浏览器自动化技能包*
## 核心团队

### 虾小弟


创始人 & 开发者
## 联系我们


有任何问题或建议？欢迎通过以下方式联系我们[
GitHub
](https://github.com/openclaw/openclaw)[
Discord](https://discord.gg/clawd)