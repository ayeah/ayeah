#!/usr/bin/env python3
"""Upload inline images to WeChat CDN and update HTML."""
import json, os, re, sys, urllib.request

SLUG = sys.argv[1] if len(sys.argv) > 1 else "dify-vs-openclaw-agent"
HUGO_DIR = "/opt/data/ayeah-hugo"

# Load env
env_path = f"{HUGO_DIR}/.env.wechat"
with open(env_path) as f:
    for line in f:
        line = line.strip()
        if line.startswith("WECHAT_APPID="):
            appid = line.split("=", 1)[1]
        elif line.startswith("WECHAT_APPSECRET="):
            secret = line.split("=", 1)[1]

# Get token
token_url = f"https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid={appid}&secret={secret}"
with urllib.request.urlopen(token_url, timeout=10) as resp:
    token = json.loads(resp.read())["access_token"]
print(f"Token: {token[:20]}...")

images = [
    f"{HUGO_DIR}/static/assets/images/2026-05-21/diagram-01-openclaw-agent-live.png",
    f"{HUGO_DIR}/static/assets/images/2026-05-21/diagram-02-dify-orchestrated.png",
    f"{HUGO_DIR}/static/assets/images/2026-05-21/diagram-03-combo-architecture.png",
]
old_urls = [
    "https://ayeah.net/assets/images/2026-05-21/diagram-01-openclaw-agent-live.png",
    "https://ayeah.net/assets/images/2026-05-21/diagram-02-dify-orchestrated.png",
    "https://ayeah.net/assets/images/2026-05-21/diagram-03-combo-architecture.png",
]

cdn_urls = []
for i, img_path in enumerate(images):
    print(f"Uploading image {i+1}/{len(images)}: {os.path.basename(img_path)}")
    upload_url = f"https://api.weixin.qq.com/cgi-bin/media/uploadimg?access_token={token}"
    
    # Build multipart form
    boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW"
    with open(img_path, "rb") as f:
        img_data = f.read()
    
    body = (
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="media"; filename="{os.path.basename(img_path)}"\r\n'
        f"Content-Type: image/png\r\n\r\n"
    ).encode() + img_data + f"\r\n--{boundary}--\r\n".encode()
    
    req = urllib.request.Request(upload_url, data=body)
    req.add_header("Content-Type", f"multipart/form-data; boundary={boundary}")
    
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            result = json.loads(resp.read())
            url = result.get("url", "")
            if url:
                cdn_urls.append(url)
                print(f"  ✅ CDN: {url[:60]}...")
            else:
                print(f"  ❌ {result}")
                cdn_urls.append(old_urls[i])
    except Exception as e:
        print(f"  ❌ Error: {e}")
        cdn_urls.append(old_urls[i])

# Replace in HTML
html_path = f"{HUGO_DIR}/output/{SLUG}_wechat.html"
with open(html_path) as f:
    html = f.read()

for old_url, new_url in zip(old_urls, cdn_urls):
    if old_url in html:
        html = html.replace(old_url, new_url)
        print(f"  Replaced: {os.path.basename(old_url)}")

# Verify
remaining = re.findall(r"https://ayeah\.net/assets/images/[^\"\' >]+", html)
if remaining:
    print(f"⚠️ Still have: {remaining}")
else:
    print("✅ All local image URLs replaced")

cnt = html.count("mmbiz.qpic.cn")
print(f"CDN URLs: {cnt}")

# Strip anchor links
anchors = re.findall(r'<a\s+href="#[^"]*"[^>]*>(.*?)</a>', html)
if anchors:
    html = re.sub(r'<a\s+href="#[^"]*"[^>]*>(.*?)</a>', r'\1', html)
    print(f"✅ Stripped {len(anchors)} anchor links")

with open(html_path, 'w') as f:
    f.write(html)
print(f"\nDone! HTML ({len(html)} chars) updated.")