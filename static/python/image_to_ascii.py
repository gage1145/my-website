from PIL import Image, ImageFilter, ImageOps
from io import BytesIO
from js import document



def resize_image(image, new_width):
    image = ImageOps.exif_transpose(image)
    width, height = image.size
    ratio = height / (2.2 * width)
    new_height = int(new_width * ratio)
    return image.resize((new_width, new_height))

def change_contrast(img, level=100):
    factor = (259 * (level + 255)) / (255 * (259 - level))
    def contrast(c):
        return 128 + factor * (c - 128)
    return img.point(contrast)

def grayify(image, edge_behavior: str):
    print("Edge Behavior = ", edge_behavior)
    if edge_behavior == "edge-none":
        return image.convert("L")
    if edge_behavior == "edge-detect":
        return image.convert("L").filter(ImageFilter.FIND_EDGES)
    if edge_behavior == "edge-enhance":
        return image.convert("L").filter(ImageFilter.EDGE_ENHANCE)

def pixels_to_ascii(image, depth):
    pixels = image.getdata()
    
    if depth == 1:
        ASCII_CHARS = list(" @")
    elif depth == 2:
        ASCII_CHARS = list(" /9@")
    elif depth == 3:
        ASCII_CHARS = list(" ^/([9$@")
    elif depth == 4:
        ASCII_CHARS = list(" .-^</T(f[j9K$M@")
    elif depth == 5:
        ASCII_CHARS = list(" `.-':^;<!/zTJ(if3[5jwk9OK8$0M%@")
    elif depth == 6:
        ASCII_CHARS = list(""" `.-':_^=;><!c*/zsTv)J(Fi{fI31t[ne5Yxja]wqkP9d4pOAKXm8D$Bg0MQ%&@""")
    
    characters = "".join(ASCII_CHARS[p // (256 // len(ASCII_CHARS))] for p in pixels)
    return characters

def convert_image_from_bytes(image_bytes, depth, new_width, contrast, edge_behavior):
    image = Image.open(BytesIO(image_bytes))
    image = resize_image(image, new_width)
    image = change_contrast(image, contrast)
    image = grayify(image, edge_behavior=edge_behavior)
    ascii_data = pixels_to_ascii(image, depth)
    pixel_count = len(ascii_data)
    ascii_image = "\n".join(
        ascii_data[i:i + new_width]
        for i in range(0, pixel_count, new_width)
    )

    return ascii_image

async def run(event=None):
    document.getElementById("ascii-output").textContent = "Processing…"

    file_input = document.getElementById("file-input")
    file = file_input.files.item(0)

    if not file:
        document.getElementById("ascii-output").textContent = "No file selected."
        return

    width = int(document.getElementById("width").value)
    contrast = int(document.getElementById("contrast").value)
    depth = int(document.getElementById("depth").value)
    edge_behavior = document.querySelector('input[name="edge-choice"]:checked').id

    buffer = await file.arrayBuffer()
    image_bytes = bytes(buffer.to_py())

    ascii_img = convert_image_from_bytes(
        image_bytes,
        depth,
        new_width=width,
        contrast=contrast,
        edge_behavior=edge_behavior
    )

    document.getElementById("ascii-output").textContent = ascii_img