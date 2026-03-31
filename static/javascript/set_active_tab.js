export function setActiveNavTab() {
    const path = window.location.pathname;
    const tabs = document.querySelectorAll('menu[role="tablist"] li[role="tab"]');
    tabs.forEach(tab => {
        const href = tab.querySelector("a")?.getAttribute("href");
        const isHome = (href === "/" || href === "./") && (path === "/" || path === "");
        const isMatch = href && !isHome && path.includes(href);
        tab.setAttribute("aria-selected", (isHome || isMatch) ? "true" : "false");
    });
}