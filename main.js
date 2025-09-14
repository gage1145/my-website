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
                const container = document.createElement("div");
                container.className = "about-output";
                const textContainer = document.createElement("p");
                aboutText = "Hi, I'm Gage Rowden. Welcome to my portfolio site. I am a Data scientist and R&D specialist with a strong foundation in molecular biology and software development. I am experienced in building automated data pipelines, custom R packages, and laboratory systems to streamline diagnostics and research.";
                textContainer.textContent = aboutText;
                container.appendChild(textContainer);
                history.appendChild(container)
                break;

            case "projects":
                try {
                    const response = await fetch("/static/json/projects.json");
                    const projects = await response.json();

                    if (projects.length === 0) {
                        printOutput("No projects available.");
                    } else {
                        projects.forEach(p => {
                            const container = document.createElement("div");
                            container.className = "project-output mb-4";
                            const textContainer = document.createElement("div");
                            textContainer.className = "project-text-container";

                            // Project Logo
                            if (p.ascii_image) {
                                logoContainer = document.createElement("div");
                                logoContainer.className = "logo-container";
                                const logo = document.createElement("pre");
                                logo.textContent = p.ascii_image;
                                logo.className = "ascii-logo";
                                logoContainer.appendChild(logo)
                                container.appendChild(logoContainer);
                            }

                            // Title
                            const title = document.createElement("h2");
                            title.textContent = p.title;
                            textContainer.appendChild(title);

                            // Description
                            const desc = document.createElement("p");
                            desc.textContent = p.description;
                            textContainer.appendChild(desc);

                            // Link
                            if (p.link) {
                                const link = document.createElement("a");
                                link.href = p.link;
                                link.target = "_blank";
                                link.textContent = "View Project";
                                link.className = "project-link";
                                textContainer.appendChild(link);
                            }

                            container.appendChild(textContainer)
                            history.appendChild(container);
                        });
                    }
                } catch (error) {
                    printOutput("Error fetching projects.");
                }
                break;

            case "publications":
                printOutput("TODO");
                break;

            case "resume":
                printOutput("TODO");
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