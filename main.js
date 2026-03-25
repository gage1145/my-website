import { give_head } from "./static/javascript/give_head.js";
import { initOscilloscope } from "./static/javascript/oscilloscope.js";
import AudioPlayer from "./static/javascript/audio_player.js";
import { includeHTML } from "./static/javascript/includeHTML.js";
import { loadProjects } from "./static/javascript/projects.js";
import { loadResume } from "./static/javascript/resume.js";
import { loadPublications } from "./static/javascript/publications.js";
import { initImageToAscii } from "./static/javascript/image_to_ascii.js";
// import { toggleSidenav } from "./static/javascript/toggle_sidenav.js";

function setActiveNavTab() {
    const path = window.location.pathname;
    const tabs = document.querySelectorAll('menu[role="tablist"] li[role="tab"]');
    tabs.forEach(tab => {
        const href = tab.querySelector("a")?.getAttribute("href");
        const isHome = (href === "./" || href === "/") &&
            (path === "/" || path === "" || path.endsWith("/index.html"));
        const isUtilities = href === "utilities.html" && path.includes("utilities");
        const isMatch = !isHome && !isUtilities && href && path.endsWith(href);
        tab.setAttribute("aria-selected", (isHome || isUtilities || isMatch) ? "true" : "false");
    });
}

document.addEventListener("DOMContentLoaded", () => {

    // Load Head Elements
    give_head();
    
    includeHTML().then(setActiveNavTab);

    const musicPlayer = document.getElementById("music-player");
    if (musicPlayer) {
        new AudioPlayer("#music-player");
    }

    const oscilloscopeCanvas = document.getElementById("oscilloscope");
    if (oscilloscopeCanvas) {
        initOscilloscope();
    }

    const projectContainer = document.getElementById("projects");
    if (projectContainer) {
        loadProjects();
    }

    const resumeContainer = document.getElementById("resume");
    if (resumeContainer) {
        loadResume();
    }

    const publicationContainer = document.getElementById("publications");
    if (publicationContainer) {
        loadPublications();
    }

    const fileInput = document.getElementById('file-input')
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            const fileName = this.files[0] ? this.files[0].name : 'No file selected';
            document.getElementById('file-name-display').value = fileName;
        });
    }

    const imageToAscii = document.getElementById("image-to-ascii");
    if (imageToAscii) {
        initImageToAscii();
    }

    // const hamburgerMenu = document.getElementById("hamburger");
    // hamburgerMenu.addEventListener("click", () => {
    //     toggleSidenav();
    // })
});
