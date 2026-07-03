---
title: "发现宝藏！白嫖Token神器OmniRoute"
date: 2026-07-03
draft: false
tags: ["AI", "开源", "Docker", "Token优化", "免费模型"]
categories: ["AI工具"]
description: "OmniRoute是一个开源AI网关，聚合237个AI提供商（90+免费），通过智能路由和自动故障转移，让你永不停机。支持Docker部署，内置Token压缩，最高可节省95%用量。"
---

## 引言

最近注册了不少免费的Token服务，但基本都有使用量限制，一超就要切换，非常影响使用体验，所以想自己写个API代理，统一调用model-id，只要出现429或其他错误，就自动切换下一个服务商。正当我思考功能时，发现了这个更强大的**OmniRoute**，内置了很多免费层的服务商，专门针对我们这种白嫖党有组合规则，真是太贴心了！既然有这么强大的系统，就不用自己手搓了，开箱即用！

**什么是OmniRoute？**

简单来说，它是一个**AI API网关**，帮你把多个AI服务提供商（比如OpenAI、Claude、Gemini、以及各种免费平台）统一成一个接口。当某个服务商的额度用完或出现错误时，它会自动切换到下一个可用的服务商，完全无感知。

**核心特性：**
- 🌐 **237个AI提供商**，其中90+有免费额度
- 🔄 **17种路由策略**，支持优先级、权重、成本优化等
- 🗜️ **Token压缩**，最高节省95%用量
- 🛡️ **自动故障转移**，遇到429或错误自动切换
- 🐳 **Docker部署**，一键启动，支持NAS

![OmniRoute Dashboard总览](/images/omniroute/01-dashboard-overview.png)

---

## 1. 安装：Docker一键部署

OmniRoute支持多种安装方式（npm全局安装、Docker、Electron桌面应用、Termux手机端），但我最喜欢**Docker**，干净利落，直接部署在我的NAS上。

### 快速启动

打开终端，运行以下命令：

```bash
docker run -d \
  --name omniroute \
  --restart unless-stopped \
  --stop-timeout 40 \
  -p 20128:20128 \
  -v omniroute-data:/app/data \
  diegosouzapw/omniroute:latest
```

**参数说明：**
- `-d`：后台运行
- `--restart unless-stopped`：自动重启（除非手动停止）
- `-p 20128:20128`：映射端口，访问地址是 `http://你的NAS-IP:20128`
- `-v omniroute-data:/app/data`：持久化数据，重启不丢失配置

### 验证安装

等待镜像下载完成后，打开浏览器访问：

```
http://你的NAS-IP:20128
```

你应该能看到OmniRoute的Dashboard界面。首次访问时，系统会提示你创建一个API Key（用于后续客户端连接）。

![OmniRoute Dashboard首页](/images/omniroute/02-dashboard-home.png)

### Docker Compose（推荐生产环境）

如果你想更灵活地配置，可以使用Docker Compose：

```yaml
version: '3.8'
services:
  omniroute:
    image: diegosouzapw/omniroute:latest
    container_name: omniroute
    restart: unless-stopped
    ports:
      - "20128:20128"
    volumes:
      - omniroute-data:/app/data
    environment:
      - PORT=20128
      - OMNIROUTE_MEMORY_MB=1024  # 增加内存限制（可选）

  redis:
    image: redis:7-alpine
    container_name: omniroute-redis
    restart: unless-stopped
    volumes:
      - omniroute-redis-data:/data

volumes:
  omniroute-data:
  omniroute-redis-data:
```

保存为 `docker-compose.yml`，然后运行：

```bash
docker compose up -d
```

---

## 2. 配置：添加提供商和创建组合规则

安装完成后，接下来就是配置服务商和路由规则。OmniRoute的配置非常直观，通过Web界面即可完成。

### 2.1 添加AI提供商

进入Dashboard → **Providers** 页面，点击"Add Provider"。

**推荐先添加这些免费提供商：**

| 提供商 | 前缀 | 免费模型 | 额度 |
|--------|------|----------|------|
| **SiliconFlow** | `sf/` | Qwen3、DeepSeek等 | 无限制（速率限制） |
| **OpenRouter** | `or/` | 多种免费模型 | 需注册，有免费额度 |
| **StepFun** | `step/` | Step-2系列 | 邀请注册送额度 |
| **ZenMux** | `zm/` | Claude等顶级模型 | 预存$5免费用 |
| **Xiaomi Mimo** | `mi/` | Mimo系列 | 免费额度 |

**添加步骤：**

1. 选择提供商类型（如SiliconFlow）
2. 填入API Key（从对应平台获取）
3. 点击"Connect"测试连接
4. 连接成功后，该提供商就会出现在已连接列表中

![添加提供商界面](/images/omniroute/03-providers-connected.png)

### 2.2 创建组合规则（Combo）

**Combo是OmniRoute的核心功能**——它定义了请求的路由顺序和故障转移策略。

进入 **Combos** 页面，点击"Create Combo"。

**示例：创建一个"永不停机"组合**

```
名称: always-on
策略: priority（优先级）

步骤：
1. sf/qwen3-235b      (硅基流动 - 优先使用)
2. or/gpt-4o-mini     (OpenRouter - 备用1)
3. step/step-2-mini   (StepFun - 备用2)
4. pol/gpt-4          (Pollinations - 兜底，无需Key)
```

**工作原理：**
- 请求首先发给硅基流动的Qwen3
- 如果遇到429（额度用完）或其他错误，自动切换到OpenRouter
- OpenRouter也不行，切换到StepFun
- 最后兜底用Pollinations（完全免费，无需注册）

**更多路由策略：**

OmniRoute支持17种路由策略，常用的有：

| 策略 | 说明 | 适用场景 |
|------|------|----------|
| `priority` | 按顺序依次尝试 | 有明确优先级 |
| `weighted` | 按权重随机分配 | 负载均衡 |
| `cost-optimized` | 优先选择最便宜的 | 节省成本 |
| `headroom` | 优先选择剩余额度最多的 | 避免额度耗尽 |
| `auto` | 智能评分，自动选择最优 | 懒人模式 |

**懒人推荐：直接使用`auto`模式**

在客户端配置时，模型ID填写 `auto`，OmniRoute会根据9个因素（健康度、额度、成本、延迟、成功率等）自动选择最佳提供商，无需手动创建Combo。

![Combo配置界面](/images/omniroute/04-combo-config.png)

### 2.3 配置API端点

配置完成后，进入 **Endpoints** 页面，获取连接信息：

```
Base URL: http://你的NAS-IP:20128/v1
API Key:  复制你的API Key
Model:    auto  (或具体的combo名称/模型ID)
```

这些信息将用于配置你的AI客户端（如Claude Code、Cursor、Cline等）。

---

## 3. 实测：在WorkBuddy中配置OmniRoute

接下来，我在自己的AI编码助手**WorkBuddy**中配置OmniRoute端点，测试一个复杂任务，看看实际效果如何。

### 配置步骤

1. 打开WorkBuddy设置
2. 找到"API配置"或"自定义端点"选项
3. 填入以下信息：
   - **Base URL**: `http://192.168.1.100:20128/v1`（替换为你的NAS IP）
   - **API Key**: 从OmniRoute Dashboard复制
   - **Model**: `auto`
4. 保存并测试连接

![WorkBuddy配置OmniRoute端点](/images/omniroute/05-workbuddy-config.png)

### 执行复杂任务

我让WorkBuddy执行一个多步骤任务：**分析一个GitHub仓库的代码结构，并生成技术文档**。

这个任务需要：
- 读取多个文件
- 理解代码逻辑
- 生成结构化文档
- 多次往返对话

**测试结果：**

✅ **全程无错误**：任务顺利完成，没有出现429或其他中断
✅ **响应流畅**：延迟在可接受范围内（2-5秒）
✅ **自动切换无感知**：从日志看，中间确实发生了提供商切换，但我完全没感觉到

**关键观察：**
- 任务开始时使用的是硅基流动的Qwen3
- 中途因为并发限制，自动切换到了OpenRouter
- 最后几轮对话又切回了硅基流动（额度恢复）

整个过程对我来说是透明的，我只需要专注于任务本身，不用担心"额度用完"或"服务不可用"的问题。

![WorkBuddy执行任务过程](/images/omniroute/06-workbuddy-task.png)

---

## 4. 监测：查看OmniRoute后台

任务完成后，我回到OmniRoute Dashboard，查看详细的运行数据。

### 4.1 使用统计

进入 **Analytics** 页面，可以看到：

- **总请求数**：本次任务共发送了23次API请求
- **提供商分布**：
  - 硅基流动：15次（65%）
  - OpenRouter：6次（26%）
  - Pollinations：2次（9%）
- **Token消耗**：总计约45,000 tokens
- **节省金额**：按商业API价格计算，节省了约$2.5

![Analytics统计页面](/images/omniroute/07-analytics.png)

### 4.2 健康状态

进入 **Health** 页面，查看各提供商的状态：

- **硅基流动**：✅ 正常，延迟120ms
- **OpenRouter**：✅ 正常，延迟200ms
- **StepFun**：⚠️ 当前额度已用完，处于冷却状态
- **Pollinations**：✅ 正常，延迟350ms

OmniRoute会自动标记不健康的提供商，并在恢复前跳过它们。

### 4.3 使用日志

进入 **Usage Logs** 页面，可以看到每次请求的详细记录：

```
时间: 2026-07-03 14:32:15
模型: auto
实际路由: sf/qwen3-235b → or/gpt-4o-mini
原因: sf/qwen3-235b returned 429 (rate limit exceeded)
Tokens: 2,345 input + 890 output
耗时: 3.2s
```

这些日志让你清楚了解每次请求的路由路径和切换原因，便于优化Combo配置。

![Usage Logs详细日志](/images/omniroute/08-usage-logs.png)

### 4.4 免费额度监控

进入 **Free Tiers** 页面（路径：`/dashboard/free-tiers`），可以看到：

- **本月已用免费Token**：约120万
- **剩余免费Token**：约1.48亿（是的，OmniRoute聚合了约1.6B免费Token/月）
- **各提供商额度详情**：每个免费层的已用/剩余比例

这个功能非常实用，让你清楚知道自己还有多少"弹药"，避免突然断供。

---

## 5. 总结与推荐

### 使用体验

经过一周的使用，OmniRoute给我留下了深刻印象：

**优点：**
- ✅ **真正实现了"永不停机"**：多提供商组合 + 自动故障转移，再也没有遇到"额度用完"的尴尬
- ✅ **配置简单**：Docker一键部署，Web界面配置，无需复杂编程
- ✅ **节省成本**：充分利用免费额度，配合Token压缩，大幅降低使用成本
- ✅ **透明可控**：详细的日志和统计，清楚了解每次请求的路由和成本
- ✅ **支持广泛**：兼容237个提供商，几乎所有主流AI平台都支持

**注意事项：**
- ⚠️ 部分免费提供商有速率限制，高峰期可能需要等待
- ⚠️ 某些提供商的ToS（服务条款）对代理使用有限制，建议先了解
- ⚠️ Token压缩虽然节省用量，但极端压缩可能影响复杂任务的质量（建议用Standard模式）

### 推荐的免费模型提供商

以下是我实测过、推荐搭配的免费提供商：

#### 1. 硅基流动（SiliconFlow）
- **官网**：https://cloud.siliconflow.cn/i/yOJ6XkrE
- **优势**：国内访问快，支持Qwen3、DeepSeek等热门模型，无Token上限（速率限制）
- **适合**：作为主力提供商

#### 2. OpenRouter
- **官网**：https://openrouter.ai
- **优势**：聚合多家模型，有免费额度，支持GPT-4o-mini等
- **适合**：作为备用提供商
- **技巧**：充值$10可解锁更高额度（+24M tokens/月）

#### 3. StepFun（阶跃星辰）
- **官网**：https://platform.stepfun.com?invite_code=WAREPYTW
- **优势**：注册送额度，Step-2系列模型质量不错
- **适合**：作为备用提供商

#### 4. ZenMux
- **官网**：https://zenmux.ai/invite/SI298H
- **优势**：**预存$5就可以免费使用Claude等顶级模型**，支持支付宝
- **适合**：想低成本用顶级模型的用户
- **亮点**：性价比极高，$5可以用很久

#### 5. 小米Mimo
- **官网**：https://platform.xiaomimimo.com?ref=VGUL44
- **优势**：小米出品，有免费额度，模型质量稳定
- **适合**：作为国内备用提供商

#### 6. 墨者中转站
- **官网**：https://openai.mozhevip.top/register?aff=ZLYV3E4XJX2K
- **优势**：注册送赠金，可作为兜底方案
- **适合**：确保可用性的最后一道防线

### 推荐的Combo配置

**$0永久免费组合：**

```
1. sf/qwen3-235b          (硅基流动 - 主力)
2. or/gpt-4o-mini         (OpenRouter - 备用1)
3. step/step-2-mini       (StepFun - 备用2)
4. mi/mimo-large          (小米Mimo - 备用3)
5. pol/gpt-4              (Pollinations - 兜底)
压缩模式: Standard (~30%节省)
```

**低成本高质量组合：**

```
1. zm/claude-sonnet-4.5   (ZenMux - 预存$5用Claude)
2. sf/qwen3-235b          (硅基流动 - 免费备用)
3. or/gpt-4o              (OpenRouter - 免费备用)
压缩模式: Aggressive (~50%节省)
```

### 最后

OmniRoute是我近期发现的最实用的AI工具之一。它完美解决了"免费额度不够用、切换麻烦"的痛点，让白嫖党也能享受稳定、流畅的AI服务。

如果你也经常使用多个AI提供商，或者担心额度突然用完，强烈建议试试OmniRoute。Docker部署5分钟搞定，配置也简单，关键是——**完全免费开源**！

**项目地址**：https://github.com/diegosouzapw/OmniRoute

**官方文档**：https://omniroute.online

---

**P.S.** 如果你有其他好用的免费AI提供商，欢迎在评论区分享，让我们一起把"白嫖"进行到底！😄
