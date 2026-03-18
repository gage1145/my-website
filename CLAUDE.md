# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Gage Rowden (gagerowden.com), hosted on GitHub Pages. Retro Windows 95/98 aesthetic using the [98.css](https://unpkg.com/98.css) framework.

**No build system.** Pure static HTML/CSS/vanilla JavaScript — files are deployed as-is.

## Architecture

### Data-Driven Pages

Content is stored in JSON and loaded dynamically at runtime:
- `static/json/projects.json` → rendered by `static/javascript/projects.js`
- `static/json/publications.json` → rendered by `static/javascript/publications.js`
- `static/json/resume.json` → rendered by `static/javascript/resume.js`

To add/edit projects, publications, or resume entries, modify the relevant JSON file.

### HTML Composition

Pages use a custom `includeHTML` pattern (`static/javascript/includeHTML.js`) to inject shared HTML snippets at load time via `w3-include-html` attributes. Shared templates live in `templates/`.

### Entry Point

`main.js` is the ES6 module entry point. It imports and initializes all page-specific modules based on what's present on the current page (oscilloscope, audio player, nav toggle, JSON loaders, etc.).

### Utilities

`utilities/` contains standalone interactive tools:
- `mandelbrot.html` — Mandelbrot set explorer (uses p5.js via CDN)
- `harmonograph.html` — Lissajous curve drawing tool
- `image_to_ascii.html` — Image-to-ASCII converter
- `bmg_format.html` — Binary format tool
- `l5r_dice.html` — L5R RPG dice roller

Python utilities (`static/python/`) run **client-side** via PyScript (no server needed).

### Music Player

`music.html` + `static/javascript/audio_player.js` implement a playlist UI. `static/javascript/oscilloscope.js` provides a Web Audio API frequency visualizer. Audio files are in `music/`.

## External Dependencies (CDN only)

- **98.css** — Windows 98 UI components
- **Font Awesome 7.0.1** — icons
- **PyScript 2025.11.2** — runs Python in the browser for utilities
- **p5.js** — used by the Mandelbrot renderer

## Deployment

Push to the `main` branch; GitHub Pages deploys automatically to gagerowden.com (configured via `CNAME`).
