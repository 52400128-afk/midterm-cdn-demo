from pathlib import Path
from PIL import Image
import random

output_dir = Path(__file__).parent / "images"
output_dir.mkdir(exist_ok=True)

sizes = [
    (2400, 1600, "large-photo-1.jpg"),
    (2200, 1500, "large-photo-2.jpg"),
    (2600, 1700, "large-photo-3.jpg"),
]

for width, height, name in sizes:
    path = output_dir / name
    print(f"Generating {path} ({width}x{height})")
    raw = bytes(random.getrandbits(8) for _ in range(width * height * 3))
    img = Image.frombytes("RGB", (width, height), raw)
    img.save(path, quality=95)
    print(f"Saved {path} ({path.stat().st_size // 1024}KB)")
