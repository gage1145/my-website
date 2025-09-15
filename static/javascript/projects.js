export async function cmdProjects(history, printOutput) {
    try {
        const response = await fetch("./static/json/projects.json");
        const projects = await response.json();

        if (projects.length === 0) {
            printOutput("No projects available.");
        } else {
            projects.forEach(p => {
                const container = document.createElement("div");
                container.className = "project-output";
                const textContainer = document.createElement("div");
                textContainer.className = "project-text-container";

                if (p.ascii_image) {
                    const logoContainer = document.createElement("div");
                    logoContainer.className = "logo-container";
                    const logo = document.createElement("pre");
                    logo.textContent = p.ascii_image;
                    logo.className = "ascii-logo";
                    logoContainer.appendChild(logo);
                    container.appendChild(logoContainer);
                }

                const title = document.createElement("h2");
                title.textContent = p.title;
                textContainer.appendChild(title);

                const desc = document.createElement("p");
                desc.textContent = p.description;
                textContainer.appendChild(desc);

                if (p.link) {
                    const link = document.createElement("a");
                    link.href = p.link;
                    link.target = "_blank";
                    link.textContent = "View Project";
                    link.className = "project-link";
                    textContainer.appendChild(link);
                }

                container.appendChild(textContainer);
                history.appendChild(container);
            });
        }
    } catch (error) {
        printOutput("Error fetching projects.");
    }
}