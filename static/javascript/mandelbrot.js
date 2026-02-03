const button = document.getElementById("render");
const zoomSlider = document.getElementById("zoom");
const iterationsSlider = document.getElementById("iterations");
const saveButton = document.getElementById("save");

let xOffset = 0;
let yOffset = 0;

let lastMouseX, lastMouseY;
let isDragging = false;

let redrawTimeout;

[zoomSlider, iterationsSlider]
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
    let zoom = parseFloat(document.getElementById("zoom").value);

    background(0, 0, 6);

    let maxIterations = document.getElementById("iterations").value;

    let w = 1 / pow(zoom, 2);
    let h = (w * height) / width;

    let xMin = -w / 2 + xOffset;
    let yMin = -h / 2 + yOffset;

    loadPixels();

    let xMax = xMin + w;
    let yMax = yMin + h;

    let dx = (xMax - xMin) / width;
    let dy = (yMax - yMin) / height;

    let y = yMin;
    for (let j = 0; j < height; j++) {
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

                if (a2 + b2 > 10) break;
                iterations++;
            }

            let idx = (i + j * width) * 4;
            let normalized = map(iterations, 0, maxIterations, 0, 1);
            let lerpAmount = sqrt(normalized);

            let pixelColor = color(0, 0, 6);
            if (iterations < maxIterations) {
                pixelColor = lerpColor(
                    color(135, 255, 79.2),
                    color(255, 255, 79.2),
                    lerpAmount
                );
            }

            pixels[idx + 0] = pixelColor.levels[0];
            pixels[idx + 1] = pixelColor.levels[1];
            pixels[idx + 2] = pixelColor.levels[2];
            pixels[idx + 3] = 255;

            x += dx;
        }
        y += dy;
    }
    updatePixels();
}

function mousePressed() {
    if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;

    cursor("grabbing");
    isDragging = true;
    lastMouseX = mouseX;
    lastMouseY = mouseY;
}

function mouseReleased() {
    cursor("default");
    isDragging = false;
}

function mouseDragged() {
    if (!isDragging) return;

    let zoom = parseFloat(document.getElementById("zoom").value);

    // Complex-plane width at current zoom
    let w = 1 / pow(zoom, 2);
    let h = (w * height) / width;

    // Convert pixel movement → complex movement
    let dx = (mouseX - lastMouseX) * (w / width);
    let dy = (mouseY - lastMouseY) * (h / height);

    // Invert x for intuitive dragging
    xOffset -= dx;
    yOffset -= dy;

    lastMouseX = mouseX;
    lastMouseY = mouseY;

    redraw();
}

function requestRedraw() {
    clearTimeout(redrawTimeout);
    redrawTimeout = setTimeout(() => redraw(), 30);
}

saveButton.addEventListener("click", () => save("mandelbrot.png"));

