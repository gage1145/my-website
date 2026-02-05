const maxIterationsInput =  document.getElementById("iterations");
const paletteSlider =       document.getElementById("palette-cycles");
const colorScaleSlider =    document.getElementById("color-scale");
const colorModeInput =      document.getElementById("color-mode");
const colorParamSlider1 =   document.getElementById("color1");
const colorParamSlider2 =   document.getElementById("color2");
const colorParamSlider3 =   document.getElementById("color3");
const zoomSlider =          document.getElementById("zoom");
const saveButton =          document.getElementById("save");

let maxIterations = maxIterationsInput.value;
let colorParam1 =   colorParamSlider1.value;
let colorParam2 =   colorParamSlider2.value;
let colorParam3 =   colorParamSlider3.value;
let paletteCycles = paletteSlider.value;
let colorScale =    colorScaleSlider.value;
let color_mode =    colorModeInput.value;

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
    updateColorLabels();
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

    background(0, 0, 0);

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

            let xold = 0;
            let yold = 0;
            let period = 0;
            while (iterations < maxIterations) {
                let a2 = a * a;
                let b2 = b * b;
                let twoAB = 2 * a * b;

                a = a2 - b2 + x;
                b = twoAB + y;

                if (a2 + b2 > 4) break;
                if (a == xold & b == yold) {
                    iterations = maxIterations;
                    break;
                }
                
                period++;

                if (period > 20) {
                    period = 0;
                    xold = a;
                    yold = b;
                }

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

    if (color_mode === "HSL") {
        colorMode(HSL, 360, 100, 100, 255);
        colorParam1 = map(colorParam1, 0, 100, 0, 360);
        for (let i = 0; i <= maxIterations; i++) {
            v = pow(pow(i / maxIterations, colorScale) * N, 1.5) % N;
            h = v * colorParam1 % 360;
            s = colorParam2;
            l = (i / maxIterations) * colorParam3;
            c = color(h, s, l);

            colorLUT[i] = [red(c), green(c), blue(c)];
        }
    } else if (color_mode === "RGB") {
        colorMode(RGB);
        colorParam1 = map(colorParam1, 0, 100, 0, 255);
        colorParam2 = map(colorParam2, 0, 100, 0, 255);
        colorParam3 = map(colorParam3, 0, 100, 0, 255);
        for (let i = 0; i <= maxIterations; i++) {
            v = pow(pow(i / maxIterations, colorScale) * N, 1.5) % N;
            r = v * colorParam1 % 255;
            g = v * colorParam2 % 255;
            b = v * colorParam3 % 255;

            colorLUT[i] = [r, g, b];
        }
    }
}

zoomSlider.addEventListener("input", () => redraw());

[maxIterationsInput, colorModeInput, colorParamSlider1, colorParamSlider2, colorParamSlider3, paletteSlider, colorScaleSlider]
    .forEach(el => {
        el.addEventListener("input", () => {
            color_mode = colorModeInput.value;
            colorParam1 = colorParamSlider1.value;
            colorParam2 = colorParamSlider2.value;
            colorParam3 = colorParamSlider3.value;    
            maxIterations = maxIterationsInput.value;
            paletteCycles = paletteSlider.value;
            colorScale = colorScaleSlider.value;
            buildColorLUT(maxIterations);
            redraw();
        })
    })


function updateColorLabels() {
    color_mode = colorModeInput.value;
    let colorLabel1 = document.getElementById("color1-label");
    let colorLabel2 = document.getElementById("color2-label");
    let colorLabel3 = document.getElementById("color3-label");
    if (color_mode === "RGB") {
        colorLabel1.innerHTML = "Red";
        colorLabel2.innerHTML = "Green";
        colorLabel3.innerHTML = "Blue";
    } else if (color_mode === "HSL") {
        colorLabel1.innerHTML = "Hue";
        colorLabel2.innerHTML = "Saturation";
        colorLabel3.innerHTML = "Lightness";
    }
}

colorModeInput.addEventListener("input", () => updateColorLabels());

saveButton.addEventListener("click", () => save("mandelbrot.png"));

