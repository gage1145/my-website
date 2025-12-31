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
        const scale = Math.min(canvas.clientWidth, canvas.clientHeight) * 0.6;
        const maxDistance = canvas.clientWidth / 7; // maximum allowed distance between consecutive points

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
        const scaleY = height * 0.6;
        
        ctx.translate(-width / 2, 0); // move origin to left edge

        for (let i = 0; i < bufferLength; i++) {
            const x = (i / bufferLength) * width * width_scalar;
            // const x = i * (canvas.clientWidth / bufferLength) * width_scalar - canvas.clientWidth/2;
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
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

        ctx.save();
        ctx.translate(canvas.clientWidth / 2, canvas.clientHeight / 2);

        ctx.beginPath();
        ctx.strokeStyle = "#00ff66";
        ctx.lineWidth = 1.0;
        ctx.shadowBlur = 1.0;
        ctx.shadowColor = "#00ff66";

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
