# 🦐 Claw-Master 虾大师博客管理系统

基于 Next.js 的现代化博客内容管理平台。

## 🚀 快速启动

### 开发模式
```bash
cd /home/node/.openclaw/workspace/skills/claw-master/admin
npm run dev
```

访问：http://localhost:3001

### 生产构建
```bash
npm run build
npm start
```

## 📁 项目结构

```
admin/
├── app/
│   ├── api/
│   │   └── articles/
│   │       └── route.ts          # 文章管理 API
│   ├── articles/
│   │   ├── page.tsx              # 文章列表页
│   │   ├── new/
│   │   │   └── page.tsx          # 新建文章
│   │   └── [id]/
│   │       └── edit/page.tsx     # 编辑文章
│   ├── materials/
│   │   └── page.tsx              # 素材管理
│   ├── settings/
│   │   └── page.tsx              # 系统设置
│   ├── layout.tsx                # 根布局
│   └── page.tsx                  # 仪表盘
├── components/                   # React 组件
├── lib/                          # 工具函数
└── package.json
```

## 🔧 功能特性

### 文章管理
- ✅ 文章列表（全部/已发布/草稿）
- ✅ 新建文章（Markdown 编辑器）
- ✅ 编辑文章
- ✅ 删除文章
- ✅ 分类和标签管理
- ✅ 定时发布（待实现）

### 素材收集
- 🔄 RSS 源订阅
- 🔄 网页内容抓取
- 🔄 API 数据导入

### 系统设置
- 🔄 API 配置
- 🔄 发布选项
- 🔄 用户管理

## 🌐 API 接口

### GET /api/articles
获取文章列表

**参数:**
- `type`: `all` | `published` | `drafts`
- `category`: 分类过滤

**响应:**
```json
{
  "success": true,
  "data": [
    {
      "id": "article-slug",
      "title": "文章标题",
      "date": "2026-03-26",
      "category": "ai-agents",
      "tags": ["AI", "智能体"],
      "type": "published"
    }
  ]
}
```

### POST /api/articles
创建/更新文章

**请求体:**
```json
{
  "title": "文章标题",
  "content": "Markdown 内容",
  "category": "ai-agents",
  "tags": ["AI", "智能体"],
  "type": "draft"
}
```

### DELETE /api/articles?id={id}
删除文章

## 🔐 环境变量

在 `admin/.env.local` 中配置：

```bash
# 虾大师 API
XIAMASTER_API_URL=https://xiamaster.ai/api
XIAMASTER_API_KEY=your-api-key

# 内容存储路径
XIAMASTER_CONTENT_DIR=/home/node/.openclaw/workspace/skills/claw-master/content
XIAMASTER_DRAFTS_DIR=/home/node/.openclaw/workspace/skills/claw-master/drafts
```

## 🎨 技术栈

- **框架**: Next.js 16 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS 4
- **数据获取**: SWR
- **日期处理**: date-fns

## 📝 待开发功能

- [ ] Markdown 编辑器（新建/编辑页面）
- [ ] 素材收集页面
- [ ] 系统设置页面
- [ ] 用户认证
- [ ] 文章预览
- [ ] 批量操作
- [ ] 搜索功能
- [ ] 数据统计图表

## 🤝 贡献

欢迎提交 PR 和建议！
