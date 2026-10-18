import os
from collections import deque
from PIL import Image, ImageFilter

artifacts_dir = r"C:\Users\joo\.gemini\antigravity-ide\brain\4ba76add-4c4c-4a98-b304-a7c9b862a731"

images = [
    ("monstera_deliciosa", "monstera_deliciosa_1792334649978.jpg"),
    ("fiddle_leaf_fig", "fiddle_leaf_fig_1792334673234.jpg"),
    ("snake_plant_laurentii", "snake_plant_laurentii_1792334715892.jpg"),
    ("peace_lily", "peace_lily_1792334731965.jpg"),
    ("calathea_orbifolia", "calathea_orbifolia_1792334751525.jpg"),
    ("zz_plant__raven_", "zz_raven_plant_1792334767250.jpg"),
    ("bird_of_paradise", "bird_of_paradise_1792334794896.jpg"),
    ("boston_fern", "boston_fern_1792334810475.jpg"),
    ("string_of_pearls", "string_of_pearls_1792334829283.jpg"),
    ("bonsai_ficus_ginseng", "bonsai_ficus_ginseng_1792334869382.jpg"),
]

output_dir = os.path.join(artifacts_dir, "transparent")
os.makedirs(output_dir, exist_ok=True)

def process_image(input_path, output_path, threshold=228):
    img = Image.open(input_path).convert("RGBA")
    width, height = img.size
    data = img.load()

    # Step 1: BFS from the entire boundary to detect only exterior background pixels
    q = deque()
    visited = set()

    for x in range(width):
        q.append((x, 0))
        q.append((x, height - 1))
        visited.add((x, 0))
        visited.add((x, height - 1))
    for y in range(height):
        q.append((0, y))
        q.append((width - 1, y))
        visited.add((0, y))
        visited.add((width - 1, y))

    bg_mask = [[False] * height for _ in range(width)]

    while q:
        x, y = q.popleft()
        r, g, b, a = data[x, y]
        # Check if brightness / color is background white/off-white
        # studio background is neutral white/light grey (r, g, b close to each other and bright)
        brightness = (r + g + b) / 3.0
        diff = max(abs(r - g), abs(r - b), abs(g - b))

        if brightness >= threshold and diff < 30:
            bg_mask[x][y] = True
            for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                nx, ny = x + dx, y + dy
                if 0 <= nx < width and 0 <= ny < height and (nx, ny) not in visited:
                    visited.add((nx, ny))
                    nr, ng, nb, _ = data[nx, ny]
                    nbright = (nr + ng + nb) / 3.0
                    ndiff = max(abs(nr - ng), abs(nr - nb), abs(ng - nb))
                    if nbright >= threshold and ndiff < 30:
                        q.append((nx, ny))

    # Step 2: Apply alpha to background and feather transition edges
    for x in range(width):
        for y in range(height):
            if bg_mask[x][y]:
                data[x, y] = (0, 0, 0, 0)
            else:
                # Check if this foreground pixel borders a background pixel
                has_bg_neighbor = False
                for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < width and 0 <= ny < height and bg_mask[nx][ny]:
                        has_bg_neighbor = True
                        break

                if has_bg_neighbor:
                    r, g, b, a = data[x, y]
                    brightness = (r + g + b) / 3.0
                    # If this border pixel was partially light background, soften its alpha and desaturate halo
                    if brightness > 200:
                        factor = max(0.1, (255 - brightness) / 55.0)
                        new_a = int(255 * factor)
                        data[x, y] = (r, g, b, new_a)

    img.save(output_path, "PNG", optimize=True)
    print(f"Processed: {os.path.basename(output_path)}")

for key, filename in images:
    src = os.path.join(artifacts_dir, filename)
    dst = os.path.join(output_dir, f"{key}.png")
    process_image(src, dst)

print("\nAll 10 images processed successfully with transparent backgrounds!")
