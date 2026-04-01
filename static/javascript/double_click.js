function clearShortcutHighlights() {
    document.querySelectorAll('.shortcut').forEach(s => {
        s.style.backgroundColor = '';
        s.style.color = '';
    });
}

export function doubleClickToOpen() {
    const shortcuts = document.querySelectorAll('.shortcut');
    shortcuts.forEach(shortcut => {
        shortcut.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            clearShortcutHighlights();
            shortcut.style.backgroundColor = '#000080';
            shortcut.style.color = '#fff';
        });
        shortcut.addEventListener('dblclick', (e) => {
            e.preventDefault();
            window.location.href = shortcut.href;
        });
    });

    document.addEventListener('click', clearShortcutHighlights);
}