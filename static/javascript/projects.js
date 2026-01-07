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
    wrapper.className = "project-output";

    // ASCII logo
    const logoContainer = document.createElement("div");
    logoContainer.className = "logo-container";

    const pre = document.createElement("pre");
    pre.className = "ascii-logo";
    pre.textContent = project.ascii_image;

    const link = document.createElement("a");
    link.href = project.link;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.appendChild(pre);

    logoContainer.appendChild(link);

    // Text content
    const textContainer = document.createElement("div");
    textContainer.className = "project-text-container";

    const title = document.createElement("h2");
    title.textContent = project.title;

    const description = document.createElement("p");
    description.textContent = project.description;

    textContainer.appendChild(title);
    textContainer.appendChild(description);

    wrapper.appendChild(logoContainer);
    wrapper.appendChild(textContainer);

    return wrapper;
}
