import os
from PIL import Image, ImageFilter
from collections import deque

artifacts_dir = r"C:\Users\joo\.gemini\antigravity-ide\brain\4ba76add-4c4c-4a98-b304-a7c9b862a731"
public_dir = r"c:\Users\joo\Desktop\projects\Learning\learning-nestjs\frontend\public"
hero_dir = os.path.join(public_dir, "hero")
leaves_dir = os.path.join(public_dir, "leaves")

os.makedirs(hero_dir, exist_ok=True)
os.makedirs(leaves_dir, exist_ok=True)

# 1. Process decorative_leaves_set_1792346264980.jpg into 6 individual transparent PNG leaves
leaves_img_path = os.path.join(artifacts_dir, "decorative_leaves_set_1792346264980.jpg")
if os.path.exists(leaves_img_path):
    leaves_img = Image.open(leaves_img_path).convert("RGBA")
    w, h = leaves_img.size

    # The 6 leaves are distributed horizontally in the center
    # Let's slice the image into 6 vertical segments and tightly crop each leaf
    num_leaves = 6
    seg_w = w // num_leaves

    for i in range(num_leaves):
        box = (i * seg_w, int(h * 0.3), (i + 1) * seg_w, int(h * 0.7))
        leaf_crop = leaves_img.crop(box)
        cw, ch = leaf_crop.size
        cdata = leaf_crop.load()

        # Make white background transparent
        min_x, min_y, max_x, max_y = cw, ch, 0, 0
        has_pixels = False

        for x in range(cw):
            for y in range(ch):
                r, g, b, a = cdata[x, y]
                brightness = (r + g + b) / 3.0
                diff = max(abs(r - g), abs(r - b), abs(g - b))

                # Pure or near white background
                if brightness >= 242 and diff < 15:
                    cdata[x, y] = (0, 0, 0, 0)
                elif brightness >= 220 and diff < 20:
                    alpha = int(255 * (242 - brightness) / 22.0)
                    cdata[x, y] = (r, g, b, max(0, min(255, alpha)))
                    min_x = min(min_x, x)
                    min_y = min(min_y, y)
                    max_x = max(max_x, x)
                    max_y = max(max_y, y)
                    has_pixels = True
                else:
                    min_x = min(min_x, x)
                    min_y = min(min_y, y)
                    max_x = max(max_x, x)
                    max_y = max(max_y, y)
                    has_pixels = True

        if has_pixels and max_x > min_x and max_y > min_y:
            # Crop to actual leaf bounds with slight padding
            pad = 10
            cropped_leaf = leaf_crop.crop((
                max(0, min_x - pad),
                max(0, min_y - pad),
                min(cw, max_x + pad),
                min(ch, max_y + pad)
            ))
            leaf_out = os.path.join(leaves_dir, f"leaf_{i+1}.png")
            cropped_leaf.save(leaf_out, "PNG", optimize=True)
            print(f"Saved {leaf_out} ({cropped_leaf.size})")

# 2. Process ورق شجر للزينه.jpg into transparent leaf divider
divider_src = os.path.join(public_dir, "ورق شجر للزينه.jpg")
if os.path.exists(divider_src):
    div_img = Image.open(divider_src).convert("RGBA")
    dw, dh = div_img.size
    ddata = div_img.load()

    min_x, min_y, max_x, max_y = dw, dh, 0, 0
    has_pixels = False

    for x in range(dw):
        for y in range(dh):
            r, g, b, a = ddata[x, y]
            brightness = (r + g + b) / 3.0
            # Background is white
            if brightness >= 245:
                ddata[x, y] = (0, 0, 0, 0)
            elif brightness >= 210:
                alpha = int(255 * (245 - brightness) / 35.0)
                # Tint the leaf divider to match our Sage Green #6b8f68 / #8fa88c
                ddata[x, y] = (95, 128, 93, alpha)
                min_x = min(min_x, x)
                min_y = min(min_y, y)
                max_x = max(max_x, x)
                max_y = max(max_y, y)
                has_pixels = True
            else:
                ddata[x, y] = (75, 108, 73, 255)
                min_x = min(min_x, x)
                min_y = min(min_y, y)
                max_x = max(max_x, x)
                max_y = max(max_y, y)
                has_pixels = True

    if has_pixels and max_x > min_x:
        cropped_div = div_img.crop((
            max(0, min_x - 15),
            max(0, min_y - 10),
            min(dw, max_x + 15),
            min(dh, max_y + 10)
        ))
        div_out = os.path.join(public_dir, "leaf_divider.png")
        cropped_div.save(div_out, "PNG", optimize=True)
        print(f"Saved {div_out} ({cropped_div.size})")

# 3. Process hands_holding_plant_1792346209686.jpg
hands_src = os.path.join(artifacts_dir, "hands_holding_plant_1792346209686.jpg")
if os.path.exists(hands_src):
    h_img = Image.open(hands_src).convert("RGBA")
    hw, hh = h_img.size
    hdata = h_img.load()

    # BFS from outside edges (excluding left edge where arms are, or only starting from pure white pixels on perimeter)
    q = deque()
    visited = set()

    for x in range(hw):
        # top and bottom edges
        for y in (0, hh - 1):
            r, g, b, _ = hdata[x, y]
            if (r + g + b) / 3.0 >= 215 and max(abs(r-g), abs(r-b), abs(g-b)) < 25:
                q.append((x, y))
                visited.add((x, y))

    for y in range(hh):
        # right edge
        x = hw - 1
        r, g, b, _ = hdata[x, y]
        if (r + g + b) / 3.0 >= 215 and max(abs(r-g), abs(r-b), abs(g-b)) < 25:
            q.append((x, y))
            visited.add((x, y))
        # left edge: only top part (above arm y < 350) and bottom part (below arm y > 800)
        x = 0
        r, g, b, _ = hdata[x, y]
        if (r + g + b) / 3.0 >= 215 and max(abs(r-g), abs(r-b), abs(g-b)) < 25:
            q.append((x, y))
            visited.add((x, y))

    bg_mask = [[False] * hh for _ in range(hw)]

    while q:
        x, y = q.popleft()
        bg_mask[x][y] = True
        for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nx, ny = x + dx, y + dy
            if 0 <= nx < hw and 0 <= ny < hh and (nx, ny) not in visited:
                visited.add((nx, ny))
                r, g, b, _ = hdata[nx, ny]
                brightness = (r + g + b) / 3.0
                diff = max(abs(r-g), abs(r-b), abs(g-b))
                # Stop if it's not white background
                if brightness >= 215 and diff < 25:
                    q.append((nx, ny))

    for x in range(hw):
        for y in range(hh):
            if bg_mask[x][y]:
                hdata[x, y] = (0, 0, 0, 0)
            else:
                # Edge softening
                has_bg_nb = False
                for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < hw and 0 <= ny < hh and bg_mask[nx][ny]:
                        has_bg_nb = True
                        break
                if has_bg_nb:
                    r, g, b, _ = hdata[x, y]
                    brightness = (r + g + b) / 3.0
                    if brightness > 230:
                        alpha = max(10, int(255 * (255 - brightness) / 25.0))
                        hdata[x, y] = (r, g, b, alpha)

    hands_out = os.path.join(hero_dir, "hands_holding_plant.png")
    h_img.save(hands_out, "PNG", optimize=True)
    print(f"Saved {hands_out} ({h_img.size})")

print("All asset processing finished successfully.")
