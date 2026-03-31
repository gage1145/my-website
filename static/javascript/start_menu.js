export function initStartMenu() {
    const startBtn = document.getElementById('start-button');
    const menu = document.getElementById('start-menu');
    const shutdownBtn = document.getElementById('shutdown-btn');
    const overlay = document.getElementById('shutdown-overlay');
    const okBtn = document.getElementById('shutdown-ok');
    const cancelBtn = document.getElementById('shutdown-cancel');
    const closeBtn = document.getElementById('shutdown-close');

    startBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = menu.classList.toggle('open');
        startBtn.classList.toggle('active', isOpen);
    });

    document.addEventListener('click', () => {
        menu.classList.remove('open');
        startBtn.classList.remove('active');
    });

    menu.addEventListener('click', (e) => e.stopPropagation());

    shutdownBtn.addEventListener('click', () => {
        menu.classList.remove('open');
        startBtn.classList.remove('active');
        overlay.classList.add('open');
    });

    function closeDialog() {
        overlay.classList.remove('open');
    }

    cancelBtn.addEventListener('click', closeDialog);
    closeBtn.addEventListener('click', closeDialog);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeDialog();
    });

    okBtn.addEventListener('click', () => {
        const choice = document.querySelector('input[name="sd-choice"]:checked').value;
        closeDialog();
        if (choice === 'restart') {
            location.reload();
        } else {
            const safe = document.getElementById('safe-to-off');
            safe.classList.add('visible');
            safe.addEventListener('click', () => safe.classList.remove('visible'), { once: true });
        }
    });
}
