import os
import re
import json

AUDIO_EXTENSIONS = {'.mp3', '.wav', '.ogg', '.flac', '.aac'}
MUSIC_DIR = os.path.join('static', 'music')
OUTPUT_FILE = os.path.join('static', 'json', 'music.json')


def clean_title(filename):
    name = os.path.splitext(filename)[0]
    name = re.sub(r'_master', '', name, flags=re.IGNORECASE)
    name = name.replace('_', ' ')
    return name.strip()


files = sorted(
    f for f in os.listdir(MUSIC_DIR)
    if os.path.splitext(f)[1].lower() in AUDIO_EXTENSIONS
)

tracks = [
    {
        'title': clean_title(f),
        'src': f'static/music/{f}',
        'window': 'music-player',
        'largeIcon': 'cd_audio_cd_a-4.png',
    }
    for f in files
]

with open(OUTPUT_FILE, 'w') as fp:
    json.dump(tracks, fp, indent=2)

print(f"Generated {OUTPUT_FILE} with {len(tracks)} tracks.")
