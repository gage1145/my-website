function initTaskbarWindow(title) {
    const container = document.getElementById('taskbar-windows');
    const btn = document.createElement('button');
    btn.className = 'taskbar-window-btn';
    btn.textContent = title;
    container.appendChild(btn);

    return {
        setActive(isActive) {
            btn.classList.toggle('active', !isActive);
        },
        onClick(handler) {
            btn.addEventListener('click', handler);
        },
        container
    };
}

export function initMinMax() {
    const threeBody = document.getElementById('body-3-col');
    const centerBar = document.getElementById('center-bar');
    if (!centerBar) return;

    const titleText = document.querySelector('.title-bar-text')?.textContent?.trim() || 'Window';

    const minimizeBtn = document.getElementById('minimize-btn');
    const maximizeBtn = document.getElementById('maximize-btn');
    const closeBtn = document.getElementById('close-btn');
    const windowClosed = localStorage.getItem('window-closed');
    if (windowClosed === 'true') {
        threeBody.remove();
        return;
    }

    const defaultOpacity = getComputedStyle(centerBar).opacity;
    let minimized = defaultOpacity === '0';
    let maximized = !minimized;

    const taskbarEntry = initTaskbarWindow(titleText);

    function setMinimized(state) {
        minimized = state;
        console.log(`Setting minimized: ${state}`);
        centerBar.style.opacity = state ? '0' : defaultOpacity;
        taskbarEntry.setActive(!state);
    }

    function setMaximized(state) {
        maximized = state;
        centerBar.classList.toggle('window-maximized', state);
    }

    function closeWindow() {
        threeBody.remove();
        taskbarEntry.container.remove();
        localStorage.setItem('window-closed', 'true');
    }

    closeBtn?.addEventListener('click', closeWindow);

    minimizeBtn?.addEventListener('click', () => setMinimized(!minimized));
    maximizeBtn?.addEventListener('click', () => setMaximized(!maximized));

    taskbarEntry.onClick(() => setMinimized(!minimized));
}
