#!/usr/bin/env python3
"""
Hand-drawn marker-style text overlay for cover image.
Uses stroke effect, per-character transforms, and marker pen simulation.
"""

import random
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps

IMG_IN = "/opt/data/ayeah-hugo/static/images/illustrations/omniroute/01-cover-treasure-notext.png"
IMG_OUT = "/opt/data/ayeah-hugo/static/images/illustrations/omniroute/01-cover-treasure-v2.png"
FONT_PATH = "/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc"

random.seed(42)  # Reproducible

# --- Colors (hand-drawn marker palette) ---
RED = (200, 28, 28)
DARK_RED = (160, 18, 18)
ORANGE = (230, 110, 30)
BLUE = (40, 90, 190)
BLACK = (45, 45, 45)
DARK = (35, 35, 35)


def load_font(size):
    return ImageFont.truetype(FONT_PATH, size)


def draw_marker_char(overlay, char, font, x, y, color, 
                     stroke_color=None, stroke_width=0,
                     rotation=0, scale=1.0):
    """
    Draw a single character with marker-pen effect:
    - Render on temp surface
    - Apply rotation + slight scale distortion  
    - Add thick stroke outline
    - Paste with alpha
    """
    bbox = font.getbbox(char)
    cw = bbox[2] - bbox[0]
    ch = bbox[3] - bbox[1]
    pad = max(stroke_width * 2, 12) + int(abs(rotation) * 0.5)
    
    # Create temp RGBA surface
    tmp = Image.new("RGBA", (cw + pad*2, ch + pad*2), (0, 0, 0, 0))
    td = ImageDraw.Draw(tmp)
    
    # Draw stroke (outline) first
    if stroke_width > 0 and stroke_color:
        td.text((pad - bbox[0], pad - bbox[1]), char, font=font,
                fill=stroke_color, stroke_width=stroke_width)
    
    # Draw fill on top
    td.text((pad - bbox[0], pad - bbox[1]), char, font=font, fill=color)
    
    # Apply rotation
    if rotation != 0:
        tmp = tmp.rotate(rotation, expand=True, resample=Image.BICUBIC)
    
    # Apply slight non-uniform scale for hand-drawn feel
    if scale != 1.0:
        nw = int(tmp.width * scale)
        nh = int(tmp.height * (2.0 - scale))  # Inverse stretch
        tmp = tmp.resize((nw, nh), Image.LANCZOS)
    
    # Paste onto overlay
    overlay.paste(tmp, (int(x), int(y)), tmp)
    return tmp.width  # Return width for spacing


def draw_marker_text(overlay, text, font, center_x, y, color,
                     stroke_color=None, stroke_width=0,
                     max_rotation=5, spacing_extra=2, scale_range=(0.95, 1.05)):
    """Draw a line of marker-style text, centered at center_x."""
    chars = list(text)
    
    # Calculate total width
    widths = []
    for c in chars:
        bbox = font.getbbox(c)
        widths.append(bbox[2] - bbox[0])
    total = sum(widths) + (len(chars)-1) * spacing_extra
    start_x = center_x - total // 2
    
    cx = start_x
    for i, c in enumerate(chars):
        rot = random.uniform(-max_rotation, max_rotation)
        scale = random.uniform(scale_range[0], scale_range[1])
        jx = random.uniform(-1, 1)
        jy = random.uniform(-1.5, 1.5)
        
        w = draw_marker_char(overlay, c, font, cx + jx, y + jy,
                             color, stroke_color, stroke_width,
                             rotation=rot, scale=scale)
        cx += widths[i] + spacing_extra


def draw_label_text(overlay, text, font, x, y, color, rotation=0,
                    stroke_color=None, stroke_width=0):
    """Draw a short label (not centered)."""
    cx = x
    chars = list(text)
    for c in chars:
        rot = rotation + random.uniform(-2.5, 2.5)
        scale = random.uniform(0.97, 1.03)
        jx = random.uniform(-0.8, 0.8)
        jy = random.uniform(-0.8, 0.8)
        
        bbox = font.getbbox(c)
        cw = bbox[2] - bbox[0]
        
        draw_marker_char(overlay, c, font, cx + jx, y + jy,
                         color, stroke_color, stroke_width,
                         rotation=rot, scale=scale)
        cx += cw + 2


def add_wavy_line(overlay, x1, y1, x2, y2, color, width=4, amplitude=3, frequency=0.05):
    """Draw a hand-drawn wavy line."""
    draw = ImageDraw.Draw(overlay)
    points = []
    length = math.sqrt((x2-x1)**2 + (y2-y1)**2)
    steps = max(int(length), 50)
    for i in range(steps + 1):
        t = i / steps
        px = x1 + (x2 - x1) * t
        py = y1 + (y2 - y1) * t
        # Add wave perpendicular to line
        wave = amplitude * math.sin(frequency * i * 2 * math.pi)
        # Perpendicular direction
        dx = (x2 - x1) / length
        dy = (y2 - y1) / length
        px += -dy * wave
        py += dx * wave
        points.append((px, py))
    
    # Draw with slight variation
    for i in range(len(points) - 1):
        w = width + random.uniform(-0.5, 0.5)
        draw.line([points[i], points[i+1]], fill=color, width=max(1, int(w)))


def add_circle_annotation(overlay, cx, cy, rx, ry, color, width=3):
    """Draw a hand-drawn circle/ellipse (imperfect)."""
    draw = ImageDraw.Draw(overlay)
    points = []
    for i in range(80):
        angle = 2 * math.pi * i / 79
        # Add imperfection
        jx = random.uniform(-2, 2)
        jy = random.uniform(-2, 2)
        x = cx + (rx + jx) * math.cos(angle)
        y = cy + (ry + jy) * math.sin(angle)
        points.append((x, y))
    
    for i in range(len(points) - 1):
        w = width + random.uniform(-0.3, 0.3)
        draw.line([points[i], points[i+1]], fill=color, width=max(1, int(w)))


def add_sparkle(overlay, x, y, size, color):
    """Draw a simple sparkle/star decoration."""
    draw = ImageDraw.Draw(overlay)
    # 4-point star
    r = size
    points = [
        (x, y-r), (x+r*0.3, y-r*0.3),
        (x+r, y), (x+r*0.3, y+r*0.3),
        (x, y+r), (x-r*0.3, y+r*0.3),
        (x-r, y), (x-r*0.3, y-r*0.3),
    ]
    draw.polygon(points, fill=color)


def create_cover():
    # Load base image
    base = Image.open(IMG_IN).convert("RGBA")
    W, H = base.size  # 768 x 1024
    
    # Create overlay
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    
    # === LAYOUT ===
    
    # 1. Main title: 白嫖Token神器
    font_title = load_font(54)
    # White glow behind title for readability
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw_glow = ImageDraw.Draw(glow)
    draw_glow.text((W//2, 62), "白嫖Token神器", font=font_title,
                   fill=(255, 255, 255, 160), anchor="mt",
                   stroke_width=8, stroke_fill=(255, 255, 255, 120))
    glow = glow.filter(ImageFilter.GaussianBlur(6))
    overlay = Image.alpha_composite(overlay, glow)
    
    draw_marker_text(overlay, "白嫖Token神器", font_title,
                     W//2, 42,
                     color=RED,
                     stroke_color=(255, 240, 240, 200),
                     stroke_width=3,
                     max_rotation=3.5,
                     spacing_extra=4,
                     scale_range=(0.96, 1.04))
    
    # 2. Subtitle: OmniRoute
    font_sub = load_font(40)
    draw_marker_text(overlay, "OmniRoute", font_sub,
                     W//2, 112,
                     color=BLACK,
                     stroke_color=(255, 255, 255, 180),
                     stroke_width=2,
                     max_rotation=2,
                     spacing_extra=3,
                     scale_range=(0.98, 1.02))
    
    # 3. Wavy underline
    add_wavy_line(overlay, 225, 165, 545, 165, ORANGE, width=4, amplitude=2.5, frequency=0.04)
    
    # 4. "宝藏" badge with circle
    font_badge = load_font(28)
    draw_label_text(overlay, "宝藏", font_badge,
                    530, 240, RED,
                    rotation=-8,
                    stroke_color=(255, 245, 245, 180),
                    stroke_width=2)
    add_circle_annotation(overlay, 568, 258, 42, 24, RED, width=3)
    
    # 5. "免费!" label
    font_free = load_font(34)
    draw_label_text(overlay, "免费!", font_free,
                    55, 350, ORANGE,
                    rotation=5,
                    stroke_color=(255, 250, 240, 180),
                    stroke_width=2)
    
    # 6. "237个提供商" bottom area
    font_prov = load_font(22)
    draw_label_text(overlay, "237个提供商", font_prov,
                    170, 885, BLUE,
                    rotation=-3,
                    stroke_color=(240, 245, 255, 160),
                    stroke_width=2)
    
    # 7. "开箱即用" bottom-right
    font_ready = load_font(24)
    draw_label_text(overlay, "开箱即用", font_ready,
                    490, 920, DARK_RED,
                    rotation=4,
                    stroke_color=(255, 245, 245, 180),
                    stroke_width=2)
    
    # 8. Decorative sparkles
    add_sparkle(overlay, 125, 60, 10, ORANGE + (170,))
    add_sparkle(overlay, 640, 55, 8, ORANGE + (150,))
    add_sparkle(overlay, 155, 105, 6, ORANGE + (130,))
    add_sparkle(overlay, 640, 880, 7, ORANGE + (120,))
    
    # === COMPOSITE ===
    result = Image.alpha_composite(base, overlay)
    result_rgb = result.convert("RGB")
    result_rgb.save(IMG_OUT, "PNG", quality=95)
    
    import os
    fsize = os.path.getsize(IMG_OUT)
    print(f"✅ Saved: {IMG_OUT}")
    print(f"   Size: {result_rgb.size}, File: {fsize//1024}KB")


if __name__ == "__main__":
    create_cover()
