#!/usr/bin/env python3
"""
Hugo Markdown → 微信公众号 HTML 转换器
读取 Hugo 文章的 Markdown + YAML front matter，转为微信公众号兼容 HTML。
禁止删减或改写原文内容，仅做排版样式适配。
支持：跨行链接、带前缀的表格行、ASCII 架构图 → Mermaid → PNG 图片输出。
"""

import os
import re
import sys
import json
import base64
import zlib
import urllib.request
import urllib.parse
from datetime import datetime
from pathlib import Path

# Hugo 项目路径
HUGO_DIR = "/opt/data/ayeah-hugo"
CONTENT_DIR = os.path.join(HUGO_DIR, "content", "posts")
OUTPUT_DIR = os.path.join(HUGO_DIR, "output")
SITE_URL = "https://ayeah.net"

# ASCII box-drawing 字符集合
BOX_CHARS = set('┌┬┐├┼┤└┴┘│─━█▓░▄▀■▸◀►▲▼◆◇○●⊕⊗∈∉∀∃⊆⊇∩∪∠⊥∞≈≠≤≥×±∑∏√∂∇∫')

# ─── Front matter 解析 ─────────────────────────────────────

def parse_frontmatter(md_text):
    """解析 YAML front matter（纯 regex，无 yaml 模块）"""
    fm_match = re.match(r'^---\s*\n(.*?)\n---\s*\n', md_text, re.DOTALL)
    if not fm_match:
        return {}, md_text

    fm_str = fm_match.group(1)
    body = md_text[fm_match.end():]

    meta = {}
    for line in fm_str.split('\n'):
        line = line.strip()
        kv = re.match(r'^(\w+):\s*\"(.*)\"$', line)
        if kv:
            meta[kv.group(1)] = kv.group(2)
            continue
        kv2 = re.match(r'^(\w+):\s*(.+)', line)
        if kv2 and kv2.group(2).strip() not in ('', '[', '-'):
            val = kv2.group(2).strip()
            if val.startswith('"') and val.endswith('"'):
                val = val[1:-1]
            meta[kv2.group(1)] = val

    tags_match = re.search(r'tags:\s*\n((?:\s+-\s*"[^"]*"\s*\n)+)', fm_str)
    if tags_match:
        meta['tags'] = re.findall(r'-\s*"([^"]*)"', tags_match.group(1))

    cats_match = re.search(r'categories:\s*\n((?:\s+-\s*"[^"]*"\s*\n)+)', fm_str)
    if cats_match:
        meta['categories'] = re.findall(r'-\s*"([^"]*)"', cats_match.group(1))

    return meta, body


# ─── 预处理 ─────────────────────────────────────────────────

def preprocess_markdown(md_body):
    """预处理 Markdown 文本，修复跨行链接和表格行前缀问题"""
    # ① 修复跨行链接：Markdown 链接 [text](url) 可能跨行
    # 情况 A: 换行在 [ 和文本之间 → "[\nGitHub](url)"
    # 情况 B: 换行在文本和 ] 之间 → "[GitHub\n](url)"
    # 情况 C: 捉行在 ] 和 ( 之间 → "[GitHub]\n(url)"
    # 统一处理：把链接内部（[] 之间 和 ]→( 之间）的换行/空白合并
    # Step 1: 将 [\n...] 和 [...\n] 中间内容内的换行去掉
    md_body = re.sub(
        r'\[\s*\n\s*([^\]]*?)\s*\n\s*\]\s*\n?\s*\(([^)]*)\)',
        r'[\1](\2)',
        md_body
    )
    # Step 2: 处理 [text\n](url) — 换行仅在文本内或 ] 之后
    md_body = re.sub(
        r'\[([^\]]*?)\s*\n\s*\]\s*\n?\s*\(([^)]*)\)',
        r'[\1](\2)',
        md_body
    )
    # Step 3: 处理 [text]\n(url) — 换行仅在 ]→( 之间
    md_body = re.sub(
        r'\[([^\]]*?)\]\s*\n\s*\(([^)]*)\)',
        r'[\1](\2)',
        md_body
    )
    # Step 4: 处理 [\ntext](url) — 换行仅在 [ 之后（前面步骤漏掉的情况）
    md_body = re.sub(
        r'\[\s*\n\s*([^\]]*?)\]\(([^)]*)\)',
        r'[\1](\2)',
        md_body
    )

    # ② 修复表格行前缀：去掉行首到第一个 | 之间的非表格内容
    # 如 "在开始技术选型之前，先快速回顾第一章的核心结论：***| 要点 | 关键内容 |"
    # 或 "***| 要点 | 关键内容 |"
    lines = md_body.split('\n')
    processed_lines = []
    table_prefix_buffer = ""

    for line in lines:
        stripped = line.strip()

        # 检测"有前缀文字 + |"的行：行不以 | 开头但包含 |，且前缀部分不含代码块标记
        if '|' in stripped and not stripped.startswith('|') and not stripped.startswith('```'):
            # 找到第一个 | 的位置
            pipe_pos = stripped.index('|')
            prefix = stripped[:pipe_pos].rstrip()
            table_part = stripped[pipe_pos:]

            # 前缀如果是纯分隔符标记 (***, **, * 等) → 直接去掉
            if re.match(r'^[\*\-_]+\s*$', prefix):
                processed_lines.append(table_part)
            else:
                # 前缀是有意义的文字 → 保留文字作为段落，表格部分另起一行
                processed_lines.append(prefix)
                processed_lines.append(table_part)
        else:
            processed_lines.append(line)

    return '\n'.join(processed_lines)


# ─── Mermaid 图形处理 ──────────────────────────────────────

def is_ascii_art(code_text):
    """检测代码块内容是否是 ASCII 架构图/流程图"""
    box_count = sum(1 for ch in code_text if ch in BOX_CHARS)
    # 如果 box-drawing 字符占比超过 5%，认为是 ASCII 图
    total_chars = len(code_text.strip())
    if total_chars == 0:
        return False
    return box_count / total_chars > 0.05


def ascii_to_mermaid(code_text, context_hint=""):
    """将 ASCII 架构图转换为 Mermaid 代码

    支持的模式：
    1. 层级架构图（上下堆叠的框）
    2. 并排对比图（左右并列的框）
    """
    lines = [l for l in code_text.strip().split('\n') if l.strip()]

    # 检测是否为层级架构图（上下堆叠）
    # 模式：多个 ┌─────┐ │ text │ └─────┘ 框
    boxes = parse_ascii_boxes(lines)

    if not boxes:
        # 无法解析，返回 None（保持原样输出为代码块）
        return None

    # 检测是否为并排对比图（左右并列）
    # 模式：两个框在同一行出现，中间有空格分隔
    if len(boxes) >= 2 and has_parallel_layout(lines):
        return generate_parallel_mermaid(boxes)

    # 检测是否为层级图（上下堆叠，有箭头或层级关系）
    if len(boxes) >= 2 and has_hierarchy_layout(lines):
        return generate_hierarchy_mermaid(boxes)

    # 单个框 → 简单节点
    if len(boxes) == 1:
        return f"graph TD\n    A[\"{boxes[0]['title']}\"]"

    # 多个独立框 → 列出节点
    mermaid_code = "graph TD\n"
    for i, box in enumerate(boxes):
        node_id = chr(65 + i) if i < 26 else f"N{i}"
        title = box['title'].replace('"', "'")
        contents = '\\n'.join(
            c.replace('"', "'") for c in box['contents']
        ) if box['contents'] else title
        mermaid_code += f"    {node_id}[\"{contents}\"]\n"
        if i > 0:
            prev_id = chr(65 + i - 1) if i - 1 < 26 else f"N{i-1}"
            mermaid_code += f"    {prev_id} --> {node_id}\n"

    return mermaid_code


def parse_ascii_boxes(lines):
    """解析 ASCII 框图，提取每个框的标题和内容"""
    boxes = []
    current_box = None
    box_start_pattern = re.compile(r'^\s*┌[─━]+┐')
    box_end_pattern = re.compile(r'^\s*└[─━]+┘')
    box_line_pattern = re.compile(r'^\s*│(.*)│\s*$')
    # 也支持用 +-----+ | text | +-----+ 格式
    alt_start = re.compile(r'^\s*\+[\-]+[+]')
    alt_end = re.compile(r'^\s*\+[\-]+[+]')
    alt_line = re.compile(r'^\s*\|(.*)\|\s*$')

    i = 0
    while i < len(lines):
        line = lines[i]
        if box_start_pattern.match(line) or alt_start.match(line):
            current_box = {'start_line': i, 'title': '', 'contents': []}
            i += 1
            while i < len(lines):
                inner = lines[i]
                m = box_line_pattern.match(inner) or alt_line.match(inner)
                if m:
                    content = m.group(1).strip()
                    if content and current_box['title'] == '':
                        current_box['title'] = content
                    elif content:
                        current_box['contents'].append(content)
                elif box_end_pattern.match(inner) or alt_end.match(inner):
                    current_box['end_line'] = i
                    boxes.append(current_box)
                    current_box = None
                    break
                else:
                    # 可能是框内的非标准行
                    stripped = inner.strip()
                    if stripped and not re.match(r'^[├┼┬┼┤─━]+', stripped):
                        if current_box['title'] == '':
                            current_box['title'] = stripped
                        else:
                            current_box['contents'].append(stripped)
                i += 1
        else:
            i += 1

    return boxes


def has_parallel_layout(lines):
    """检测是否有并排布局（同一行出现两个框头 ┌─────┐ ... ┌─────┐）"""
    for line in lines:
        starts = len(re.findall(r'┌[─━]+┐', line))
        if starts >= 2:
            return True
    return False


def has_hierarchy_layout(lines):
    """检测是否有层级布局（框上下堆叠，中间可能有箭头标记）"""
    box_starts = 0
    for line in lines:
        if re.match(r'^\s*┌[─━]+┐', line) or re.match(r'^\s*\+[\-]+[+]', line):
            box_starts += 1
    return box_starts >= 2


def generate_parallel_mermaid(boxes):
    """生成并排对比的 Mermaid 图"""
    if len(boxes) < 2:
        return None

    # 取前两个框作为左右对比
    left = boxes[0]
    right = boxes[1]

    left_title = left['title'].replace('"', "'")
    right_title = right['title'].replace('"', "'")

    mermaid = "graph LR\n"
    # 左侧框
    mermaid += f"    subgraph left[\"{left_title}\"]\n"
    for i, c in enumerate(left['contents'][:4]):
        cid = f"L{i+1}"
        mermaid += f"        {cid}[\"{c.replace('"', "'")}\"]\n"
    if len(left['contents']) > 1:
        for i in range(len(left['contents'][:4]) - 1):
            mermaid += f"        L{i+1} --> L{i+2}\n"
    mermaid += "    end\n"

    # 右侧框
    mermaid += f"    subgraph right[\"{right_title}\"]\n"
    for i, c in enumerate(right['contents'][:4]):
        cid = f"R{i+1}"
        mermaid += f"        {cid}[\"{c.replace('"', "'")}\"]\n"
    if len(right['contents']) > 1:
        for i in range(len(right['contents'][:4]) - 1):
            mermaid += f"        R{i+1} --> R{i+2}\n"
    mermaid += "    end\n"

    return mermaid


def generate_hierarchy_mermaid(boxes):
    """生成层级架构的 Mermaid 图"""
    mermaid = "graph TD\n"
    for i, box in enumerate(boxes):
        node_id = chr(65 + i) if i < 26 else f"N{i}"
        title = box['title'].replace('"', "'")
        # 将标题和内容合成为节点文本
        all_text = [title] + box['contents'][:3]
        node_text = '\\n'.join(t.replace('"', "'") for t in all_text)
        mermaid += f"    {node_id}[\"{node_text}\"]\n"
        if i > 0:
            prev_id = chr(65 + i - 1) if i - 1 < 26 else f"N{i-1}"
            mermaid += f"    {prev_id} --> {node_id}\n"
    return mermaid


def render_mermaid_to_png(mermaid_code, output_path):
    """使用 mermaid.ink API 将 Mermaid 代码渲染为 PNG 图片"""
def render_mermaid_to_png(mermaid_code, output_path):
    """将 Mermaid 代码渲染为 PNG 图片

    使用本地 ffmpeg 将 SVG 转 PNG。
    1. 将 mermaid 代码保存为 .mmd 文件（供参考）
    2. 由脚本调用者预先生成 SVG 文件，ffmpeg 将 SVG → PNG
    3. 如果 SVG 不存在，返回 None（保持原 ASCII 代码块）
    """
    svg_path = output_path.replace('.png', '.svg')
    mmd_path = output_path.replace('.png', '.mmd')

    # 保存 mermaid 代码为 .mmd 文件（供手动渲染参考）
    with open(mmd_path, 'w', encoding='utf-8') as f:
        f.write(mermaid_code)

    # 检查是否已有对应的 SVG 文件
    if os.path.exists(svg_path):
        os.system(f'ffmpeg -y -i "{svg_path}" -frames:v 1 "{output_path}" 2>/dev/null')
        if os.path.exists(output_path):
            return output_path
        print(f"⚠️  ffmpeg SVG→PNG 转换失败")
        return None

    # 无 SVG → 尝试使用 Pollinations.ai 生成架构图风格的图片
    prompt = (
        f"An architecture diagram in dark theme (navy background #0f172a, "
        f"teal accents #2dd4bf) showing: {mermaid_code[:200]}. "
        f"Clean, professional, modern digital art style. No text watermark. "
        f"Wide landscape format."
    )
    encoded_prompt = urllib.parse.quote(prompt)
    url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=1024&height=436&nologo=true"

    try:
        with urllib.request.urlopen(url, timeout=30) as resp:
            img_data = resp.read()

        # Pollinations returns JPEG → ffmpeg 转 PNG
        tmp_jpg = output_path.replace('.png', '_tmp.jpg')
        with open(tmp_jpg, 'wb') as f:
            f.write(img_data)
        os.system(f'ffmpeg -y -i "{tmp_jpg}" -vf "scale=1024:436" "{output_path}" 2>/dev/null')
        os.remove(tmp_jpg)

        if os.path.exists(output_path):
            return output_path

        print(f"⚠️  Pollinations 图片下载/转换失败")
        return None

    except Exception as e:
        print(f"⚠️  架构图渲染失败: {e}")
        return None


# ─── 行内 Markdown 处理 ─────────────────────────────────────

def resolve_url(url):
    """将相对 URL 转为完整网站 URL"""
    if url.startswith('/'):
        return SITE_URL + url
    if url.startswith('http://') or url.startswith('https://'):
        return url
    return url


def process_inline(text):
    """处理行内 Markdown 语法：加粗、斜体、链接、行内代码、删除线"""
    # 行内代码（优先处理，避免内部被其他规则误改）
    text = re.sub(r'`([^`]+)`',
                  r'<code style="background:#f6f8fa;padding:2px 4px;border-radius:3px;'
                  r'font-size:14px;color:#e74c3c">\1</code>', text)
    # 加粗
    text = re.sub(r'\*\*(.+?)\*\*', r'<strong style="color:#1a1a1a">\1</strong>', text)
    text = re.sub(r'__(.+?)__', r'<strong style="color:#1a1a1a">\1</strong>', text)
    # 斜体
    text = re.sub(r'\*(.+?)\*', r'<em>\1</em>', text)
    text = re.sub(r'_(.+?)_', r'<em>\1</em>', text)
    # 删除线
    text = re.sub(r'~~(.+?)~~', r'<del style="color:#999">\1</del>', text)
    # 链接：转为 HTML 超链接，相对 URL 解析为完整网站 URL
    text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)',
                  lambda m: f'<a href="{resolve_url(m.group(2))}" '
                            f'style="color:#576b95;text-decoration:none">{m.group(1)}</a>',
                  text)
    return text


# ─── 表格渲染 ──────────────────────────────────────────────

def render_table(rows):
    """将表格数据渲染为微信兼容 HTML"""
    if not rows:
        return ''
    ncols = max(len(r) for r in rows)
    html = '<table style="border-collapse:collapse;width:100%;margin:16px 0;font-size:14px">'
    for i, row in enumerate(rows):
        while len(row) < ncols:
            row.append('')
        tag = 'th' if i == 0 else 'td'
        bg = '#f6f8fa' if i == 0 else 'transparent'
        weight = 'bold' if i == 0 else 'normal'
        cells_html = ''.join(
            f'<{tag} style="border:1px solid #ddd;padding:8px 12px;'
            f'background:{bg};font-weight:{weight};text-align:left">'
            f'{process_inline(c)}</{tag}>'
            for c in row
        )
        html += f'<tr>{cells_html}</tr>'
    html += '</table>'
    return html


def escape_html(text):
    """转义 HTML 特殊字符"""
    text = text.replace('&', '&amp;')
    text = text.replace('<', '&lt;')
    text = text.replace('>', '&gt;')
    text = text.replace('"', '&quot;')
    return text


# ─── 核心转换 ──────────────────────────────────────────────

def md_to_wechat_html(md_body, slug="", article_date=""):
    """将 Markdown body 转为微信公众号兼容 HTML，仅做样式适配，禁止改写内容"""

    # 预处理：修复跨行链接和表格前缀
    md_body = preprocess_markdown(md_body)

    # 图片输出目录
    date_str = article_date or datetime.now().strftime('%Y-%m-%d')
    img_dir = os.path.join(HUGO_DIR, "assets", "images", date_str)
    os.makedirs(img_dir, exist_ok=True)

    # mermaid 图片计数器（用于命名）
    mermaid_counter = 0

    lines = md_body.split('\n')
    html_parts = []
    in_code_block = False
    code_lang = ""
    code_lines = []
    in_table = False
    table_rows = []

    for line in lines:
        # ─── 代码块 ───
        if line.strip().startswith('```'):
            if in_code_block:
                code_text = '\n'.join(code_lines)

                # 检测 ASCII 架构图 → 转 Mermaid
                if is_ascii_art(code_text):
                    mermaid_counter += 1
                    mermaid_code = ascii_to_mermaid(code_text)
                    if mermaid_code:
                        img_filename = f"{slug}-diagram-{mermaid_counter}.png"
                        img_path = os.path.join(img_dir, img_filename)
                        print(f"   🎨 检测到 ASCII 图形，转换为 Mermaid: {img_filename}")
                        result = render_mermaid_to_png(mermaid_code, img_path)
                        if result:
                            img_url = f"/assets/images/{date_str}/{img_filename}"
                            html_parts.append(
                                f'<figure style="margin:16px 0;text-align:center">'
                                f'<img src="{resolve_url(img_url)}" '
                                f'alt="架构图" style="max-width:100%;border-radius:4px">'
                                f'</figure>'
                            )
                        else:
                            # Mermaid 渲染失败，保留原 ASCII 代码块
                            html_parts.append(
                                f'<pre style="background:#f6f8fa;padding:12px;border-radius:6px;'
                                f'font-size:14px;line-height:1.6;overflow-x:auto;white-space:pre-wrap;'
                                f'word-break:break-all">{escape_html(code_text)}</pre>'
                            )
                    else:
                        # 无法转换为 Mermaid，保留原样
                        html_parts.append(
                            f'<pre style="background:#f6f8fa;padding:12px;border-radius:6px;'
                            f'font-size:14px;line-height:1.6;overflow-x:auto;white-space:pre-wrap;'
                            f'word-break:break-all">{escape_html(code_text)}</pre>'
                        )
                else:
                    # 普通代码块
                    html_parts.append(
                        f'<pre style="background:#f6f8fa;padding:12px;border-radius:6px;'
                        f'font-size:14px;line-height:1.6;overflow-x:auto;white-space:pre-wrap;'
                        f'word-break:break-all">{escape_html(code_text)}</pre>'
                    )

                code_lines = []
                in_code_block = False
            else:
                in_code_block = True
                code_lang = line.strip()[3:].strip()
                code_lines = []
            continue

        if in_code_block:
            code_lines.append(line)
            continue

        # ─── 表格 ───
        if '|' in line:
            stripped = line.strip()
            if stripped.startswith('|'):
                cells = [c.strip() for c in stripped.split('|') if c.strip()]
                # separator row (| --- | --- |)
                if cells and all(re.match(r'^[-:]+$', c) for c in cells):
                    continue
                if not in_table:
                    in_table = True
                    table_rows = []
                table_rows.append(cells)
                continue
        elif in_table:
            html_parts.append(render_table(table_rows))
            in_table = False
            table_rows = []

        # ─── 标题 ───
        heading_match = re.match(r'^#+\s+(.+)$', line)
        if heading_match:
            level = len(line) - len(line.lstrip('#'))
            text = heading_match.group(1)
            if level == 1:
                level = 2  # 微信不支持 h1
            sizes = {2: '20px', 3: '18px', 4: '16px', 5: '15px', 6: '14px'}
            size = sizes.get(level, '16px')
            html_parts.append(
                f'<h{level} style="font-size:{size};font-weight:bold;color:#1a1a1a;'
                f'margin:20px 0 10px">{process_inline(text)}</h{level}>'
            )
            continue

        # ─── 引用块 ───
        if line.strip().startswith('>'):
            quote_text = re.sub(r'^>\s?', '', line).strip()
            if quote_text:
                quote_text = process_inline(quote_text)
                html_parts.append(
                    f'<blockquote style="border-left:3px solid #ddd;padding-left:12px;'
                    f'color:#666;margin:16px 0">{quote_text}</blockquote>'
                )
            continue

        # ─── 无序列表 ───
        ul_match = re.match(r'^-\s+(.+)$', line)
        if ul_match:
            text = process_inline(ul_match.group(1))
            html_parts.append(
                f'<p style="margin:4px 0;padding-left:20px;text-indent:-20px">'
                f'• {text}</p>'
            )
            continue

        # ─── 有序列表 ───
        ol_match = re.match(r'^(\d+)\.\s+(.+)$', line)
        if ol_match:
            text = process_inline(ol_match.group(2))
            html_parts.append(
                f'<p style="margin:4px 0;padding-left:24px;text-indent:-24px">'
                f'{ol_match.group(1)}. {text}</p>'
            )
            continue

        # ─── 分割线 ───
        if line.strip() in ('---', '***', '___'):
            html_parts.append('<hr style="border:none;border-top:1px solid #ddd;margin:24px 0">')
            continue

        # ─── 图片 ───
        img_match = re.match(r'!\[([^\]]*)\]\(([^)]+)\)', line)
        if img_match:
            alt, src = img_match.group(1), img_match.group(2)
            html_parts.append(
                f'<figure style="margin:16px 0;text-align:center">'
                f'<img src="{resolve_url(src)}" alt="{alt}" style="max-width:100%;border-radius:4px">'
                f'</figure>'
            )
            continue

        # ─── 空行 → 跳过 ───
        if not line.strip():
            continue

        # ─── 普通段落 ───
        text = process_inline(line)
        html_parts.append(
            f'<p style="margin:12px 0;font-size:16px;line-height:1.8;color:#333">{text}</p>'
        )

    # 处理剩余的表格
    if in_table and table_rows:
        html_parts.append(render_table(table_rows))

    content = '\n'.join(html_parts)
    wrapped = (
        f'<div style="max-width:100%;font-size:16px;line-height:1.8;color:#333;'
        f'word-break:break-word">{content}</div>'
    )
    return wrapped


# ─── 文章转换入口 ──────────────────────────────────────────

def convert_article(slug):
    """转换指定 slug 的文章，返回 (title, description, html_content)"""
    md_path = os.path.join(CONTENT_DIR, f"{slug}.md")

    if not os.path.exists(md_path):
        print(f"❌ 文章不存在: {md_path}")
        sys.exit(1)

    with open(md_path, 'r', encoding='utf-8') as f:
        md_text = f.read()

    meta, body = parse_frontmatter(md_text)

    title = meta.get('title', slug)
    description = meta.get('description', '')
    article_date = meta.get('date', datetime.now().strftime('%Y-%m-%d'))

    html_content = md_to_wechat_html(body, slug=slug, article_date=article_date)

    # 在文末追加互动引导
    footer = (
        f'<p style="margin:24px 0 0;padding:12px 16px;background:#f6f8fa;'
        f'border-radius:6px;text-align:center;font-size:15px;color:#555;line-height:1.8">'
        f'如果文章对你有帮助，请<strong style="color:#1a1a1a">点赞</strong>、'
        f'<strong style="color:#1a1a1a">转发</strong>、'
        f'<strong style="color:#e74c3c">❤</strong>，'
        f'欢迎评论区参与互动！</p>'
    )
    html_content += footer

    return title, description, html_content


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("用法: python3 hugo_to_wechat.py <文章slug>")
        print("示例: python3 hugo_to_wechat.py mfg-digital-worker-02-technical-selection-training")
        sys.exit(1)

    slug = sys.argv[1]
    title, description, html_content = convert_article(slug)

    # 输出到文件
    output_dir = OUTPUT_DIR
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, f"{slug}_wechat.html")

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html_content)

    print(f"✅ 转换完成: {title}")
    print(f"   描述: {description}")
    print(f"   HTML 输出: {output_path}")
    print(f"   内容长度: {len(html_content)} 字符")