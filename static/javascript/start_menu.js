const COLORS = [
    { label: 'Teal',   value: '#008080' },
    { label: 'Navy',   value: '#000080' },
    { label: 'Plum',   value: '#800080' },
    { label: 'Olive',  value: '#808000' },
    { label: 'Maroon', value: '#800000' },
    { label: 'Forest', value: '#1a4a1a' },
    { label: 'Black',  value: '#1a1a1a' },
    { label: 'Wine',   value: '#4a0010' },
];

const PATTERNS = [
    { label: 'None',  value: null },
    { label: 'Dots',  value: 'radial-gradient(circle, rgba(0,0,0,0.35) 1.5px, transparent 1.5px) center/14px 14px' },
    { label: 'Hatch', value: 'repeating-linear-gradient(45deg, transparent 0 4px, rgba(0,0,0,0.25) 4px 5px), repeating-linear-gradient(-45deg, transparent 0 4px, rgba(0,0,0,0.25) 4px 5px)' },
    { label: 'Plaid', value: 'repeating-linear-gradient(0deg, transparent 0 7px, rgba(0,0,0,0.2) 7px 8px), repeating-linear-gradient(90deg, transparent 0 7px, rgba(0,0,0,0.2) 7px 8px)' },
];

function applyBackground(colorValue, patternValue) {
    if (patternValue) {
        document.body.style.background = patternValue + ', ' + colorValue;
    } else {
        document.body.style.background = colorValue;
    }
}

function initClock() {
    const clock = document.getElementById('taskbar-clock');
    function tick() {
        const now = new Date();
        clock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    tick();
    setInterval(tick, 1000);
}

function initWallpaper() {
    const btn = document.getElementById('wallpaper-btn');
    const overlay = document.getElementById('wallpaper-overlay');
    const okBtn = document.getElementById('wallpaper-ok');
    const cancelBtn = document.getElementById('wallpaper-cancel');
    const closeBtn = document.getElementById('wallpaper-close');
    const colorGrid = document.getElementById('color-swatches');
    const patternGrid = document.getElementById('pattern-swatches');

    const saved = JSON.parse(localStorage.getItem('wallpaper') || 'null');
    let selectedColor = saved?.color ?? '#008080';
    let selectedPattern = saved?.pattern ?? null;

    applyBackground(selectedColor, selectedPattern);

    // Build color swatches
    COLORS.forEach(({ label, value }) => {
        const el = document.createElement('div');
        el.className = 'swatch' + (value === selectedColor ? ' selected' : '');
        el.style.background = value;
        el.title = label;
        el.addEventListener('click', () => {
            selectedColor = value;
            colorGrid.querySelectorAll('.swatch').forEach(s => s.classList.remove('selected'));
            el.classList.add('selected');
        });
        colorGrid.appendChild(el);
    });

    // Build pattern swatches
    PATTERNS.forEach(({ label, value }) => {
        const el = document.createElement('div');
        el.className = 'swatch' + (value === selectedPattern ? ' selected' : '');
        if (value) {
            el.style.background = value + ', #808080';
        } else {
            el.style.background = '#808080';
        }
        el.title = label;
        el.addEventListener('click', () => {
            selectedPattern = value;
            patternGrid.querySelectorAll('.swatch').forEach(s => s.classList.remove('selected'));
            el.classList.add('selected');
        });
        patternGrid.appendChild(el);
    });

    btn.addEventListener('click', () => overlay.classList.add('open'));

    function closeDialog() { overlay.classList.remove('open'); }

    okBtn.addEventListener('click', () => {
        applyBackground(selectedColor, selectedPattern);
        localStorage.setItem('wallpaper', JSON.stringify({ color: selectedColor, pattern: selectedPattern }));
        closeDialog();
    });

    cancelBtn.addEventListener('click', closeDialog);
    closeBtn.addEventListener('click', closeDialog);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeDialog(); });
}

function initScreensaver() {
    const el = document.getElementById('screensaver');
    const canvas = document.getElementById('screensaver-canvas');
    const IDLE_MS = 60_000;
    let animId = null;
    let idleTimer = null;

    function buildStars(count) {
        return Array.from({ length: count }, () => ({
            x: Math.random() * canvas.width - canvas.width / 2,
            y: Math.random() * canvas.height - canvas.height / 2,
            z: Math.random() * canvas.width,
            pz: 0,
        }));
    }

    function startSaver() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext('2d');
        const stars = buildStars(200);
        el.classList.add('active');

        function frame() {
            ctx.fillStyle = 'rgba(0,0,0,0.2)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;

            for (const star of stars) {
                star.pz = star.z;
                star.z -= 6;
                if (star.z <= 0) {
                    star.x = Math.random() * canvas.width - cx;
                    star.y = Math.random() * canvas.height - cy;
                    star.z = canvas.width;
                    star.pz = star.z;
                }
                const sx = (star.x / star.z) * cx + cx;
                const sy = (star.y / star.z) * cy + cy;
                const px = (star.x / star.pz) * cx + cx;
                const py = (star.y / star.pz) * cy + cy;
                const brightness = 1 - star.z / canvas.width;
                const size = brightness * 2.5;

                ctx.beginPath();
                ctx.strokeStyle = `rgba(255,255,255,${brightness})`;
                ctx.lineWidth = size;
                ctx.moveTo(px, py);
                ctx.lineTo(sx, sy);
                ctx.stroke();
            }

            animId = requestAnimationFrame(frame);
        }

        frame();
    }

    function stopSaver() {
        el.classList.remove('active');
        cancelAnimationFrame(animId);
        animId = null;
    }

    function resetTimer() {
        clearTimeout(idleTimer);
        if (el.classList.contains('active')) {
            stopSaver();
            return;
        }
        idleTimer = setTimeout(startSaver, IDLE_MS);
    }

    ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'].forEach(ev =>
        document.addEventListener(ev, resetTimer, { passive: true })
    );
    el.addEventListener('click', stopSaver);

    resetTimer();
}

function toggleAds() {
    const leftads = document.getElementById('left-sidebar');
    const rightads = document.getElementById('right-sidebar');
    const hidden = leftads.style.display === 'none';
    leftads.style.display = hidden ? '' : 'none';
    rightads.style.display = hidden ? '' : 'none';
}

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

    document.getElementById('ads-btn').addEventListener('click', () => {
        menu.classList.remove('open');
        startBtn.classList.remove('active');
        toggleAds();
    });

    initClock();
    initWallpaper();
    initScreensaver();
}
