const zoomSlider = document.getElementById("zoom");
const maxIterationsInput = document.getElementById("iterations");
const startColorSlider = document.getElementById("start-color");
const endColorSlider = document.getElementById("end-color");
const saveButton = document.getElementById("save");

let xOffset = 0;
let yOffset = 0;

let lastMouseX, lastMouseY;
let isDragging = false;

let redrawTimeout;

let colorLUT = [];

[zoomSlider, maxIterationsInput, startColorSlider, endColorSlider]
    .forEach(el => {
        el.addEventListener("input", () => redraw());
    });


function setup() {
    parentElement = document.getElementById("sketch");
    parentWidth = parentElement.clientWidth;
    height = floor(parentWidth * 0.75);

    canvas = createCanvas(parentWidth, height);
    canvas.parent("sketch");

    pixelDensity(1);
    colorMode(HSL);
    noLoop();

    renderMandelbrot();
}

function draw() {
    canvas.style("cursor", "grab");
    renderMandelbrot();
    noLoop();
}

function renderMandelbrot() {
    let zoom = parseFloat(zoomSlider.value);
    let startColor = parseFloat(startColorSlider.value);
    let endColor = parseFloat(endColorSlider.value);

    background(0, 0, 6);

    let maxIterations = maxIterationsInput.value;  
    buildColorLUT(maxIterations, startColor, endColor);


    let w = 1 / pow(zoom, 2);
    let h = (w * height) / width;

    let xMin = -w / 2 + xOffset;
    let yMin = -h / 2 + yOffset;

    loadPixels();

    let xMax = xMin + w;
    let yMax = yMin + h;

    let dx = (xMax - xMin) / width;
    let dy = (yMax - yMin) / height;

    // let y = yMin;
    for (let j = 0; j < height; j++) {
        let y = yMin + j * dy;
        let x = xMin;
        for (let i = 0; i < width; i++) {
            let a = x;
            let b = y;
            let iterations = 0;

            while (iterations < maxIterations) {
                let a2 = a * a;
                let b2 = b * b;
                let twoAB = 2 * a * b;

                a = a2 - b2 + x;
                b = twoAB + y;

                if (a2 + b2 > 4) break;
                iterations++;
            }

            let idx = (i + j * width) * 4;
            if (iterations < maxIterations) {
                let [h, s, l] = colorLUT[iterations];
                pixels[idx]     = h;
                pixels[idx + 1] = s;
                pixels[idx + 2] = l;
            } else {
                pixels[idx]     = 0;
                pixels[idx + 1] = 0;
                pixels[idx + 2] = 6;
            }
            pixels[idx + 3] = 255;
            x += dx;
        }
    }
    updatePixels();
}

function mouseClicked() {
    // Only respond if click is inside the canvas
    if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;

    recenterOnClick(mouseX, mouseY);
    redraw();
}

function recenterOnClick(px, py) {
    let zoom = parseFloat(document.getElementById("zoom").value);

    // Current view window
    let w = 1 / pow(zoom, 2);
    let h = (w * height) / width;

    let xMin = -w / 2 + xOffset;
    let yMin = -h / 2 + yOffset;

    // Map pixel → complex
    let cx = xMin + (px / width) * w;
    let cy = yMin + (py / height) * h;

    // Recenter
    xOffset = cx;
    yOffset = cy;
}

function buildColorLUT(maxIterations, startHue, endHue) {
    colorLUT.length = maxIterations + 1;

    for (let i = 0; i <= maxIterations; i++) {
        let t = i / maxIterations;
        let hue = lerp(startHue, endHue, sqrt(t));
        let lightness = lerp(0, 100, sqrt(t));
        colorLUT[i] = [hue, 255, lightness];
    }
}

saveButton.addEventListener("click", () => save("mandelbrot.png"));

