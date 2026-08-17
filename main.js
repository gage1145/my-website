import { initOscilloscope } from "./static/javascript/oscilloscope.js";
import AudioPlayer from "./static/javascript/audio_player.js";
import { initImageToAscii } from "./static/javascript/image_to_ascii.js";
import { initMandelbrot, destroyMandelbrot } from "./static/javascript/mandelbrot.js";
import { initHarmonograph, destroyHarmonograph } from "./static/javascript/harmonograph.js";
import { initStartMenu } from "./static/javascript/start_menu.js";
import { initFileExplorer } from "./static/javascript/file_explorer.js";
import { registerWindow } from "./static/javascript/window_manager.js";
import { doubleClickToOpen } from "./static/javascript/double_click.js";
import { openWindow } from "./static/javascript/window_manager.js";

function wireFileInputDisplay(container) {
    const fileInput = container.querySelector('#file-input');
    const fileNameDisplay = container.querySelector('#file-name-display');
    if (!fileInput || !fileNameDisplay) return;
    fileInput.addEventListener('change', () => {
        fileNameDisplay.value = fileInput.files[0] ? fileInput.files[0].name : 'No file selected';
    });
}

// PyScript may still be downloading/initializing the first time a utility
// window is opened, so its py-script-exposed init functions might not be on
// `window` yet. Poll briefly instead of silently no-op-ing.
function callWhenReady(fnName, tries = 100, intervalMs = 200) {
    const fn = window[fnName];
    if (typeof fn === 'function') {
        fn();
        return;
    }
    if (tries <= 0) {
        console.warn(`${fnName} was never registered by PyScript.`);
        return;
    }
    setTimeout(() => callWhenReady(fnName, tries - 1, intervalMs), intervalMs);
}

document.addEventListener("DOMContentLoaded", () => {
    registerWindow('home', {
        title: 'Welcome',
        templateId: 'home',
        width: '480px',
        height: '520px',
    });

    registerWindow('projects', {
        title: 'Projects',
        templateId: 'explorer',
        width: '640px',
        height: '420px',
        onOpen: (bodyEl) => initFileExplorer(bodyEl, 'projects'),
    });

    registerWindow('resume', {
        title: 'Resume',
        templateId: 'resume',
        width: '560px',
        height: '600px',
    });

    registerWindow('publications', {
        title: 'Publications',
        templateId: 'explorer',
        width: '640px',
        height: '420px',
        onOpen: (bodyEl) => initFileExplorer(bodyEl, 'publications'),
    });

    registerWindow('music', {
        title: 'Music',
        templateId: 'explorer',
        width: '640px',
        height: '420px',
        onOpen: (bodyEl) => initFileExplorer(bodyEl, 'music'),
    })

    registerWindow('music-player', {
        title: 'Music Player',
        templateId: 'music-player',
        width: '700px',
        height: '560px',
        onOpen: async (bodyEl) => {
            const tracks = await fetch('static/json/music.json').then(r => r.json());
            const ul = bodyEl.querySelector('.tree-view details ul');
            ul.innerHTML = tracks.map(t => `<li><a href="${t.src}">${t.title}</a></li>`).join('\n            ');
            new AudioPlayer('#music-player');
            initOscilloscope();
        },
        onClose: (bodyEl) => {
            bodyEl.querySelectorAll('audio').forEach(a => a.pause());
        },
    });

    registerWindow('utilities', {
        title: 'Utilities',
        templateId: 'explorer',
        width: '640px',
        height: '420px',
        onOpen: (bodyEl) => initFileExplorer(bodyEl, 'utilities'),
    });

    registerWindow('mandelbrot', {
        title: 'Mandelbrot Explorer',
        templateId: 'mandelbrot',
        width: '560px',
        height: '660px',
        onOpen: (bodyEl) => initMandelbrot(bodyEl),
        onClose: () => destroyMandelbrot(),
    });

    registerWindow('harmonograph', {
        title: 'Harmonograph',
        templateId: 'harmonograph',
        width: '560px',
        height: '680px',
        onOpen: (bodyEl) => initHarmonograph(bodyEl),
        onClose: () => destroyHarmonograph(),
    });

    registerWindow('image-to-ascii', {
        title: 'ASCII Image Converter',
        templateId: 'image-to-ascii',
        width: '560px',
        height: '620px',
        onOpen: (bodyEl) => {
            wireFileInputDisplay(bodyEl);
            initImageToAscii();
            callWhenReady('imageToAsciiInit');
        },
    });

    registerWindow('bmg-format', {
        title: 'BMG CSV Formatter',
        templateId: 'bmg-format',
        width: '480px',
        height: '440px',
        onOpen: (bodyEl) => wireFileInputDisplay(bodyEl),
    });

    registerWindow('l5r-dice', {
        title: 'L5R Dice Roller',
        templateId: 'l5r-dice',
        width: '560px',
        height: '640px',
        onOpen: () => callWhenReady('l5rDiceInit'),
    });

    registerWindow('explorer', {
        title: 'File Explorer',
        templateId: 'explorer',
        width: '640px',
        height: '420px',
        onOpen: (bodyEl) => initFileExplorer(bodyEl),
    });

    initStartMenu();
    doubleClickToOpen();

    // Open the welcome window on first page load.
    if (!localStorage.getItem('welcome-seen')) {
        localStorage.setItem('welcome-seen', true);
        openWindow('home');
    }
});
