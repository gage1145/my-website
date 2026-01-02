import { cmdAbout } from "./static/javascript/about.js";
import { cmdProjects } from "./static/javascript/projects.js";
import { cmdResume } from "./static/javascript/resume.js";
import { initOscilloscope } from "./static/javascript/oscilloscope.js";
import AudioPlayer from "./static/javascript/audio_player.js";

document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("command-input");
    const history = document.getElementById("history");

    input.addEventListener("keydown", async function(event) {
        if (event.key === "Enter") {
            const command = input.value.trim().toLowerCase();
            if (command) {
                // Show the entered command in history
                const commandLine = document.createElement("div");
                commandLine.className = "input-line";
                commandLine.innerHTML = `<span class="user">visitor</span><span class="host">@gagerowden.com</span><span>:~$ ${command}</span>`;
                history.appendChild(commandLine);

                // Handle command
                await handleCommand(command);

                input.value = "";
                window.scrollTo(0, document.body.scrollHeight);
            }
        }
    });

    async function handleCommand(cmd) {
        switch(cmd) {
            case "help":
                printOutput(
"Available commands:\n\
- im: Enter interactive mode\n\
- help: list available commands\n\
- about: a summary of my professional career\n\
- projects: list projects\n\
- publications: list publications\n\
- cv: print resume\n\
- weather: TODO\n\
- clear"
                );
                break;

            case "about":
                cmdAbout(history);
                break;

            case "projects":
                await cmdProjects(history, printOutput);
                break;

            case "publications":
                printOutput("TODO");
                break;

            case "cv":
                await cmdResume(history, printOutput);
                break;

            case "weather":
                printOutput("TODO");
                break;

            case "im":
                printOutput("TODO");
                break;

            case "clear":
                history.innerHTML = "";
                break;

            default:
                printOutput(`Command not found: ${cmd}`);
        }
    }

    function printOutput(text) {
        const outputLine = document.createElement("pre");
        outputLine.className = "output";
        outputLine.textContent = text;
        history.appendChild(outputLine);
    }
});

// Audio Player
const audioPlayer = new AudioPlayer('.audio-player', [
    { url: 'music/10_Speeds_master.mp3', name: '10 Speeds and a Unique Mixing Action' },
    { url: 'music/Acceptance.mp3', name: 'Acceptance' },
    { url: 'music/channel_2_master.mp3', name: 'channel_2' },
    { url: 'music/collatz1.wav', name: 'collatz.wav' },
    { url: 'music/Exponential Decay_master.mp3', name: 'Exponential Decay' },
    { url: 'music/GANYMEDE.WAV', name: 'GANYMEDE' },
    { url: 'music/Generation Loss_master.mp3', name: 'Generation Loss' },
    { url: 'music/hilbert1.wav', name: 'hilbert.wav' },
    { url: 'music/Infinite Freeway_master.mp3', name: 'Infinite Freeway' },
    { url: 'music/newick.mp3', name: 'newick' },
    { url: 'music/Niche_master.mp3', name: 'Niche' },
    { url: 'music/Niche_master_80bpm.mp3', name: 'Niche - 80bpm' },
    { url: 'music/Obliterated into a Million Billion Tiny Little Pieces_master.mp3', name: 'Obliterated into a Million Billion Tiny Little Pieces' },
    { url: 'music/oscilloscope.mp3', name: 'Oscilloscope Demo' },
    { url: 'music/perlin1.wav', name: 'perlin.wav' },
    { url: 'music/Recess is Over_master.mp3', name: 'Recess is Over' },
    { url: 'music/The Age of Computers.mp3', name: 'The Age of Computers' },
]);

// Oscilloscope
document.addEventListener("DOMContentLoaded", () => {
    initOscilloscope();
});