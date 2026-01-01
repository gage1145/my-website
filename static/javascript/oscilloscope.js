export function initOscilloscope() {
    const canvas = document.getElementById("oscilloscope");
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = canvas.clientWidth * dpr;
        canvas.height = canvas.clientHeight * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();

    // --- Shared nodes ---
    const splitter = audioCtx.createChannelSplitter(2);
    const analyserL = audioCtx.createAnalyser();
    const analyserR = audioCtx.createAnalyser();

    analyserL.fftSize = 2048;
    analyserR.fftSize = 2048;
    analyserL.smoothingTimeConstant = 1;
    analyserR.smoothingTimeConstant = 1;

    splitter.connect(analyserL, 1); // Left
    splitter.connect(analyserR, 0); // Right

    analyserL.connect(audioCtx.destination);
    analyserR.connect(audioCtx.destination);

    const bufferLength = analyserL.fftSize;
    const dataL = new Uint8Array(bufferLength);
    const dataR = new Uint8Array(bufferLength);

    let currentSource = null;
    let isDrawing = false;

    // Adjustable Settings ---------------------

    // Stretch time mode 
    let width_scalar = 1;
    const stretchSlider = document.getElementById("stretch-slider");
    stretchSlider.addEventListener("input", () => {
        width_scalar = parseFloat(stretchSlider.value);
    });

    // Persistence
    let persistence = 0.15;
    const persistenceSlider = document.getElementById("persistence-slider");
    persistenceSlider.addEventListener("input", () => {
        persistence = 0.2 * (1 - parseFloat(persistenceSlider.value));
    });

    // Glow
    let glow = 1;
    const glowSlider = document.getElementById("glow-slider");
    glowSlider.addEventListener("input", () => {
        glow = parseFloat(glowSlider.value);
    });

    // Max Draw Distance
    const hypotenuse = Math.sqrt(canvas.clientHeight ** 2 + canvas.clientWidth ** 2);
    let maxDistance = hypotenuse
    const distanceSlider = document.getElementById("distance-slider");
    distanceSlider.addEventListener("input", () => {
        maxDistance = hypotenuse * parseFloat(distanceSlider.value);
    });

    // Scale
    const scaleSlider = document.getElementById("scale-slider");
    let canvasScale = 0.6
    scaleSlider.addEventListener("input", () => {
        canvasScale = parseFloat(scaleSlider.value);
    });

    // --- Scope mode ---
    let scopeMode = "xy"; // "xy" or "time"
    // let scopeMode = "time"; // "time" or "xy"

    const toggleBtn = document.getElementById("toggle-scope");
    toggleBtn.addEventListener("click", () => {
        scopeMode = scopeMode === "xy" ? "time" : "xy";
    });
    

    // Zero Crossing
    function findZeroCrossing(data) {
        for (let i = 1; i < data.length; i++) {
            if (data[i - 1] < 128 && data[i] >= 128) {
                return i;
            }
        }
        return 0; // fallback if no crossing found
    }

    function drawXY() {
        const scale = Math.min(canvas.clientWidth, canvas.clientHeight) * canvasScale;
        const startIdx = findZeroCrossing(dataL); // use left channel as reference

        let lastX = null;
        let lastY = null;

        for (let i = 0; i < bufferLength; i++) {
            const idx = (startIdx + i) % bufferLength;
            const x = (dataR[idx] - 128) / 128;
            const y = -(dataL[idx] - 128) / 128;

            const drawX = x * scale;
            const drawY = y * scale;

            if (i === 0 || lastX === null || lastY === null) {
                ctx.moveTo(drawX, drawY);
            } else {
                const dx = drawX - lastX;
                const dy = drawY - lastY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxDistance) {
                    ctx.lineTo(drawX, drawY);
                } else {
                    ctx.moveTo(drawX, drawY); // start new segment
                }
            }

            lastX = drawX;
            lastY = drawY;
        }
    }

    function drawTime() {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const scaleY = height * canvasScale;
        
        ctx.translate(-width / 2, 0); // move origin to left edge

        for (let i = 0; i < bufferLength; i++) {
            const x = (i / bufferLength) * width * width_scalar;
            const y = -((dataL[i] - 128) / 128) * scaleY;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
    }

    function draw() {
        if (!isDrawing) return;
        requestAnimationFrame(draw);

        analyserL.getByteTimeDomainData(dataL);
        analyserR.getByteTimeDomainData(dataR);

        // Phosphor persistence fade
        ctx.fillStyle = `rgba(0, 0, 0, ${persistence})`;
        ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

        ctx.save();
        ctx.translate(canvas.clientWidth / 2, canvas.clientHeight / 2);

        ctx.beginPath();
        ctx.strokeStyle = "#95ffaf";
        ctx.lineWidth = 1.0;
        ctx.shadowBlur = glow;
        ctx.shadowColor = "#95ffaf";

        if (scopeMode === "xy") {
            drawXY();
        } else if (scopeMode === "time") {
            drawTime();
        }

        ctx.stroke();
        ctx.restore();
    }

    // --- Attach to all audio players ---
    document.querySelectorAll(".audio-player").forEach(audio => {
        let source = null;

        audio.addEventListener("play", () => {
            if (audioCtx.state === "suspended") {
                audioCtx.resume();
            }

            // Disconnect previous source
            if (currentSource) {
                currentSource.disconnect();
            }

            // Create source once per element
            if (!source) {
                source = audioCtx.createMediaElementSource(audio);
            }

            source.connect(splitter);
            currentSource = source;

            if (!isDrawing) {
                isDrawing = true;
                draw();
            }
        });

        audio.addEventListener("pause", () => {
            isDrawing = false;
        });

        audio.addEventListener("ended", () => {
            isDrawing = false;
        });
    });
}
