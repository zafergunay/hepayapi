"""Turn the brand JPEG into web assets.

Produces a transparent lockup plus a light-on-dark recolour, because the site
header sits on the dark hero film at the top of the page and on the light
canvas once scrolled — one baked-in colour cannot serve both.
"""
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "logo.jpeg")
BRAND = os.path.join(ROOT, "public", "brand")
APP = os.path.join(ROOT, "src", "app")

WHITE = 255
# JPEG leaves the "white" paper around 248-254 and rings high-contrast edges
# with blocky artefacts. A linear alpha ramp turns that ringing into a visible
# halo once the art is recoloured white and placed on the dark header, so
# coverage is clamped instead: solid below OPAQUE_AT, gone above CLEAR_AT, with
# a short ramp between for the genuine anti-aliased edge.
OPAQUE_AT = 200
CLEAR_AT = 240
ACCENT_BRIGHT = (0x5B, 0x96, 0xF5)  # matches --color-accent-bright
GRAPHITE = (0x0A, 0x14, 0x24)


def to_transparent(img):
    """Recover straight alpha from art that was flattened onto white paper."""
    img = img.convert("RGB")
    w, h = img.size
    px = img.load()
    out = Image.new("RGBA", (w, h))
    op = out.load()
    ramp = CLEAR_AT - OPAQUE_AT

    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            # The darkest channel drives coverage, so saturated blue stays fully
            # opaque instead of going ghostly.
            m = min(r, g, b)
            if m >= CLEAR_AT:
                op[x, y] = (0, 0, 0, 0)
                continue
            a = 255 if m <= OPAQUE_AT else (CLEAR_AT - m) * 255 // ramp
            f = a / 255.0
            # Un-composite: C = a*Csrc + (1-a)*white  =>  Csrc = (C - white*(1-a))/a
            op[x, y] = (
                int(max(0, min(255, (r - WHITE * (1 - f)) / f))),
                int(max(0, min(255, (g - WHITE * (1 - f)) / f))),
                int(max(0, min(255, (b - WHITE * (1 - f)) / f))),
                a,
            )
    return out


def to_light(img):
    """Navy -> white, brand blue -> the site's bright accent."""
    img = img.copy()
    px = img.load()
    for y in range(img.height):
        for x in range(img.width):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
            # Navy lands near 40, the brand blue near 89 — split between them so
            # the blue "A" keeps its colour instead of washing out to white.
            px[x, y] = (255, 255, 255, a) if lum < 62 else (*ACCENT_BRIGHT, a)
    return img


def trim(img, pad=4):
    box = img.getbbox()
    if not box:
        return img
    l, t, r, b = box
    return img.crop((max(0, l - pad), max(0, t - pad),
                     min(img.width, r + pad), min(img.height, b + pad)))


os.makedirs(BRAND, exist_ok=True)
full = trim(to_transparent(Image.open(SRC)))

# The tagline strip is unreadable at header size, so the compact lockup keeps
# only the HEPA wordmark and the YAPI rule beneath it.
compact = trim(full.crop((0, 0, full.width, int(full.height * 0.78))))

for name, im in (("hepa-logo-full", full), ("hepa-logo", compact)):
    im.save(os.path.join(BRAND, f"{name}.png"), optimize=True)
    to_light(im).save(os.path.join(BRAND, f"{name}-light.png"), optimize=True)
    print(f"{name}: {im.size}")

# App icon: the blue "A" counter-mark alone, on the site's dark canvas. The
# wordmark is illegible at 32px, the mark is not.
light = to_light(compact)
mark = trim(light.crop((int(light.width * 0.76), 0, light.width, int(light.height * 0.72))), pad=0)

SIZE = 512
inner = SIZE - int(SIZE * 0.19) * 2
scale = min(inner / mark.width, inner / mark.height)
mark = mark.resize((round(mark.width * scale), round(mark.height * scale)), Image.LANCZOS)

icon = Image.new("RGBA", (SIZE, SIZE), (*GRAPHITE, 255))
icon.paste(mark, ((SIZE - mark.width) // 2, (SIZE - mark.height) // 2), mark)
icon.save(os.path.join(APP, "icon.png"), optimize=True)
icon.resize((180, 180), Image.LANCZOS).save(os.path.join(APP, "apple-icon.png"), optimize=True)
print("icon:", icon.size)

for f in sorted(os.listdir(BRAND)):
    print(f"  {f}: {os.path.getsize(os.path.join(BRAND, f)) // 1024}KB")
