export async function cmdResume(history, printOutput) {
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
        const skillsContainer = document.createElement("div");
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
        printOutput(error);
        // console.error(error);
    }
}