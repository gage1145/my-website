export async function loadResume() {
    const container = document.getElementById("resume");
    if (!container) return;

    try {
        const response = await fetch("./static/json/resume.json");
        if (!response.ok) {
            throw new Error("Failed to load resume.json");
        }

        const [resume] = await response.json();

        container.appendChild(createResume(resume));

    } catch (err) {
        console.error(err);
        container.textContent = "Error loading resume.";
    }
}

function createResume(data) {

    const resume = document.createElement("div");
    resume.className = "resume";

    const wrapper = document.createElement("div");
    wrapper.className = "resume-container";

    wrapper.appendChild(createContact(data.contact));
    wrapper.appendChild(createSummary(data.summary));
    wrapper.appendChild(createExperience(data.experience));
    wrapper.appendChild(createSkills(data.skills));
    wrapper.appendChild(createEducation(data.education));

    resume.appendChild(wrapper);

    return wrapper;
}

function createContact(contact) {
    const section = document.createElement("div");
    section.className = "resume-contact";

    const p = document.createElement("p");

    p.innerHTML = `
        ${contact.phone} · 
        <a href="mailto:${contact.email}">${contact.email}</a> ·
        <a href="${contact.github}" target="_blank">GitHub</a> ·
        <a href="${contact.orcid}" target="_blank">ORCID</a> ·
        <a href="${contact.linkedin}" target="_blank">LinkedIn</a>
    `;

    section.appendChild(p);
    return section;
}

function createSummary(text) {
    const section = document.createElement("div");
    section.className = ("resume-summary");

    const h3 = document.createElement("h3");
    h3.textContent = "Summary";

    const p = document.createElement("p");
    p.textContent = text;

    section.appendChild(h3);
    section.appendChild(p);

    return section;
}

function createExperience(experience) {
    const section = document.createElement("div");
    section.className = ("resume-experience");

    const h3 = document.createElement("h3");
    h3.textContent = "Experience";
    section.appendChild(h3);

    experience.forEach(role => {
        const block = document.createElement("div");

        const title = document.createElement("strong");
        title.className = "job-title";
        title.textContent = `${role.title} — ${role.organization}`;

        const date = document.createElement("div");
        date.textContent = role.date;

        const ul = document.createElement("ul");
        role.highlights.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            ul.appendChild(li);
        });

        block.appendChild(title);
        block.appendChild(date);
        block.appendChild(ul);

        section.appendChild(block);
    });

    return section;
}

function createSkills(skills) {
    const section = document.createElement("div");
    section.className = "resume-skills-container";

    const h3 = document.createElement("h3");
    h3.textContent = "Skills";

    const ul = document.createElement("ul");
    skills.forEach(skill => {
        const li = document.createElement("li");
        li.textContent = skill;
        ul.appendChild(li);
    });

    section.appendChild(h3);
    section.appendChild(ul);

    return section;
}

function createEducation(education) {
    const section = document.createElement("div");
    section.className = ("resume-education");

    const h3 = document.createElement("h3");
    h3.textContent = "Education";
    section.appendChild(h3);

    education.forEach(edu => {
        const p = document.createElement("p");
        p.textContent = `${edu.degree} — ${edu.university} (${edu.year})`;
        section.appendChild(p);
    });

    return section;
}

