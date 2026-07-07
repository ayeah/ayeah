#!/usr/bin/env python3
"""
Overlay hand-drawn style Chinese text onto the cover image.
Uses WenQuanYi font with random rotation, jitter, and sketch colors.
"""

import random
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

# Paths
IMG_IN = "/opt/data/ayeah-hugo/static/images/illustrations/omniroute/01-cover-treasure-notext.png"
IMG_OUT = "/opt/data/ayeah-hugo/static/images/illustrations/omniroute/01-cover-treasure.png"
FONT_PATH = "/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc"

# Hand-drawn style colors
COLOR_RED = "#D42020"
COLOR_ORANGE = "#E87020"
COLOR_BLUE = "#2060C0"
COLOR_BLACK = "#2A2A2A"
COLOR_DARKRED = "#B01010"


def draw_handwritten_text(draw, text, x, y, font, color, max_rotation=8, jitter=3):
    """Draw each character with random rotation and position jitter for hand-drawn feel."""
    cx = x
    for char in text:
        # Get character size
        bbox = font.getbbox(char)
        char_w = bbox[2] - bbox[0]
        char_h = bbox[3] - bbox[1]
        
        # Random rotation
        angle = random.uniform(-max_rotation, max_rotation)
        # Random position jitter
        jx = random.uniform(-jitter, jitter)
        jy = random.uniform(-jitter, jitter)
        
        # Draw character on temporary image for rotation
        tmp = Image.new("RGBA", (char_w + 10, char_h + 10), (255, 255, 255, 0))
        tmp_draw = ImageDraw.Draw(tmp)
        tmp_draw.text((5 - bbox[0], 5 - bbox[1]), char, font=font, fill=color)
        
        # Rotate
        tmp_rot = tmp.rotate(angle, expand=True, resample=Image.BICUBIC)
        
        # Paste onto main image
        paste_x = int(cx + jx)
        paste_y = int(y + jy)
        
        # We need to paste on the original image
        return tmp_rot, paste_x, paste_y, char_w


def overlay_text_on_image():
    # Load image
    img = Image.open(IMG_IN).convert("RGBA")
    W, H = img.size  # 768 x 1024
    
    # Create overlay layer
    overlay = Image.new("RGBA", (W, H), (255, 255, 255, 0))
    draw = ImageDraw.Draw(overlay)
    
    # Load fonts at different sizes
    font_title = ImageFont.truetype(FONT_PATH, 52)
    font_sub = ImageFont.truetype(FONT_PATH, 38)
    font_label = ImageFont.truetype(FONT_PATH, 24)
    font_small = ImageFont.truetype(FONT_PATH, 20)
    
    # === TEXT LAYOUT ===
    
    # 1. Main title "白嫖Token神器" at top area
    title = "白嫖Token神器"
    draw_handwritten_line(draw, overlay, title, font_title, COLOR_DARKRED, 
                          center_x=W//2, y=55, max_rot=6, jitter=2)
    
    # 2. "OmniRoute" below title
    draw_handwritten_line(draw, overlay, "OmniRoute", font_sub, COLOR_BLACK,
                          center_x=W//2, y=125, max_rot=4, jitter=1.5)
    
    # 3. Annotation labels scattered around the treasure area
    # These go in the middle-lower area where the visual elements are
    
    # "宝藏" - top-right area
    draw_handwritten_single(draw, overlay, "宝藏", font_label, COLOR_RED,
                            x=520, y=260, rotation=-12)
    
    # "免费" - left side
    draw_handwritten_single(draw, overlay, "免费!", font_label, COLOR_ORANGE,
                            x=60, y=380, rotation=8)
    
    # "237个提供商" - bottom area
    draw_handwritten_single(draw, overlay, "237个提供商", font_small, COLOR_BLUE,
                            x=180, y=880, rotation=-5)
    
    # "开箱即用" - bottom-right
    draw_handwritten_single(draw, overlay, "开箱即用", font_small, COLOR_RED,
                            x=500, y=920, rotation=6)
    
    # 4. Decorative: small arrows or circles near labels
    # Draw a small circle around "宝藏"
    draw.ellipse([510, 252, 620, 295], outline=COLOR_RED, width=2)
    
    # Draw underline for "OmniRoute"
    draw.line([(230, 168), (540, 168)], fill=COLOR_ORANGE, width=3)
    
    # 5. Merge overlay onto image
    result = Image.alpha_composite(img, overlay)
    
    # Convert to RGB for saving as PNG
    result_rgb = result.convert("RGB")
    result_rgb.save(IMG_OUT, "PNG", quality=95)
    print(f"✅ Saved: {IMG_OUT}")
    print(f"   Size: {result_rgb.size}")


def draw_handwritten_line(draw, overlay, text, font, color, center_x, y, max_rot=6, jitter=2):
    """Draw a line of text centered at center_x, with hand-drawn character effects."""
    # Calculate total width
    chars = list(text)
    char_widths = []
    for c in chars:
        bbox = font.getbbox(c)
        char_widths.append(bbox[2] - bbox[0])
    total_w = sum(char_widths) + (len(chars) - 1) * 4  # 4px spacing
    
    start_x = center_x - total_w // 2
    cx = start_x
    
    for i, char in enumerate(chars):
        bbox = font.getbbox(char)
        char_w = bbox[2] - bbox[0]
        char_h = bbox[3] - bbox[1]
        
        # Random rotation
        angle = random.uniform(-max_rot, max_rot)
        # Random jitter
        jx = random.uniform(-jitter, jitter)
        jy = random.uniform(-jitter, jitter)
        
        # Create character image
        padding = 8
        tmp = Image.new("RGBA", (char_w + padding*2, char_h + padding*2), (0, 0, 0, 0))
        tmp_draw = ImageDraw.Draw(tmp)
        tmp_draw.text((padding - bbox[0], padding - bbox[1]), char, font=font, fill=color)
        
        # Rotate
        tmp_rot = tmp.rotate(angle, expand=True, resample=Image.BICUBIC)
        
        # Paste
        paste_x = int(cx + jx)
        paste_y = int(y + jy)
        overlay.paste(tmp_rot, (paste_x, paste_y), tmp_rot)
        
        cx += char_w + 4


def draw_handwritten_single(draw, overlay, text, font, color, x, y, rotation=0):
    """Draw a short label text with hand-drawn style."""
    chars = list(text)
    cx = x
    for char in chars:
        bbox = font.getbbox(char)
        char_w = bbox[2] - bbox[0]
        char_h = bbox[3] - bbox[1]
        
        angle = rotation + random.uniform(-3, 3)
        jx = random.uniform(-1.5, 1.5)
        jy = random.uniform(-1.5, 1.5)
        
        padding = 6
        tmp = Image.new("RGBA", (char_w + padding*2, char_h + padding*2), (0, 0, 0, 0))
        tmp_draw = ImageDraw.Draw(tmp)
        tmp_draw.text((padding - bbox[0], padding - bbox[1]), char, font=font, fill=color)
        
        tmp_rot = tmp.rotate(angle, expand=True, resample=Image.BICUBIC)
        
        paste_x = int(cx + jx)
        paste_y = int(y + jy)
        overlay.paste(tmp_rot, (paste_x, paste_y), tmp_rot)
        
        cx += char_w + 2


if __name__ == "__main__":
    overlay_text_on_image()
