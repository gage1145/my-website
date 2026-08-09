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
    const details = document.createElement("details");
    // wrapper.id = "project-output";

    const summary = document.createElement("summary");
    summary.innerHTML = project.title;
    // textContainer.id = "project-text-container";

    const linkList = document.createElement("li");
    const link = document.createElement("a");
    link.href = project.link;
    link.style = "display: inline-block; width: fit-content;";
    linkList.appendChild(link);

    const description = document.createElement("li");
    description.textContent = project.description;

    const subList = document.createElement("ul");
    subList.appendChild(description);
    subList.appendChild(linkList);

    details.appendChild(summary);
    details.appendChild(subList);

    // const title = document.createElement("span");
    // title.textContent = project.title;

    // const description = document.createElement("span");
    // description.textContent = project.description;
    // description.style = "margin-top: 0;"

    // textContainer.appendChild(link);
    // textContainer.appendChild(description);

    // wrapper.appendChild(textContainer);

    return details;
}
