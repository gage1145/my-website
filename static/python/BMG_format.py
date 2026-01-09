import pandas as pd
from js import document, Blob, URL
from io import StringIO

def BMG_format_from_text(csv_text):
    df = pd.read_csv(StringIO(csv_text))
    colnames = df.columns[1:]

    wells = []
    for i in range(1, len(colnames) + 1):
        for j in range(len(df)):
            wells.append(chr(j + 65) + str(i))

    df = df.iloc[:, 1:].melt()
    df["variable"] = wells

    placeholders = []
    x = 0
    previous = df.loc[:, 'value'][0]

    for i in range(len(df)):
        current = df.loc[:, 'value'][i]
        if str(current).lower() == "n":
            placeholders.append("N")
        elif str(current).lower() == "p":
            placeholders.append("P")
        elif str(current).lower() == "b":
            placeholders.append("B")
        else:
            if previous != current:
                x += 1
            placeholders.append("X" + str(x))
        previous = current

    df.insert(1, "placeholders", placeholders)

    output_lines = [
        f"{df.iloc[i, 0]:<4}{df.iloc[i, 1]:<7}{df.iloc[i, 2]}"
        for i in range(len(df))
    ]

    return "\n".join(output_lines)


async def run_bmg(event=None):
    file_input = document.getElementById("file-input")
    file = file_input.files.item(0)

    if not file:
        document.getElementById("bmg-preview").textContent = "No file selected."
        return

    text = await file.text()
    formatted = BMG_format_from_text(text)

    # Show preview
    document.getElementById("bmg-preview").textContent = formatted

    # Create downloadable file
    blob = Blob.new([formatted], {"type": "text/plain"})
    url = URL.createObjectURL(blob)

    download_btn = document.getElementById("download-btn")
    download_btn.disabled = False

    def trigger_download(event=None):
        a = document.createElement("a")
        a.href = url
        a.download = "formatted.txt"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

    download_btn.onclick = trigger_download


