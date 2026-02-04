const zoomSlider = document.getElementById("zoom");
const maxIterationsInput = document.getElementById("iterations");
const hueSlider = document.getElementById("hue");
const saturationSlider = document.getElementById("saturation");
const lightnessSlider = document.getElementById("lightness");
const paletteSlider = document.getElementById("palette-cycles");
const colorScaleSlider = document.getElementById("color-scale");
const saveButton = document.getElementById("save");

let maxIterations = maxIterationsInput.value;
let hue = hueSlider.value;
let saturation = saturationSlider.value;
let lightness = lightnessSlider.value;
let paletteCycles = paletteSlider.value;
let colorScale = colorScaleSlider.value;

let xOffset = 0;
let yOffset = 0;


let colorLUT = [];

function setup() {
    parentElement = document.getElementById("sketch");
    parentWidth = parentElement.clientWidth;
    height = floor(parentWidth * 0.75);

    canvas = createCanvas(parentWidth, height);
    canvas.parent("sketch");

    pixelDensity(1);
    colorMode(HSL, 360, 100, 100, 255);  

    buildColorLUT();

    renderMandelbrot();
}

function draw() {
    canvas.style("cursor", "pointer");
    renderMandelbrot();
    noLoop();
}

function renderMandelbrot() {
    let zoom = parseFloat(zoomSlider.value);

    background(0, 0, 6);

    let w = 1 / pow(zoom, 2);
    let h = (w * height) / width;

    let xMin = -w / 2 + xOffset;
    let yMin = -h / 2 + yOffset;

    loadPixels();

    let xMax = xMin + w;
    let yMax = yMin + h;

    let dx = (xMax - xMin) / width;
    let dy = (yMax - yMin) / height;

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
                let [r, g, b] = colorLUT[iterations];
                pixels[idx]     = r;
                pixels[idx + 1] = g;
                pixels[idx + 2] = b;
            } else {
                pixels[idx]     = 0;
                pixels[idx + 1] = 0;
                pixels[idx + 2] = 0;
            }
            pixels[idx + 3] = 255;
            x += dx;
        }
    }
    updatePixels();
}

function mouseClicked() {
    if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;
    recenterOnClick(mouseX, mouseY);
    redraw();
}

function recenterOnClick(px, py) {
    let zoom = parseFloat(document.getElementById("zoom").value);

    let w = 1 / pow(zoom, 2);
    let h = (w * height) / width;

    let xMin = -w / 2 + xOffset;
    let yMin = -h / 2 + yOffset;

    let cx = xMin + (px / width) * w;
    let cy = yMin + (py / height) * h;

    xOffset = cx;
    yOffset = cy;
}

function buildColorLUT() {
    colorLUT.length = maxIterations + 1;
    colorScale = map(colorScale, 0, 1, 0.001, 0.1);
    N = paletteCycles;

    for (let i = 0; i <= maxIterations; i++) {
        v = pow(pow(i / maxIterations, colorScale) * N, 1.5) % N;
        h = v * hue % 360;
        s = saturation % 100;
        l = v * lightness % 100;
        c = color(h, s, l);

        colorLUT[i] = [red(c), green(c), blue(c)];
    }
}

zoomSlider.addEventListener("input", () => redraw());

[maxIterationsInput, hueSlider, saturationSlider, lightnessSlider, paletteSlider, colorScaleSlider]
    .forEach(el => {
        el.addEventListener("input", () => {
            hue = hueSlider.value;
            saturation = saturationSlider.value;
            lightness = lightnessSlider.value;    
            maxIterations = maxIterationsInput.value;
            paletteCycles = paletteSlider.value;
            colorScale = colorScaleSlider.value;
            buildColorLUT(maxIterations);
            redraw();
        })
    })

saveButton.addEventListener("click", () => save("mandelbrot.png"));

