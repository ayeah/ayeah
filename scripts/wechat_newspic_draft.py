#!/usr/bin/env python3
"""
微信公众号贴图草稿（newspic）创建脚本

将图片上传为永久素材，然后创建 newspic 类型草稿。
与图文消息（news）不同，贴图以图片为主体 + 纯文本描述。

Usage:
    python3 wechat_newspic_draft.py --title "标题" --content "描述" --images img1.png img2.png
    python3 wechat_newspic_draft.py --title "标题" --content "描述" --image-dir /path/to/images/
"""

import json, urllib.request, os, time, sys, argparse

BASE = "/opt/data/ayeah-hugo"
ENV_FILE = f"{BASE}/.env.wechat"


def load_credentials():
    """加载微信公众号 AppID 和 AppSecret"""
    creds = {}
    with open(ENV_FILE) as f:
        for line in f:
            line = line.strip()
            if line.startswith("#") or "=" not in line:
                continue
            key, val = line.split("=", 1)
            creds[key] = val
    return creds.get("WECHAT_APPID", ""), creds.get("WECHAT_APPSECRET", "")


def get_stable_token(appid, appsecret):
    """获取 stable access_token"""
    url = "https://api.weixin.qq.com/cgi-bin/stable_token"
    payload = json.dumps({"grant_type": "client_credential", "appid": appid, "secret": appsecret})
    req = urllib.request.Request(url, data=payload.encode(), headers={"Content-Type": "application/json"})
    resp = json.loads(urllib.request.urlopen(req).read())
    token = resp.get("access_token")
    if not token:
        print(f"❌ Token failed: {resp}")
        sys.exit(1)
    return token


def upload_permanent_image(filepath, token):
    """上传图片为永久素材（type=image），返回 media_id"""
    boundary = "----FormBoundaryPermUpload"
    filename = os.path.basename(filepath)
    ext = "png" if filename.endswith(".png") else "jpeg"
    with open(filepath, "rb") as f:
        file_data = f.read()
    body = b""
    body += f'--{boundary}\r\nContent-Disposition: form-data; name="media"; filename="{filename}"\r\nContent-Type: image/{ext}\r\n\r\n'.encode()
    body += file_data
    body += b"\r\n"
    body += f'--{boundary}--\r\n'.encode()
    req = urllib.request.Request(
        f"https://api.weixin.qq.com/cgi-bin/material/add_material?access_token={token}&type=image",
        data=body,
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"}
    )
    return json.loads(urllib.request.urlopen(req).read())


def create_newspic_draft(token, title, content, media_ids):
    """创建 newspic 贴图草稿"""
    articles = [{
        "article_type": "newspic",
        "title": title,
        "content": content,
        "image_info": {
            "image_list": [{"image_media_id": mid} for mid in media_ids]
        }
    }]
    draft_payload = json.dumps({"articles": articles}, ensure_ascii=False).encode("utf-8")
    req = urllib.request.Request(
        f"https://api.weixin.qq.com/cgi-bin/draft/add?access_token={token}",
        data=draft_payload,
        headers={"Content-Type": "application/json; charset=utf-8"}
    )
    return json.loads(urllib.request.urlopen(req).read())


def main():
    parser = argparse.ArgumentParser(description='创建微信公众号贴图草稿（newspic）')
    parser.add_argument('--title', required=True, help='标题（≤32字）')
    parser.add_argument('--content', required=True, help='纯文本描述（≤120字）')
    parser.add_argument('--images', nargs='+', help='图片文件路径列表')
    parser.add_argument('--image-dir', help='图片目录（自动按文件名排序）')
    parser.add_argument('--media-ids', nargs='+', help='直接传入已上传的 media_id（跳过上传）')
    parser.add_argument('--output', help='输出 JSON 文件路径')
    args = parser.parse_args()

    # 验证输入
    if len(args.title) > 32:
        print(f"⚠️  标题超过32字（当前{len(args.title)}字），将截断")
        args.title = args.title[:32]
    if len(args.content) > 120:
        print(f"⚠️  描述超过120字（当前{len(args.content)}字），将截断")
        args.content = args.content[:120]

    # 自动追加原文链接提示
    footer = "（原文请在公众号查看）"
    max_content = 120 - len(footer)
    if len(args.content) > max_content:
        args.content = args.content[:max_content]
    args.content += footer

    # 收集图片列表
    image_files = []
    if args.media_ids:
        pass  # 跳过上传
    elif args.images:
        image_files = args.images
    elif args.image_dir:
        if not os.path.isdir(args.image_dir):
            print(f"❌ 目录不存在: {args.image_dir}")
            sys.exit(1)
        for f in sorted(os.listdir(args.image_dir)):
            if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                image_files.append(os.path.join(args.image_dir, f))
        if not image_files:
            print(f"❌ 目录中没有找到图片文件")
            sys.exit(1)
    else:
        print("❌ 请指定 --images、--image-dir 或 --media-ids")
        sys.exit(1)

    # 验证图片数量
    if not args.media_ids:
        if len(image_files) > 20:
            print(f"⚠️  图片超过20张（当前{len(image_files)}张），将截断")
            image_files = image_files[:20]
        if len(image_files) == 0:
            print("❌ 没有图片可上传")
            sys.exit(1)

    # 获取 token
    appid, appsecret = load_credentials()
    print(f"🔑 AppID: {appid}")
    token = get_stable_token(appid, appsecret)
    print(f"✅ Token OK\n")

    # 上传图片
    media_ids = []
    if args.media_ids:
        media_ids = args.media_ids
        print(f"📋 使用已有 media_id: {len(media_ids)} 个")
    else:
        for filepath in image_files:
            filename = os.path.basename(filepath)
            size_kb = os.path.getsize(filepath) // 1024
            print(f"⬆️  Uploading {filename} ({size_kb}KB)...")
            result = upload_permanent_image(filepath, token)
            if "media_id" in result:
                media_ids.append(result["media_id"])
                print(f"   ✅ media_id: {result['media_id']}")
            else:
                print(f"   ❌ Failed: {result}")
                sys.exit(1)
            time.sleep(2)
        print(f"\n📊 Uploaded {len(media_ids)}/{len(image_files)} images\n")

    # 创建草稿
    time.sleep(2)
    print(f"💾 Creating newspic draft: '{args.title}'")
    print(f"   Content: {args.content} ({len(args.content)} chars)")
    print(f"   Images: {len(media_ids)}")

    result = create_newspic_draft(token, args.title, args.content, media_ids)
    print(f"\n📋 Draft result: {json.dumps(result, ensure_ascii=False)}")

    if "media_id" in result:
        print(f"\n🎉 贴图草稿保存成功！media_id: {result['media_id']}")
        info = {
            "draft_media_id": result["media_id"],
            "title": args.title,
            "article_type": "newspic",
            "content": args.content,
            "image_count": len(media_ids),
            "media_ids": media_ids
        }
        output_path = args.output or f"{BASE}/output/newspic_draft_info.json"
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, "w") as f:
            json.dump(info, f, ensure_ascii=False, indent=2)
        print(f"   信息已保存: {output_path}")
    else:
        print(f"\n❌ 草稿保存失败")
        sys.exit(1)


if __name__ == '__main__':
    main()
