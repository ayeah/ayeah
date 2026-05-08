#!/bin/bash
# 微信公众号一键发布草稿脚本
# 流程：① Hugo Markdown → 微信 HTML  → ② 生成封面图 → ③ 上传封面图 → ④ 保存草稿
#
# 用法: bash publish_to_wechat.sh <文章slug>
# 示例: bash publish_to_wechat.sh mfg-digital-worker-01-planning-framework

set -e

SLUG="$1"
if [ -z "$SLUG" ]; then
    echo "❌ 请指定文章 slug"
    echo "用法: bash publish_to_wechat.sh <文章slug>"
    exit 1
fi

HUGO_DIR="/opt/data/ayeah-hugo"
SCRIPTS_DIR="$HUGO_DIR/scripts"
OUTPUT_DIR="$HUGO_DIR/output"

mkdir -p "$OUTPUT_DIR"

echo "================================"
echo "🚀 微信公众号草稿发布流程"
echo "   文章: $SLUG"
echo "================================"

# ① Hugo Markdown → 微信 HTML
echo ""
echo "① 转换文章为微信 HTML..."
python3 "$SCRIPTS_DIR/hugo_to_wechat.py" "$SLUG"

HTML_FILE="$OUTPUT_DIR/${SLUG}_wechat.html"
if [ ! -f "$HTML_FILE" ]; then
    echo "❌ HTML 转换失败"
    exit 1
fi

# ② 生成封面图
echo ""
echo "② 生成封面图..."

COVER_FILE="$OUTPUT_DIR/${SLUG}_cover.png"

# 检查是否已有封面图
if [ -f "$COVER_FILE" ]; then
    echo "   封面图已存在: $COVER_FILE"
    echo "   如需重新生成，请删除后重试"
else
    # 检查 API Key 环境变量
    if [ -z "$WECHAT_IMAGE_API_KEY" ]; then
        echo "⚠️  未设置 WECHAT_IMAGE_API_KEY"
        echo "   仅输出 prompt，请手动生成封面图后放入: $COVER_FILE"
        echo "   或设置环境变量后重试:"
        echo "   export WECHAT_IMAGE_API_KEY=your_key"
        echo "   export WECHAT_IMAGE_API=siliconflow  # 或 openai"
        python3 "$SCRIPTS_DIR/generate_cover.py" "$SLUG" --generate-prompt
        
        echo ""
        echo "⏸️  请将生成的封面图放入: $COVER_FILE"
        echo "   然后重新运行本脚本"
        exit 0
    fi
    
    python3 "$SCRIPTS_DIR/generate_cover.py" "$SLUG" --output "$COVER_FILE"
    
    if [ ! -f "$COVER_FILE" ]; then
        echo "❌ 封面图生成失败"
        echo "   请手动生成并放入: $COVER_FILE"
        exit 1
    fi
fi

# ③ 上传封面图到微信素材库
echo ""
echo "③ 上传封面图到微信素材库..."

COVER_INFO="$OUTPUT_DIR/${SLUG}_cover_info.json"

python3 "$SCRIPTS_DIR/wechat_upload_cover.py" "$COVER_FILE" --type thumb --save "$COVER_INFO"

if [ ! -f "$COVER_INFO" ]; then
    echo "❌ 封面图上传失败"
    exit 1
fi

# 读取 thumb_media_id
THUMB_MEDIA_ID=$(python3 -c "import json; d=json.load(open('$COVER_INFO')); print(d.get('media_id',''))")

if [ -z "$THUMB_MEDIA_ID" ]; then
    echo "❌ thumb_media_id 为空"
    exit 1
fi

echo "   thumb_media_id: $THUMB_MEDIA_ID"

# ④ 保存草稿
echo ""
echo "④ 保存草稿到公众号后台..."

python3 "$SCRIPTS_DIR/wechat_save_draft.py" --slug "$SLUG" --thumb-media-id "$THUMB_MEDIA_ID"

echo ""
echo "================================"
echo "🎉 草稿发布完成！"
echo "   请在微信公众号后台查看和编辑草稿"
echo "================================"