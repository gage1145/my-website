export function initOscilloscope() {
    const audio = document.getElementById("audio-player");
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

    const source = audioCtx.createMediaElementSource(audio);

    const splitter = audioCtx.createChannelSplitter(2);
    const analyserL = audioCtx.createAnalyser();
    const analyserR = audioCtx.createAnalyser();

    analyserL.fftSize = 2048;
    analyserR.fftSize = 2048;

    analyserL.smoothingTimeConstant = 0.0;
    analyserR.smoothingTimeConstant = 0.0;

    source.connect(splitter);
    splitter.connect(analyserL, 1); // Left channel
    splitter.connect(analyserR, 0); // Right channel

    analyserL.connect(audioCtx.destination);
    analyserR.connect(audioCtx.destination);

    const bufferLength = analyserL.fftSize;
    const dataL = new Uint8Array(bufferLength);
    const dataR = new Uint8Array(bufferLength);

    function draw() {
        requestAnimationFrame(draw);

        analyserL.getByteTimeDomainData(dataL);
        analyserR.getByteTimeDomainData(dataR);

        // Slight fade instead of full clear (phosphor effect)
        // ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        // ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);


        ctx.save();
        ctx.translate(canvas.clientWidth / 2, canvas.clientHeight / 2);

        ctx.beginPath();
        ctx.strokeStyle = "#00ff66";
        ctx.lineWidth = 1;
        ctx.shadowBlur = 4;
        ctx.shadowColor = "#00ff66";

        for (let i = 0; i < bufferLength; i++) {
            const x = (dataR[i] - 128) / 128;
            const y = -(dataL[i] - 128) / 128;


            const drawX = x * canvas.clientWidth * 0.4;
            const drawY = y * canvas.clientHeight * 0.4;

            if (i === 0) {
                ctx.moveTo(drawX, drawY);
            } else {
                ctx.lineTo(drawX, drawY);
            }
        }

        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.restore();
    }

    audio.addEventListener("play", () => {
        if (audioCtx.state === "suspended") {
            audioCtx.resume();
        }
        draw();
    });
}
