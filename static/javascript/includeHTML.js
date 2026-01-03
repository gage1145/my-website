export function includeHTML() {
    const elements = document.getElementsByTagName("*");

    for (let i = 0; i < elements.length; i++) {
        const elmnt = elements[i];
        const file = elmnt.getAttribute("w3-include-html");

        if (file) {
            fetch(file)
                .then(res => {
                    if (!res.ok) throw new Error("Not found");
                    return res.text();
                })
                .then(html => {
                    elmnt.innerHTML = html;
                    elmnt.removeAttribute("w3-include-html");
                    includeHTML();
                })
                .catch(err => {
                    console.error("Include failed:", file, err);
                });

            return;
        }
    }
}
