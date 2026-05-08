#!/usr/bin/env python3
"""
微信公众号草稿保存脚本
将文章标题、HTML内容、封面图 media_id 组合为草稿，保存到公众号后台。
"""

import os
import sys
import json
import re
import urllib.request

HUGO_DIR = "/opt/data/ayeah-hugo"
ENV_FILE = os.path.join(HUGO_DIR, ".env.wechat")
OUTPUT_DIR = os.path.join(HUGO_DIR, "output")


def load_env():
    """从 .env.wechat 加载 AppID 和 AppSecret"""
    env = {}
    with open(ENV_FILE, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            if '=' in line:
                key, value = line.split('=', 1)
                env[key.strip()] = value.strip()
    return env


def get_access_token(appid, appsecret):
    """获取微信公众号 access_token"""
    url = f"https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid={appid}&secret={appsecret}"
    
    try:
        with urllib.request.urlopen(url, timeout=10) as resp:
            result = json.loads(resp.read().decode('utf-8'))
    except Exception as e:
        print(f"❌ 获取 access_token 网络错误: {e}")
        sys.exit(1)
    
    if 'access_token' in result:
        return result['access_token']
    else:
        errcode = result.get('errcode', 'unknown')
        errmsg = result.get('errmsg', 'unknown')
        print(f"❌ 获取 access_token 失败: errcode={errcode}, errmsg={errmsg}")
        sys.exit(1)


def parse_frontmatter(md_text):
    """解析 YAML front matter"""
    fm_match = re.match(r'^---\s*\n(.*?)\n---\s*\n', md_text, re.DOTALL)
    if not fm_match:
        return {}, md_text
    
    fm_str = fm_match.group(1)
    body = md_text[fm_match.end():]
    
    meta = {}
    for line in fm_str.split('\n'):
        stripped = line.strip()
        if stripped.startswith('- '):
            continue
        kv = re.match(r'^(\w+):\s*"(.*)"$', stripped)
        if kv:
            meta[kv.group(1)] = kv.group(2)
            continue
        kv2 = re.match(r'^(\w+):\s*(.+)', stripped)
        if kv2 and kv2.group(2).strip() not in ('',):
            val = kv2.group(2).strip()
            if val.startswith('"') and val.endswith('"'):
                val = val[1:-1]
            meta[kv2.group(1)] = val
    
    # tags list
    tags_match = re.search(r'tags:\s*\n((?:\s+-\s*"[^"]*"\s*\n)+)', fm_str)
    if tags_match:
        meta['tags'] = re.findall(r'-\s*"([^"]*)"', tags_match.group(1))
    
    # categories list
    cats_match = re.search(r'categories:\s*\n((?:\s+-\s*"[^"]*"\s*\n)+)', fm_str)
    if cats_match:
        meta['categories'] = re.findall(r'-\s*"([^"]*)"', cats_match.group(1))
    
    return meta, body


def save_draft(access_token, title, content, thumb_media_id, author="", digest="", content_source_url=""):
    """
    保存草稿到微信公众号
    API: POST https://api.weixin.qq.com/cgi-bin/draft/add
    
    参数说明:
    - title: 文章标题（≤64个字符）
    - content: 文章 HTML 内容（300字~5万字）
    - thumb_media_id: 封面图 media_id（需是永久素材的 thumb 类型）
    - author: 作者（≤8个字符）
    - digest: 摘要（≤120个字符，空则微信自动截取前64字）
    - content_source_url: 原文链接（可选）
    """
    # 长度限制校验
    if len(title) > 64:
        print(f"⚠️  标题超过64字符限制（当前{len(title)}字符），自动截断")
        title = title[:64]
    if len(author) > 8:
        print(f"⚠️  作者超过8字符限制（当前{len(author)}字符），自动截断")
        author = author[:8]
    if digest and len(digest) > 120:
        print(f"⚠️  摘要超过120字符限制（当前{len(digest)}字符），自动截断")
        digest = digest[:120]
    
    url = f"https://api.weixin.qq.com/cgi-bin/draft/add?access_token={access_token}"
    
    article = {
        "title": title,
        "author": author,
        "digest": digest,
        "content": content,
        "thumb_media_id": thumb_media_id,
        "content_source_url": content_source_url,
        "need_open_comment": 0,  # 不开启评论
        "only_fans_can_comment": 0,  # 所有人可评论
    }
    
    payload = json.dumps({"articles": [article]}, ensure_ascii=False).encode('utf-8')
    
    headers = {
        "Content-Type": "application/json",
    }
    
    req = urllib.request.Request(url, data=payload, headers=headers, method="POST")
    
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            result = json.loads(resp.read().decode('utf-8'))
    except Exception as e:
        print(f"❌ 保存草稿网络错误: {e}")
        sys.exit(1)
    
    if 'media_id' in result:
        draft_media_id = result['media_id']
        print(f"✅ 草稿保存成功!")
        print(f"   草稿 media_id: {draft_media_id}")
        return draft_media_id
    else:
        errcode = result.get('errcode', 'unknown')
        errmsg = result.get('errmsg', 'unknown')
        print(f"❌ 保存草稿失败: errcode={errcode}, errmsg={errmsg}")
        
        # 常见错误提示
        if errcode == 40007:
            print("💡 thumb_media_id 无效——确保上传的是 thumb 类型永久素材")
        elif errcode == 40009:
            print("💡 封面图尺寸不符合要求——建议 900x383 或更小")
        elif errcode == 41001:
            print("💡 access_token 缺失或过期")
        elif errcode == 45064:
            print("💡 草稿数量超过限制（最多100篇）")
        
        sys.exit(1)


if __name__ == '__main__':
    import argparse
    
    parser = argparse.ArgumentParser(description='保存草稿到微信公众号')
    parser.add_argument('--slug', help='文章 slug（自动查找转换后的 HTML 和封面图信息）')
    parser.add_argument('--title', help='文章标题（手动指定）')
    parser.add_argument('--html-file', help='微信 HTML 文件路径')
    parser.add_argument('--thumb-media-id', help='封面图 thumb_media_id')
    parser.add_argument('--author', default='', help='作者')
    parser.add_argument('--digest', default='', help='摘要')
    parser.add_argument('--source-url', default='', help='原文链接')
    
    args = parser.parse_args()
    
    # 确定 HTML 内容
    html_content = ""
    title = args.title or ""
    author = args.author
    digest = args.digest
    source_url = args.source_url
    
    if args.slug:
        # 自动模式：根据 slug 查找转换后的 HTML
        html_path = os.path.join(OUTPUT_DIR, f"{args.slug}_wechat.html")
        cover_info_path = os.path.join(OUTPUT_DIR, f"{args.slug}_cover_info.json")
        
        if not os.path.exists(html_path):
            print(f"❌ HTML 文件不存在: {html_path}")
            print(f"   请先运行 hugo_to_wechat.py 转换文章")
            sys.exit(1)
        
        with open(html_path, 'r', encoding='utf-8') as f:
            html_content = f.read()
        
        # 从 Markdown front matter 获取标题等信息
        md_path = os.path.join(HUGO_DIR, "content", "posts", f"{args.slug}.md")
        if os.path.exists(md_path):
            with open(md_path, 'r', encoding='utf-8') as f:
                md_text = f.read()
            meta, _ = parse_frontmatter(md_text)
            if not title:
                title = meta.get('title', args.slug)
            if not author:
                author = meta.get('author', '')
            if not digest:
                digest = meta.get('description', '')
            if not source_url:
                source_url = f"https://ayeah.net/posts/{args.slug}/"
        
        # 获取 thumb_media_id
        thumb_media_id = args.thumb_media_id
        if not thumb_media_id and os.path.exists(cover_info_path):
            with open(cover_info_path, 'r', encoding='utf-8') as f:
                cover_info = json.load(f)
            thumb_media_id = cover_info.get('media_id', '')
        
        if not thumb_media_id:
            print("❌ 缺少 thumb_media_id——请先上传封面图")
            print("   运行: python3 wechat_upload_cover.py <封面图路径> --save <cover_info.json>")
            sys.exit(1)
    
    elif args.html_file:
        with open(args.html_file, 'r', encoding='utf-8') as f:
            html_content = f.read()
        thumb_media_id = args.thumb_media_id
        
        if not thumb_media_id:
            print("❌ 缺少 thumb_media_id——请通过 --thumb-media-id 指定")
            sys.exit(1)
        
        if not title:
            print("❌ 缺少标题——请通过 --title 指定")
            sys.exit(1)
    
    else:
        print("❌ 请指定 --slug 或 --html-file + --title + --thumb-media-id")
        sys.exit(1)
    
    # 加载配置并获取 access_token
    env = load_env()
    appid = env.get('WECHAT_APPID')
    appsecret = env.get('WECHAT_APPSECRET')
    
    print("🔑 获取 access_token...")
    access_token = get_access_token(appid, appsecret)
    
    # 保存草稿
    print(f"📝 保存草稿: {title}")
    draft_media_id = save_draft(
        access_token=access_token,
        title=title,
        content=html_content,
        thumb_media_id=thumb_media_id,
        author=author,
        digest=digest,
        content_source_url=source_url,
    )
    
    # 保存草稿信息
    if args.slug:
        draft_info_path = os.path.join(OUTPUT_DIR, f"{args.slug}_draft_info.json")
        with open(draft_info_path, 'w', encoding='utf-8') as f:
            json.dump({
                "draft_media_id": draft_media_id,
                "title": title,
                "slug": args.slug,
                "thumb_media_id": thumb_media_id,
            }, f, ensure_ascii=False, indent=2)
        print(f"   草稿信息已保存: {draft_info_path}")
    
    print("🎉 草稿保存完成！请在公众号后台查看和编辑")