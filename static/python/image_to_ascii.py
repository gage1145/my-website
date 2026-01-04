from PIL import Image
from io import BytesIO
from js import document



def resize_image(image, new_width=100):
    width, height = image.size
    ratio = height / (2.8 * width)
    new_height = int(new_width * ratio)
    return image.resize((new_width, new_height))

def change_contrast(img, level=100):
    factor = (259 * (level + 255)) / (255 * (259 - level))
    def contrast(c):
        return 128 + factor * (c - 128)
    return img.point(contrast)

def grayify(image):
    return image.convert("L")

def pixels_to_ascii(image, simple=True):
    pixels = image.getdata()
    if simple:
        ASCII_CHARS = list("@#$%?*+;:,. ")[::-1]
        characters = "".join(ASCII_CHARS[p // 22] for p in pixels)
    else:
        ASCII_CHARS = list("$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft|(1[?-_+~i!lI;:,^'. ")[::-1]
        characters = "".join(ASCII_CHARS[p // 5] for p in pixels)
    return characters

def convert_image_from_bytes(image_bytes, new_width=100, contrast=100, simple=True):
    image = Image.open(BytesIO(image_bytes))

    ascii_data = pixels_to_ascii(
        grayify(
            change_contrast(
                resize_image(image, new_width=new_width),
                contrast
            )
        ),
        simple=simple
    )

    pixel_count = len(ascii_data)
    ascii_image = "\n".join(
        ascii_data[i:i + new_width]
        for i in range(0, pixel_count, new_width)
    )

    return ascii_image

async def run(event=None):
    document.getElementById("output").textContent = "Processing…"

    file_input = document.getElementById("upload")
    file = file_input.files.item(0)

    if not file:
        document.getElementById("output").textContent = "No file selected."
        return

    width = int(document.getElementById("width").value)
    contrast = int(document.getElementById("contrast").value)
    simple = document.getElementById("simple").checked

    buffer = await file.arrayBuffer()
    image_bytes = bytes(buffer.to_py())

    ascii_img = convert_image_from_bytes(
        image_bytes,
        new_width=width,
        contrast=contrast,
        simple=simple
    )

    document.getElementById("output").textContent = ascii_img