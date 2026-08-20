import { openWindow } from "./window_manager.js";

function clearShortcutHighlights() {
    document.querySelectorAll('.shortcut').forEach(s => {
        s.style.backgroundColor = '';
        s.style.color = '';
        s.style.textOverflow = 'ellipsis';
        s.style.overflow = 'hidden';
    });
}

export function doubleClickToOpen() {
    document.addEventListener('click', (e) => {
        const shortcut = e.target.closest('.shortcut');
        clearShortcutHighlights();
        if (shortcut) {
            e.preventDefault();
            shortcut.style.backgroundColor = 'rgba(0, 0, 255, 0.23)';
            shortcut.style.textOverflow = 'ellipsis';
            shortcut.style.overflow = 'visible';
            shortcut.style.textWrap = 'wrap';
        }
    });

    document.addEventListener('dblclick', (e) => {
        const shortcut = e.target.closest('.shortcut');
        if (!shortcut) return;
        // e.preventDefault();
        const id = shortcut.dataset.window;
        if (id) openWindow(id);
    });
}
