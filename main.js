import { cmdAbout } from "./static/javascript/about.js";
import { cmdProjects } from "./static/javascript/projects.js";
import { cmdResume } from "./static/javascript/resume.js";

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
                printOutput("Available commands:\n - help\n - about\n - projects\n - publications\n - resume\n - weather\n - clear");
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

            case "resume":
                await cmdResume(history, printOutput);
                break;

            case "weather":
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