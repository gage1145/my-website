document.addEventListener("DOMContentLoaded", () => {
    const bodyEl = document.body;

    const windowEl = document.createElement('div');
    windowEl.className = 'window';
    windowEl.id = 'body-window';

    const titleBarEl = document.createElement('div');
    titleBarEl.className = 'title-bar';

    const titleBarTextEl = document.createElement('div');
    titleBarTextEl.className = 'title-bar-text';
    titleBarTextEl.textContent = 'Gage Rowden';

    const titleBarControlsEl = document.createElement('div');
    titleBarControlsEl.className = 'title-bar-controls';
    titleBarControlsEl.innerHTML = `
        <button aria-label="Minimize"></button>
        <button aria-label="Maximize"></button>
        <button aria-label="Close"></button>
    `;

    titleBarEl.appendChild(titleBarTextEl);
    titleBarEl.appendChild(titleBarControlsEl);

    const windowBodyEl = document.createElement('div');
    windowBodyEl.className = 'window-body';

    windowEl.appendChild(titleBarEl);
    windowEl.appendChild(windowBodyEl);


    bodyEl.appendChild(windowEl);
});