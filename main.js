import { give_head } from "./static/javascript/give_head.js";
import { initOscilloscope } from "./static/javascript/oscilloscope.js";
import AudioPlayer from "./static/javascript/audio_player.js";
import { loadProjects } from "./static/javascript/projects.js";
import { loadResume } from "./static/javascript/resume.js";
import { loadPublications } from "./static/javascript/publications.js";
import { initImageToAscii } from "./static/javascript/image_to_ascii.js";
import { initMandelbrot, destroyMandelbrot } from "./static/javascript/mandelbrot.js";
import { initHarmonograph, destroyHarmonograph } from "./static/javascript/harmonograph.js";
import { initStartMenu } from "./static/javascript/start_menu.js";
import { initFileExplorer } from "./static/javascript/file_explorer.js";
import { registerWindow } from "./static/javascript/window_manager.js";
import { doubleClickToOpen } from "./static/javascript/double_click.js";

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
    give_head();

    registerWindow('home', {
        title: 'About Me',
        templateId: 'home',
        width: '480px',
        height: '520px',
    });

    registerWindow('projects', {
        title: 'Projects',
        templateId: 'projects',
        width: '480px',
        height: '420px',
        onOpen: () => loadProjects(),
    });

    registerWindow('resume', {
        title: 'Resume',
        templateId: 'resume',
        width: '560px',
        height: '600px',
        onOpen: () => loadResume(),
    });

    registerWindow('publications', {
        title: 'Publications',
        templateId: 'publications',
        width: '520px',
        height: '480px',
        onOpen: () => loadPublications(),
    });

    registerWindow('music', {
        title: 'Music',
        templateId: 'music',
        width: '480px',
        height: '560px',
        onOpen: () => {
            new AudioPlayer('#music-player');
            initOscilloscope();
        },
        onClose: (bodyEl) => {
            bodyEl.querySelectorAll('audio').forEach(a => a.pause());
        },
    });

    registerWindow('utilities', {
        title: 'Utilities',
        templateId: 'utilities',
        width: '360px',
        height: '220px',
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
        height: '480px',
        onOpen: (bodyEl) => initFileExplorer(bodyEl),
    });

    initStartMenu();
    doubleClickToOpen();
});
