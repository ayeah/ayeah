---
title: "三步实现WorkBuddy云端签到，再也不用挂机了！"
date: 2026-10-29
description: "不装客户端、不用开机，三步设好云端定时任务，每天自动签到攒积分。附实测提示词。"
author: "虾小弟"
slug: "workbuddy-cloud-checkin"
cover: "/images/covers/workbuddy-cloud-checkin.jpg"

tags:
  - "WorkBuddy"
  - "教程"
  - "自动化"
categories:
  - "agent"
---
> 上一篇讲沙箱，这篇只讲一件事：怎么让 WorkBuddy 在你关机之后，仍然每天早上 8 点自己签到。
>
> 三步，不用懂沙箱。

上一篇《[WorkBuddy高级玩法：沙箱（附提示词）](/posts/workbuddy-sandbox/)》里提过云端签到的提示词，不少朋友反馈：沙箱那套太绕，看着就劝退。所以这次换个最省事的路子——不用懂沙箱，三步设好定时任务，之后不开机也能每天自动签到拿积分。

（还没装客户端的，先去 workbuddy.cn 下一个。）

![把登录态交给云端，关机也能签到](/images/illustrations/workbuddy-cloud-checkin/01-handover.png)

## 第一步：把登录态文件导出到资料库

打开自己的 WorkBuddy 客户端，先在「专家·技能·连接器」里装好「WorkBuddy 积分助手」技能，再新建任务，输入这段提示词：

```bash
/totorosir-workbuddy-score 帮我导出包含我 refresh_token 的 checkin-rt.json 文件，放在我的资料库中。
```

![在客户端里装好技能，把这句提示词发出去](/images/illustrations/workbuddy-cloud-checkin/02-export-prompt.png)

## 第二步：确认资料库里已经有这个文件

打开左侧「资料库」，在「最近」里能看到 checkin-rt.json 就说明成功了。没看到的话，回到上一步把提示词重发一次。

![资料库里出现 checkin-rt.json，第一步就成了](/images/illustrations/workbuddy-cloud-checkin/03-library.png)

## 第三步：用浏览器打开网页版 WorkBuddy

访问 workbuddy.cn，点页面中间的「在线使用 WorkBuddy」，不用下载客户端。

![点「在线使用 WorkBuddy」，不用下载客户端](/images/illustrations/workbuddy-cloud-checkin/04-web-entry.png)

然后输入这段提示词：

```bash
帮我设定一个定时任务：每天早上 8:00 执行积分任务。先写一个脚本，从资料库中读取 checkin-rt.json（里面是长期可用的 refresh_token），再通过 /totorosir-workbuddy-score 用这个 refresh_token 完成签到，最后把更新后的 checkin-rt.json 写回资料库。注意每次任务启动都是全新的沙箱环境，所以脚本要直接写在定时任务的提示词里。
```

![网页版里发出这句，定时任务就建好了](/images/illustrations/workbuddy-cloud-checkin/05-web-prompt.png)

## 验收：确认任务真的建好了

回到客户端打开「定时任务」，会看到真的多了一条带 ☁️ 图标的任务，点开能看到完整的提示词。

![带 ☁️ 图标的那条，就是云端定时任务](/images/illustrations/workbuddy-cloud-checkin/06-task-card.png)

之后你还可以按自己的需求扩展功能，比如加企业微信、飞书提醒，或者把签到日志写回资料库——直接在网页上跟 AI 说一声让它改就行（别手动编辑提示词）。

## 之后就全自动了

不管有没有开机、有没有登录，签到和「派猫猫旅行」都会照常执行，效果可以在「积分记录」里看。

这样做还能顺带在成长中心保持活跃，连续签到另有抽奖。一个月下来，累计能攒到 3000 多积分。

如果这篇对你有用，欢迎转发给需要的朋友，评论区聊聊你在云端签到踩过的坑～
