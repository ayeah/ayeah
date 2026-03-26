// Next.js API 路由支持
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CONTENT_DIR = process.env.XIAMASTER_CONTENT_DIR || 
  path.join(process.env.HOME || '', '.openclaw/workspace/skills/claw-master/content');

const DRAFTS_DIR = process.env.XIAMASTER_DRAFTS_DIR || 
  path.join(process.env.HOME || '', '.openclaw/workspace/skills/claw-master/drafts');

// GET - 获取文章列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'all'; // all, published, drafts
    const category = searchParams.get('category');
    
    let articles: any[] = [];
    
    // 读取已发布文章
    if (type === 'all' || type === 'published') {
      const publishedDir = path.join(CONTENT_DIR, 'articles');
      if (fs.existsSync(publishedDir)) {
        const files = fs.readdirSync(publishedDir).filter(f => f.endsWith('.md'));
        articles.push(...files.map(file => {
          const filePath = path.join(publishedDir, file);
          const content = fs.readFileSync(filePath, 'utf-8');
          const frontmatter = parseFrontmatter(content);
          return {
            id: file.replace('.md', ''),
            file,
            ...frontmatter,
            type: 'published',
            path: filePath
          };
        }));
      }
    }
    
    // 读取草稿
    if (type === 'all' || type === 'drafts') {
      if (fs.existsSync(DRAFTS_DIR)) {
        const files = fs.readdirSync(DRAFTS_DIR).filter(f => f.endsWith('.md'));
        articles.push(...files.map(file => {
          const filePath = path.join(DRAFTS_DIR, file);
          const content = fs.readFileSync(filePath, 'utf-8');
          const frontmatter = parseFrontmatter(content);
          return {
            id: file.replace('.md', ''),
            file,
            ...frontmatter,
            type: 'draft',
            path: filePath
          };
        }));
      }
    }
    
    // 按分类过滤
    if (category) {
      articles = articles.filter(a => a.category === category);
    }
    
    // 按日期排序
    articles.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    });
    
    return NextResponse.json({ success: true, data: articles });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

// POST - 创建/更新文章
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, category, tags, type = 'draft' } = body;
    
    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Title and content are required' },
        { status: 400 }
      );
    }
    
    const slug = generateSlug(title);
    const fileName = `${slug}.md`;
    const targetDir = type === 'draft' ? DRAFTS_DIR : path.join(CONTENT_DIR, 'articles');
    const filePath = path.join(targetDir, fileName);
    
    // 确保目录存在
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    // 构建 Frontmatter
    const frontmatter = `---
title: "${title}"
date: ${new Date().toISOString().split('T')[0]}
author: "Admin"
category: "${category || 'uncategorized'}"
tags: [${tags?.map((t: string) => `"${t}"`).join(', ') || ''}]
---

`;
    
    // 写入文件
    fs.writeFileSync(filePath, frontmatter + content);
    
    return NextResponse.json({
      success: true,
      data: {
        id: slug,
        file: fileName,
        path: filePath,
        type
      }
    });
  } catch (error) {
    console.error('Error saving article:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save article' },
      { status: 500 }
    );
  }
}

// DELETE - 删除文章
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Article ID is required' },
        { status: 400 }
      );
    }
    
    // 尝试在草稿和已发布中查找
    let filePath = path.join(DRAFTS_DIR, `${id}.md`);
    if (!fs.existsSync(filePath)) {
      filePath = path.join(CONTENT_DIR, 'articles', `${id}.md`);
    }
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return NextResponse.json({ success: true, message: 'Article deleted' });
    }
    
    return NextResponse.json(
      { success: false, error: 'Article not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete article' },
      { status: 500 }
    );
  }
}

// 解析 Frontmatter
function parseFrontmatter(content: string) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  
  const frontmatter = match[1];
  const result: any = {};
  
  // 简单解析 key: value
  frontmatter.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length) {
      let value = valueParts.join(':').trim();
      // 移除引号
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      // 解析数组
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map((v: string) => v.trim().replace(/"/g, ''));
      }
      result[key.trim()] = value;
    }
  });
  
  return result;
}

// 生成 Slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}
