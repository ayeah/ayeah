#!/usr/bin/env python3
"""
微信封面图上传脚本
上传图片到微信公众号素材库，获取 thumb_media_id 用于草稿。
"""

import os
import sys
import json
import urllib.request
import urllib.parse

HUGO_DIR = "/opt/data/ayeah-hugo"
ENV_FILE = os.path.join(HUGO_DIR, ".env.wechat")


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
        
        if errcode == 40164:
            # IP 白名单问题
            ip = errmsg.split('invalid ip ')[1].split(' ')[0] if 'invalid ip' in errmsg else ''
            print(f"💡 需要将 IP {ip} 加入公众号后台的 IP 白名单")
        sys.exit(1)


def upload_image(access_token, image_path, media_type="thumb"):
    """
    上传图片到微信公众号素材库
    media_type: "thumb" (封面图, ≤10MB, 推荐尺寸 1024x436) 或 "image" (正文图片)
    返回 media_id
    """
    # 微信接口：新增永久素材（用于封面）
    # 临时素材接口也支持，但永久素材更稳定
    url = f"https://api.weixin.qq.com/cgi-bin/material/add_material?access_token={access_token}&type={media_type}"
    
    if not os.path.exists(image_path):
        print(f"❌ 图片文件不存在: {image_path}")
        sys.exit(1)
    
    # 检查文件大小
    file_size = os.path.getsize(image_path)
    max_size = 10 * 1024 * 1024  # 微信封面图限制 10MB
    if file_size > max_size:
        print(f"⚠️  文件大小 {file_size} bytes 超过限制 ({max_size} bytes)")
        print(f"   封面图限制 10MB，建议压缩后上传")
    else:
        print(f"   文件大小: {file_size / 1024:.0f}KB (限制: 10MB)")
    
    # 构造 multipart/form-data 上传
    filename = os.path.basename(image_path)
    boundary = '----WeChatBoundary' + str(int(os.urandom(8).hex(), 16))
    
    with open(image_path, 'rb') as f:
        file_data = f.read()
    
    body = (
        f'--{boundary}\r\n'
        f'Content-Disposition: form-data; name="media"; filename="{filename}"\r\n'
        f'Content-Type: image/png\r\n\r\n'
    ).encode('utf-8') + file_data + f'\r\n--{boundary}--\r\n'.encode('utf-8')
    
    headers = {
        'Content-Type': f'multipart/form-data; boundary={boundary}',
        'Content-Length': str(len(body)),
    }
    
    req = urllib.request.Request(url, data=body, headers=headers, method="POST")
    
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            result = json.loads(resp.read().decode('utf-8'))
    except Exception as e:
        print(f"❌ 上传图片网络错误: {e}")
        sys.exit(1)
    
    if 'media_id' in result:
        media_id = result['media_id']
        print(f"✅ 图片上传成功!")
        print(f"   media_id: {media_id}")
        if 'url' in result:
            print(f"   url: {result['url']}")
        return media_id, result.get('url', '')
    else:
        errcode = result.get('errcode', 'unknown')
        errmsg = result.get('errmsg', 'unknown')
        print(f"❌ 上传失败: errcode={errcode}, errmsg={errmsg}")
        sys.exit(1)


def upload_content_image(access_token, image_path):
    """
    上传正文图片到微信（用于文章内的图片）
    使用上传图文消息内的图片接口，返回 url
    """
    url = f"https://api.weixin.qq.com/cgi-bin/media/uploadimg?access_token={access_token}"
    
    if not os.path.exists(image_path):
        print(f"❌ 图片不存在: {image_path}")
        sys.exit(1)
    
    filename = os.path.basename(image_path)
    boundary = '----WeChatBoundary' + str(int(os.urandom(8).hex(), 16))
    
    with open(image_path, 'rb') as f:
        file_data = f.read()
    
    body = (
        f'--{boundary}\r\n'
        f'Content-Disposition: form-data; name="media"; filename="{filename}"\r\n'
        f'Content-Type: image/png\r\n\r\n'
    ).encode('utf-8') + file_data + f'\r\n--{boundary}--\r\n'.encode('utf-8')
    
    headers = {
        'Content-Type': f'multipart/form-data; boundary={boundary}',
        'Content-Length': str(len(body)),
    }
    
    req = urllib.request.Request(url, data=body, headers=headers, method="POST")
    
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            result = json.loads(resp.read().decode('utf-8'))
    except Exception as e:
        print(f"❌ 上传正文图片网络错误: {e}")
        sys.exit(1)
    
    if 'url' in result:
        print(f"✅ 正文图片上传成功: {result['url']}")
        return result['url']
    else:
        print(f"❌ 上传失败: {result}")
        sys.exit(1)


if __name__ == '__main__':
    import argparse
    
    parser = argparse.ArgumentParser(description='上传图片到微信公众号素材库')
    parser.add_argument('image_path', help='图片文件路径')
    parser.add_argument('--type', choices=['thumb', 'image', 'content'],
                        default='thumb', help='上传类型: thumb(封面缩略图), image(永久素材), content(正文图片)')
    parser.add_argument('--save', help='保存结果到 JSON 文件')
    
    args = parser.parse_args()
    
    # 加载配置
    env = load_env()
    appid = env.get('WECHAT_APPID')
    appsecret = env.get('WECHAT_APPSECRET')
    
    if not appid or not appsecret:
        print("❌ 缺少 WECHAT_APPID 或 WECHAT_APPSECRET")
        print(f"   请检查 {ENV_FILE}")
        sys.exit(1)
    
    # 获取 access_token
    print("🔑 获取 access_token...")
    access_token = get_access_token(appid, appsecret)
    print(f"   access_token: {access_token[:20]}...")
    
    # 上传图片
    if args.type == 'content':
        url = upload_content_image(access_token, args.image_path)
        result = {"url": url}
    else:
        media_id, url = upload_image(access_token, args.image_path, args.type)
        result = {"media_id": media_id, "url": url}
    
    # 保存结果
    if args.save:
        os.makedirs(os.path.dirname(args.save) or '.', exist_ok=True)
        with open(args.save, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        print(f"   结果已保存: {args.save}")
    
    print("🎉 完成!")