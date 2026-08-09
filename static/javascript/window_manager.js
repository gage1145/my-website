const registry = new Map();
const openWindows = new Map();

let zCounter = 100;
let cascadeCount = 0;
let activeId = null;

function windowsLayer() {
    return document.getElementById('windows');
}

function taskbarLayer() {
    return document.getElementById('taskbar-windows');
}

function startBarOffset() {
    const styles = getComputedStyle(document.documentElement);
    const height = parseFloat(styles.getPropertyValue('--startbar-height')) || 28;
    const border = parseFloat(styles.getPropertyValue('--startbar-border-width')) || 2;
    return height + border;
}

export function registerWindow(id, config) {
    registry.set(id, config);
}

export function isWindowOpen(id) {
    return openWindows.has(id);
}

function focusWindow(state) {
    zCounter += 1;
    state.el.style.zIndex = String(zCounter);
    activeId = state.id;
    openWindows.forEach(s => {
        console.log(s.id === state.id, !s.minimized);
        s.taskbarBtn.classList.toggle('active', !(s.id === state.id && !s.minimized));
    });
}

function minimizeWindow(state) {
    state.minimized = true;
    state.el.style.display = 'none';
    state.taskbarBtn.classList.toggle('active', true);
}

function restoreWindow(state) {
    state.minimized = false;
    state.el.style.display = 'flex';
    focusWindow(state);
}

function toggleMaximize(state) {
    if (!state.maximized) {
        state.restoreRect = {
            left: state.el.style.left,
            top: state.el.style.top,
            width: state.el.style.width,
            height: state.el.style.height,
        };
        state.el.style.left = '';
        state.el.style.top = '';
        state.el.style.width = '';
        state.el.style.height = '';
        state.el.classList.add('maximized');
        state.maximized = true;
        state.maximizeBtn.setAttribute('aria-label', 'Restore');
    } else {
        state.el.classList.remove('maximized');
        const rect = state.restoreRect;
        if (rect) {
            state.el.style.left = rect.left;
            state.el.style.top = rect.top;
            state.el.style.width = rect.width;
            state.el.style.height = rect.height;
        }
        state.maximized = false;
        state.maximizeBtn.setAttribute('aria-label', 'Maximize');
    }
    focusWindow(state);
}

function makeDraggable(state) {
    state.titleBarEl.addEventListener('pointerdown', (e) => {
        if (e.target.closest('.title-bar-controls')) return;
        if (state.maximized) return;
        focusWindow(state);

        const startX = e.clientX;
        const startY = e.clientY;
        const rect = state.el.getBoundingClientRect();
        const startLeft = rect.left;
        const startTop = rect.top;

        function onMove(ev) {
            const dx = ev.clientX - startX;
            const dy = ev.clientY - startY;
            const maxLeft = window.innerWidth - 80;
            const maxTop = window.innerHeight - startBarOffset() - 24;
            const newLeft = Math.min(Math.max(startLeft + dx, -rect.width + 80), maxLeft);
            const newTop = Math.min(Math.max(startTop + dy, 0), maxTop);
            state.el.style.left = `${newLeft}px`;
            state.el.style.top = `${newTop}px`;
        }

        function onUp() {
            document.removeEventListener('pointermove', onMove);
            document.removeEventListener('pointerup', onUp);
        }

        document.addEventListener('pointermove', onMove);
        document.addEventListener('pointerup', onUp);
    });
}

function buildWindow(id, config) {
    const template = document.getElementById(`tpl-${config.templateId}`);
    if (!template) {
        console.error(`Missing window template: tpl-${config.templateId}`);
        return null;
    }

    const el = document.createElement('div');
    el.className = 'window desktop-window';
    el.id = `win-${id}`;

    const left = 60 + (cascadeCount % 10) * 28;
    const top = 48 + (cascadeCount % 10) * 28;
    cascadeCount += 1;

    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
    if (config.width) el.style.width = config.width;
    if (config.height) el.style.height = config.height;

    const titleBar = document.createElement('div');
    titleBar.className = 'title-bar';
    titleBar.innerHTML = `
        <div class="title-bar-text">${config.title}</div>
        <div class="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close"></button>
        </div>
    `;

    const body = document.createElement('div');
    body.className = 'window-body window-content';
    body.appendChild(template.content.cloneNode(true));

    el.appendChild(titleBar);
    el.appendChild(body);
    windowsLayer().appendChild(el);

    const taskbarBtn = document.createElement('button');
    taskbarBtn.className = 'taskbar-window-btn';
    taskbarBtn.textContent = config.title;
    taskbarLayer().appendChild(taskbarBtn);

    const state = {
        id,
        config,
        el,
        titleBarEl: titleBar,
        bodyEl: body,
        taskbarBtn,
        minimizeBtn: titleBar.querySelector('[aria-label="Minimize"]'),
        maximizeBtn: titleBar.querySelector('[aria-label="Maximize"]'),
        closeBtn: titleBar.querySelector('[aria-label="Close"]'),
        minimized: false,
        maximized: false,
        restoreRect: null,
    };

    state.minimizeBtn.addEventListener('click', () => minimizeWindow(state));
    state.maximizeBtn.addEventListener('click', () => toggleMaximize(state));
    state.closeBtn.addEventListener('click', () => closeWindow(id));
    taskbarBtn.addEventListener('click', () => {
        if (state.minimized) {
            restoreWindow(state);
        } else if (activeId === state.id) {
            minimizeWindow(state);
        } else {
            focusWindow(state);
        }
    });
    el.addEventListener('pointerdown', () => focusWindow(state));

    makeDraggable(state);

    return state;
}

export function openWindow(id) {
    const existing = openWindows.get(id);
    if (existing) {
        if (existing.minimized) {
            restoreWindow(existing);
        } else {
            focusWindow(existing);
        }
        return;
    }

    const config = registry.get(id);
    if (!config) {
        console.error(`No window registered for id: ${id}`);
        return;
    }

    const state = buildWindow(id, config);
    if (!state) return;

    openWindows.set(id, state);
    focusWindow(state);
    config.onOpen?.(state.bodyEl, state.el);
}

export function closeWindow(id) {
    const state = openWindows.get(id);
    if (!state) return;

    state.config.onClose?.(state.bodyEl, state.el);
    state.el.remove();
    state.taskbarBtn.remove();
    openWindows.delete(id);
    if (activeId === id) activeId = null;
}
