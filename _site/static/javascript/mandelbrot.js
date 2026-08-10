let activeInstance = null;

export function initMandelbrot(container) {
    activeInstance?.remove();

    const sketch = (p) => {
        const sketchEl = container.querySelector("#sketch");
        const maxIterationsInput = container.querySelector("#iterations");
        const paletteSlider = container.querySelector("#palette-cycles");
        const colorScaleSlider = container.querySelector("#color-scale");
        const colorModeInput = container.querySelector("#color-mode");
        const colorParamSlider1 = container.querySelector("#color1");
        const colorParamSlider2 = container.querySelector("#color2");
        const colorParamSlider3 = container.querySelector("#color3");
        const zoomSlider = container.querySelector("#zoom");
        const saveButton = container.querySelector("#save");
        const colorLabel1 = container.querySelector("#color1-label");
        const colorLabel2 = container.querySelector("#color2-label");
        const colorLabel3 = container.querySelector("#color3-label");

        let maxIterations = maxIterationsInput.value;
        let colorParam1 = colorParamSlider1.value;
        let colorParam2 = colorParamSlider2.value;
        let colorParam3 = colorParamSlider3.value;
        let paletteCycles = paletteSlider.value;
        let colorScale = colorScaleSlider.value;
        let color_mode = colorModeInput.value;

        let xOffset = 0;
        let yOffset = 0;

        let colorLUT = [];
        let canvas;

        function updateColorLabels() {
            color_mode = colorModeInput.value;
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

        function buildColorLUT() {
            colorLUT.length = Number(maxIterations) + 1;
            const scale = p.map(colorScale, 0, 1, 0.001, 0.1);
            const N = paletteCycles;

            if (color_mode === "HSL") {
                p.colorMode(p.HSL, 360, 100, 100, 255);
                const hueParam = p.map(colorParam1, 0, 100, 0, 360);
                for (let i = 0; i <= maxIterations; i++) {
                    const v = p.pow(p.pow(i / maxIterations, scale) * N, 1.5) % N;
                    const h = (v * hueParam) % 360;
                    const s = colorParam2;
                    const l = (i / maxIterations) * colorParam3;
                    const c = p.color(h, s, l);
                    colorLUT[i] = [p.red(c), p.green(c), p.blue(c)];
                }
            } else if (color_mode === "RGB") {
                p.colorMode(p.RGB);
                const rParam = p.map(colorParam1, 0, 100, 0, 255);
                const gParam = p.map(colorParam2, 0, 100, 0, 255);
                const bParam = p.map(colorParam3, 0, 100, 0, 255);
                for (let i = 0; i <= maxIterations; i++) {
                    const v = p.pow(p.pow(i / maxIterations, scale) * N, 1.5) % N;
                    const r = (v * rParam) % 255;
                    const g = (v * gParam) % 255;
                    const b = (v * bParam) % 255;
                    colorLUT[i] = [r, g, b];
                }
            }
        }

        function renderMandelbrot() {
            const zoom = parseFloat(zoomSlider.value);

            p.background(0, 0, 0);

            const w = 1 / p.pow(zoom, 2);
            const h = (w * p.height) / p.width;

            const xMin = -w / 2 + xOffset;
            const yMin = -h / 2 + yOffset;

            p.loadPixels();

            const xMax = xMin + w;
            const yMax = yMin + h;

            const dx = (xMax - xMin) / p.width;
            const dy = (yMax - yMin) / p.height;

            for (let j = 0; j < p.height; j++) {
                const y = yMin + j * dy;
                let x = xMin;
                for (let i = 0; i < p.width; i++) {
                    let a = x;
                    let b = y;
                    let iterations = 0;

                    let xold = 0;
                    let yold = 0;
                    let period = 0;
                    while (iterations < maxIterations) {
                        const a2 = a * a;
                        const b2 = b * b;
                        const twoAB = 2 * a * b;

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

                    const idx = (i + j * p.width) * 4;
                    if (iterations < maxIterations) {
                        const [r, g, b2] = colorLUT[iterations];
                        p.pixels[idx] = r;
                        p.pixels[idx + 1] = g;
                        p.pixels[idx + 2] = b2;
                    } else {
                        p.pixels[idx] = 0;
                        p.pixels[idx + 1] = 0;
                        p.pixels[idx + 2] = 0;
                    }
                    p.pixels[idx + 3] = 255;
                    x += dx;
                }
            }
            p.updatePixels();
        }

        function recenterOnClick(px, py) {
            const zoom = parseFloat(zoomSlider.value);

            const w = 1 / p.pow(zoom, 2);
            const h = (w * p.height) / p.width;

            const xMin = -w / 2 + xOffset;
            const yMin = -h / 2 + yOffset;

            xOffset = xMin + (px / p.width) * w;
            yOffset = yMin + (py / p.height) * h;
        }

        p.setup = () => {
            const parentWidth = sketchEl.clientWidth;
            const parentHeight = sketchEl.clientHeight;
            canvas = p.createCanvas(parentWidth, parentHeight);
            canvas.parent(sketchEl);
            p.pixelDensity(1);
            updateColorLabels();
            buildColorLUT();
            renderMandelbrot();
        };

        p.draw = () => {
            canvas.style("cursor", "pointer");
            renderMandelbrot();
            p.noLoop();
        };

        p.mouseClicked = () => {
            if (p.mouseX < 0 || p.mouseX > p.width || p.mouseY < 0 || p.mouseY > p.height) return;
            recenterOnClick(p.mouseX, p.mouseY);
            p.redraw();
        };

        p.windowResized = () => {
            p.resizeCanvas(sketchEl.clientWidth, sketchEl.clientWidth);
        };

        zoomSlider.addEventListener("input", () => p.redraw());

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
                    buildColorLUT();
                    p.redraw();
                });
            });

        colorModeInput.addEventListener("input", () => updateColorLabels());

        saveButton.addEventListener("click", () => p.save("mandelbrot.png"));
    };

    activeInstance = new p5(sketch);
}

export function destroyMandelbrot() {
    activeInstance?.remove();
    activeInstance = null;
}
