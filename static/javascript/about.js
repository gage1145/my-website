export async function cmdAbout(history) {
    const container = document.createElement("div");
    container.className = "about-output";
    container.textContent = "Hi, I'm Gage Rowden. Welcome to my portfolio site. I am a Data scientist and R&D specialist with a strong foundation in molecular biology and software development. I am experienced in building automated data pipelines, custom R packages, and laboratory systems to streamline diagnostics and research.";
    history.appendChild(container);
}