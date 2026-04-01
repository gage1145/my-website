export function doubleClickToOpen() {
    const shortcuts = document.querySelectorAll('.shortcut');
    shortcuts.forEach(shortcut => {
        shortcut.addEventListener('click', (e) => {
            e.preventDefault();
            var id = shortcut.id;
            var element = document.getElementById(id);
            element.style.backgroundColor = '#000080';
            element.style.color = '#fff';
        });
        shortcut.addEventListener('dblclick', (e) => {
            e.preventDefault();
            window.location.href = shortcut.href;
        });
    });
}