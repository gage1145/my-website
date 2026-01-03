import { initOscilloscope } from "./static/javascript/oscilloscope.js";
import AudioPlayer from "./static/javascript/audio_player.js";
import { includeHTML } from "./static/javascript/includeHTML.js";
import { loadProjects } from "./static/javascript/projects.js";

document.addEventListener("DOMContentLoaded", () => {
    includeHTML();

    const audioPlayerContainer = document.querySelector(".audio-player");
    if (audioPlayerContainer) {
        new AudioPlayer(".audio-player", [
            { url: "music/10_Speeds_master.mp3", name: "10 Speeds and a Unique Mixing Action" },
            { url: "music/Acceptance.mp3", name: "Acceptance" },
            { url: "music/channel_2_master.mp3", name: "channel_2" },
            { url: "music/collatz1.wav", name: "collatz.wav" },
            { url: "music/Exponential Decay_master.mp3", name: "Exponential Decay" },
            { url: "music/GANYMEDE.wav", name: "GANYMEDE" },
            { url: "music/Generation Loss_master.mp3", name: "Generation Loss" },
            { url: "music/hilbert1.wav", name: "hilbert.wav" },
            { url: "music/Infinite Freeway_master.mp3", name: "Infinite Freeway" },
            { url: "music/newick.mp3", name: "newick" },
            { url: "music/Niche_master.mp3", name: "Niche" },
            { url: "music/Niche_master_80bpm.mp3", name: "Niche - 80bpm" },
            { url: "music/Obliterated into a Million Billion Tiny Little Pieces_master.mp3", name: "Obliterated into a Million Billion Tiny Little Pieces" },
            { url: "music/oscilloscope.mp3", name: "Oscilloscope Demo" },
            { url: "music/perlin1.wav", name: "perlin.wav" },
            { url: "music/Recess is Over_master.mp3", name: "Recess is Over" },
            { url: "music/The Age of Computers.mp3", name: "The Age of Computers" }
        ]);
    }

    const oscilloscopeCanvas = document.getElementById("oscilloscope");
    if (oscilloscopeCanvas) {
        initOscilloscope();
    }

    const projectContainer = document.getElementById("projects");
    if (projectContainer) {
        loadProjects();
    }
});
