#!/usr/bin/env python3
"""
微信公众号封面图生成器
根据文章标题和描述，调用 AI 图片生成 API 生成封面图 PNG。
输出到 /opt/data/ayeah-hugo/output/<slug>_cover.png
"""

import os
import re
import sys
import json
import urllib.request
import urllib.parse
import base64
from pathlib import Path

HUGO_DIR = "/opt/data/ayeah-hugo"
CONTENT_DIR = os.path.join(HUGO_DIR, "content", "posts")
OUTPUT_DIR = os.path.join(HUGO_DIR, "output")


def get_article_meta(slug):
    """从 Hugo Markdown 文件提取 front matter 元数据"""
    md_path = os.path.join(CONTENT_DIR, f"{slug}.md")
    if not os.path.exists(md_path):
        print(f"❌ 文章不存在: {md_path}")
        sys.exit(1)

    with open(md_path, 'r', encoding='utf-8') as f:
        content = f.read()

    meta = {}
    fm_match = re.match(r'^---\s*\n(.*?)\n---\s*\n', content, re.DOTALL)
    if fm_match:
        fm_str = fm_match.group(1)
        # Simple key: value pairs (skip list keys like tags:, categories:)
        for line in fm_str.split('\n'):
            stripped = line.strip()
            # Skip list items
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

    return meta


def generate_cover_prompt(title, description, categories=None, tags=None):
    """根据文章信息生成封面图的 prompt"""
    # 微信公众号封面推荐尺寸 2.35:1 (1024x436) 或 1:1 (200x200)
    # 这里用 2.35:1 的宽幅封面
    
    topic_keywords = ""
    if tags:
        topic_keywords = ", ".join(tags[:5])
    if categories:
        topic_keywords += ", " + ", ".join(categories[:3])
    
    prompt = (
        f"A professional editorial cover illustration for a WeChat article. "
        f"Theme: {title}. "
        f"Key concepts: {description if description else title}. "
        f"Related topics: {topic_keywords}. "
        f"Style: modern, clean, minimalist digital art with subtle gradient backgrounds. "
        f"Use abstract geometric shapes, soft lighting, and professional color palette "
        f"(dark navy, teal accents, warm highlights). "
        f"No text or characters in the image. "
        f"Aspect ratio 2.35:1 (1024x436), wide landscape format suitable for WeChat article cover."
    )
    
    return prompt


def generate_cover_via_api(prompt, output_path, width=1024, height=436):
    """
    调用 AI 图片生成 API 生成封面图。
    支持多种 API，根据环境变量 WECHAT_IMAGE_API 选择。
    默认使用硅基流动 (SiliconFlow) API，因为国内访问友好。
    """
    # 检查环境变量中的 API 配置
    api_type = os.environ.get('WECHAT_IMAGE_API', 'siliconflow')
    api_key = os.environ.get('WECHAT_IMAGE_API_KEY', '')
    
    if not api_key:
        print("⚠️  未设置 WECHAT_IMAGE_API_KEY 环境变量")
        print("   请设置后重试，或使用 --generate-prompt 仅输出 prompt")
        return None
    
    if api_type == 'siliconflow':
        return generate_via_siliconflow(prompt, output_path, api_key, width, height)
    elif api_type == 'openai':
        return generate_via_openai(prompt, output_path, api_key, width, height)
    else:
        print(f"❌ 不支持的 API 类型: {api_type}")
        return None


def generate_via_siliconflow(prompt, output_path, api_key, width, height):
    """使用硅基流动 API 生成图片"""
    url = "https://api.siliconflow.cn/v1/images/generations"
    
    payload = json.dumps({
        "model": "black-forest-labs/FLUX.1-schnell",
        "prompt": prompt,
        "image_size": f"{width}x{height}",
        "num_inference_steps": 20,
    }).encode('utf-8')
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    
    req = urllib.request.Request(url, data=payload, headers=headers, method="POST")
    
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            result = json.loads(resp.read().decode('utf-8'))
        
        image_url = result.get('images', [{}])[0].get('url', '')
        if not image_url:
            print(f"❌ API 返回无图片 URL: {result}")
            return None
        
        # 下载图片
        with urllib.request.urlopen(image_url, timeout=30) as img_resp:
            img_data = img_resp.read()
        
        with open(output_path, 'wb') as f:
            f.write(img_data)
        
        print(f"✅ 封面图已保存: {output_path} ({len(img_data)} bytes)")
        return output_path
        
    except Exception as e:
        print(f"❌ 硅基流动 API 调用失败: {e}")
        return None


def generate_via_openai(prompt, output_path, api_key, width, height):
    """使用 OpenAI DALL-E API 生成图片"""
    url = "https://api.openai.com/v1/images/generations"
    
    payload = json.dumps({
        "model": "dall-e-3",
        "prompt": prompt,
        "n": 1,
        "size": "1792x1024",  # 最接近 2.35:1 的 DALL-E 3 尺寸
        "quality": "standard",
    }).encode('utf-8')
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    
    req = urllib.request.Request(url, data=payload, headers=headers, method="POST")
    
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            result = json.loads(resp.read().decode('utf-8'))
        
        # DALL-E 3 返回 b64_json 或 url
        image_data = result.get('data', [{}])[0]
        
        if 'b64_json' in image_data:
            img_bytes = base64.b64decode(image_data['b64_json'])
            with open(output_path, 'wb') as f:
                f.write(img_bytes)
        elif 'url' in image_data:
            with urllib.request.urlopen(image_data['url'], timeout=30) as img_resp:
                img_bytes = img_resp.read()
            with open(output_path, 'wb') as f:
                f.write(img_bytes)
        else:
            print(f"❌ API 返回无图片: {result}")
            return None
        
        print(f"✅ 封面图已保存: {output_path} ({len(img_bytes)} bytes)")
        return output_path
        
    except Exception as e:
        print(f"❌ OpenAI API 调用失败: {e}")
        return None


if __name__ == '__main__':
    import argparse
    
    parser = argparse.ArgumentParser(description='生成微信公众号封面图')
    parser.add_argument('slug', help='文章 slug')
    parser.add_argument('--generate-prompt', action='store_true',
                        help='仅输出 prompt，不调用 API')
    parser.add_argument('--output', help='输出文件路径（默认自动）')
    
    args = parser.parse_args()
    
    meta = get_article_meta(args.slug)
    title = meta.get('title', args.slug)
    description = meta.get('description', '')
    tags = meta.get('tags', [])
    categories = meta.get('categories', [])
    
    prompt = generate_cover_prompt(title, description, categories, tags)
    
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    output_path = args.output or os.path.join(OUTPUT_DIR, f"{args.slug}_cover.png")
    
    if args.generate_prompt:
        print(f"📝 文章: {title}")
        print(f"   描述: {description}")
        print(f"   标签: {tags}")
        print(f"   分类: {categories}")
        print(f"\n🎨 Prompt:\n{prompt}")
        print(f"\n💡 输出路径: {output_path}")
    else:
        result = generate_cover_via_api(prompt, output_path)
        if result:
            print(f"🎉 封面图生成完成!")
        else:
            print("💡 提示: 可用 --generate-prompt 输出 prompt，手动在其他平台生成图片")