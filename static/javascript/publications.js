export async function loadPublications() {
    const container = document.getElementById("publications");
    if (!container) return;

    try {
        const response = await fetch("./static/json/publications.json");
        if (!response.ok) {
            throw new Error("Failed to load publications.json");
        }

        const publications = await response.json();

        publications
            .sort((a, b) => (b.Year ?? 0) - (a.Year ?? 0))
            .forEach(pub => {
                container.appendChild(createPublication(pub));
            });

    } catch (err) {
        console.error(err);
        container.textContent = "Error loading publications.";
    }
}

function createPublication(pub) {
    const wrapper = document.createElement("div");
    wrapper.className = "publication";

    const text = document.createElement("div");
    text.className = "publication-text";

    const link = document.createElement("a");
    link.href = pub.Link

    const title = document.createElement("h2");
    title.textContent = pub.Title;

    link.appendChild(title);

    const authors = document.createElement("div");
    authors.textContent = pub.Authors?.trim() ?? "";

    const journal = document.createElement("div");
    journal.textContent = formatJournal(pub);

    text.appendChild(link);
    text.appendChild(authors);
    text.appendChild(journal);

    wrapper.appendChild(text);
    return wrapper;
}

function formatJournal(pub) {
    const parts = [];

    if (pub.Publication) parts.push(pub.Publication);
    if (pub.Volume) parts.push(`Vol. ${pub.Volume}`);
    if (pub.Number) parts.push(`No. ${pub.Number}`);
    if (pub.Pages) parts.push(`pp. ${pub.Pages}`);
    if (pub.Year) parts.push(`(${pub.Year})`);

    return parts.join(" · ");
}

