export async function loadProjects() {
    const container = document.getElementById("projects");
    if (!container) return;

    try {
        const response = await fetch("./static/json/projects.json");
        if (!response.ok) {
            throw new Error("Failed to load projects.json");
        }

        const projects = await response.json();

        projects.forEach(project => {
            container.appendChild(createProjectElement(project));
        });

    } catch (err) {
        console.error(err);
        container.textContent = "Error loading projects.";
    }
}

function createProjectElement(project) {
    const wrapper = document.createElement("div");
    wrapper.id = "project-output";

    const textContainer = document.createElement("div");
    textContainer.id = "project-text-container";

    const link = document.createElement("a");
    link.href = project.link;
    link.style = "display: inline-block; width: fit-content;";

    const title = document.createElement("h3");
    title.textContent = project.title;

    link.appendChild(title);

    const description = document.createElement("p");
    description.textContent = project.description;
    description.style = "margin-top: 0;"

    textContainer.appendChild(link);
    textContainer.appendChild(description);

    wrapper.appendChild(textContainer);

    return wrapper;
}
