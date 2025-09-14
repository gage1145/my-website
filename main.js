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
                try {
                    const response = await fetch("/static/json/resume.json");
                    const resume = await response.json();
                    const data = resume[0]; 

                    const container = document.createElement("div");
                    container.className = "resume-container";

                    // Contact Info
                    const contactContainer = document.createElement("div");
                    contactContainer.className = "resume-contact";
                    const contHeader = document.createElement("h3");
                    contHeader.textContent = "Contact Information";
                    contactContainer.appendChild(contHeader);
                    const contInfo = document.createElement("p");
                    contInfo.innerHTML = `
                        ${data.contact.phone}
                        | <a href="mailto:${data.contact.email}">${data.contact.email}</a>
                        | <a href="${data.contact.github}" target="_blank">GitHub</a>
                        | <a href="${data.contact.orcid}" target="_blank">ORCID</a>
                        | <a href="${data.contact.linkedin}" target="_blank">LinkedIn</a>
                    `;
                    contactContainer.appendChild(contInfo);
                    container.appendChild(contactContainer);

                    // Summary
                    const summaryContainer = document.createElement("div");
                    const sumHeader = document.createElement("h3");
                    sumHeader.textContent = "Professional Summary";
                    summaryContainer.appendChild(sumHeader);

                    const summary = document.createElement("p");
                    summary.className = "resume-summary";
                    summary.textContent = data.summary;
                    summaryContainer.appendChild(summary);
                    
                    container.appendChild(summaryContainer);

                    // Experience
                    const experienceContainer = document.createElement("div");
                    const expHeader = document.createElement("h3");
                    expHeader.textContent = "Experience";
                    experienceContainer.appendChild(expHeader);

                    data.experience.forEach(job => {
                        const jobDiv = document.createElement("div");
                        jobDiv.className = "resume-job";

                        const title = document.createElement("h4");
                        title.textContent = `${job.title} — ${job.organization} (${job.date})`;
                        jobDiv.appendChild(title);

                        const highlights = document.createElement("ul");
                        job.highlights.forEach(h => {
                            const li = document.createElement("li");
                            li.textContent = h;
                            highlights.appendChild(li);
                        });
                        jobDiv.appendChild(highlights);

                        experienceContainer.appendChild(jobDiv);
                    });
                    container.appendChild(experienceContainer);

                    // Skills
                    skillsContainer = document.createElement("div");
                    skillsContainer.className = "resume-skills-container";
                    const skillsHeader = document.createElement("h3");
                    skillsHeader.textContent = "Skills";
                    container.appendChild(skillsHeader);
                    skillsContainer.appendChild(skillsHeader);

                    const skillsList = document.createElement("ul");
                    data.skills.forEach(skill => {
                        const li = document.createElement("li");
                        li.textContent = skill;
                        skillsList.appendChild(li);
                    });
                    skillsContainer.appendChild(skillsList);
                    container.appendChild(skillsContainer);

                    // Education
                    const educationContainer = document.createElement("div");
                    const eduHeader = document.createElement("h3");
                    eduHeader.textContent = "Education";
                    educationContainer.appendChild(eduHeader);

                    data.education.forEach(ed => {
                        const eduDiv = document.createElement("div");
                        eduDiv.className = "resume-edu";
                        eduDiv.textContent = `${ed.degree}, ${ed.university} (${ed.year})`;
                        educationContainer.appendChild(eduDiv);
                    });
                    container.appendChild(educationContainer);

                    history.appendChild(container);

                } catch (error) {
                    printOutput("Error getting resume.");
                    console.error(error);
                }
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