import { openWindow } from "./window_manager.js";

function clearShortcutHighlights() {
    document.querySelectorAll('.shortcut').forEach(s => {
        s.style.backgroundColor = '';
        s.style.color = '';
    });
}

export function doubleClickToOpen() {
    document.addEventListener('click', (e) => {
        const shortcut = e.target.closest('.shortcut');
        clearShortcutHighlights();
        if (shortcut) {
            e.preventDefault();
            shortcut.style.backgroundColor = 'rgba(0, 0, 255, 0.15)';
            shortcut.style.color = '#fff';
        }
    });

    document.addEventListener('dblclick', (e) => {
        const shortcut = e.target.closest('.shortcut');
        if (!shortcut) return;
        e.preventDefault();
        const id = shortcut.dataset.window;
        if (id) openWindow(id);
    });
}
