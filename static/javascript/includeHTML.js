export function includeHTML() {
    const elements = document.getElementsByTagName("*");

    for (let i = 0; i < elements.length; i++) {
        const elmnt = elements[i];
        // Quarto/pandoc rewrites unrecognized attributes on bare <div> tags
        // to their "data-" form, so check both.
        const attr = elmnt.hasAttribute("w3-include-html")
            ? "w3-include-html"
            : elmnt.hasAttribute("data-w3-include-html")
                ? "data-w3-include-html"
                : null;
        const file = attr && elmnt.getAttribute(attr);

        if (file) {
            return fetch(file)
                .then(res => {
                    if (!res.ok) throw new Error("Not found");
                    return res.text();
                })
                .then(html => {
                    elmnt.innerHTML = html;
                    elmnt.removeAttribute(attr);
                    return includeHTML();
                })
                .catch(err => {
                    console.error("Include failed:", file, err);
                });
        }
    }

    return Promise.resolve();
}
