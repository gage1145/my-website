let activeInstance = null;

export function initHarmonograph(container) {
    activeInstance?.remove();

    const sketch = (p) => {
        const sketchEl = container.querySelector("#sketch");

        const f1Slider = container.querySelector("#f1-slider");
        const f2Slider = container.querySelector("#f2-slider");
        const f3Slider = container.querySelector("#f3-slider");
        const f4Slider = container.querySelector("#f4-slider");

        const a1Slider = container.querySelector("#a1-slider");
        const a2Slider = container.querySelector("#a2-slider");
        const a3Slider = container.querySelector("#a3-slider");
        const a4Slider = container.querySelector("#a4-slider");

        const p1Slider = container.querySelector("#p1-slider");
        const p2Slider = container.querySelector("#p2-slider");
        const p3Slider = container.querySelector("#p3-slider");
        const p4Slider = container.querySelector("#p4-slider");

        const d1Slider = container.querySelector("#d1-slider");
        const d2Slider = container.querySelector("#d2-slider");
        const d3Slider = container.querySelector("#d3-slider");
        const d4Slider = container.querySelector("#d4-slider");

        const weightSlider = container.querySelector("#line-weight");
        const glowSlider = container.querySelector("#glow");
        const saveButton = container.querySelector("#save");

        let f1, f2, f3, f4;
        let a1, a2, a3, a4;
        let p1, p2, p3, p4;
        let d1, d2, d3, d4;
        let dt, iterations, weight, glow;
        let canvas;

        p.setup = () => {
            f1 = p.pow(10, parseFloat(f1Slider.value));
            f2 = p.pow(10, parseFloat(f2Slider.value));
            f3 = p.pow(10, parseFloat(f3Slider.value));
            f4 = p.pow(10, parseFloat(f4Slider.value));
            a1 = parseFloat(a1Slider.value);
            a2 = parseFloat(a2Slider.value);
            a3 = parseFloat(a3Slider.value);
            a4 = parseFloat(a4Slider.value);
            p1 = p.map(parseFloat(p1Slider.value), 0, 1, 0, p.TWO_PI);
            p2 = p.map(parseFloat(p2Slider.value), 0, 1, 0, p.TWO_PI);
            p3 = p.map(parseFloat(p3Slider.value), 0, 1, 0, p.TWO_PI);
            p4 = p.map(parseFloat(p4Slider.value), 0, 1, 0, p.TWO_PI);
            d1 = parseFloat(d1Slider.value);
            d2 = parseFloat(d2Slider.value);
            d3 = parseFloat(d3Slider.value);
            d4 = parseFloat(d4Slider.value);
            dt = 0.001;

            iterations = 100000;
            weight = parseFloat(weightSlider.value);
            glow = parseFloat(glowSlider.value);

            const parentWidth = sketchEl.clientWidth;
            const parentHeight = sketchEl.clientHeight;
            canvas = p.createCanvas(parentWidth, parentHeight);
            canvas.parent(sketchEl);
            p.pixelDensity(1);
            p.background(0);
        };

        p.draw = () => {
            p.translate(p.width / 2, p.height / 2);
            p.background(0);
            renderHarmonograph();
            p.noLoop();
        };

        function renderHarmonograph() {
            let t = 0;
            p.noFill();
            p.stroke(149, 255, 175);
            p.strokeWeight(weight);
            p.drawingContext.shadowBlur = glow;
            p.drawingContext.shadowColor = p.color(149, 255, 175);
            p.beginShape();
            for (let i = 0; i < iterations; i++) {
                const x = a1 * p.sin(t * f1 + p1) * p.exp(-d1 * t) + a2 * p.sin(t * f2 + p2) * p.exp(-d2 * t);
                const y = a3 * p.sin(t * f3 + p3) * p.exp(-d3 * t) + a4 * p.sin(t * f4 + p4) * p.exp(-d4 * t);
                p.vertex(x, y);
                t += dt;
            }
            p.endShape();
        }

        [
            f1Slider, f2Slider, f3Slider, f4Slider,
            a1Slider, a2Slider, a3Slider, a4Slider,
            p1Slider, p2Slider, p3Slider, p4Slider,
            d1Slider, d2Slider, d3Slider, d4Slider,
            weightSlider, glowSlider,
        ].forEach(el => {
            el.addEventListener("input", () => {
                f1 = p.pow(10, parseFloat(f1Slider.value));
                f2 = p.pow(10, parseFloat(f2Slider.value));
                f3 = p.pow(10, parseFloat(f3Slider.value));
                f4 = p.pow(10, parseFloat(f4Slider.value));
                a1 = parseFloat(a1Slider.value);
                a2 = parseFloat(a2Slider.value);
                a3 = parseFloat(a3Slider.value);
                a4 = parseFloat(a4Slider.value);
                p1 = parseFloat(p1Slider.value);
                p2 = parseFloat(p2Slider.value);
                p3 = parseFloat(p3Slider.value);
                p4 = parseFloat(p4Slider.value);
                d1 = parseFloat(d1Slider.value);
                d2 = parseFloat(d2Slider.value);
                d3 = parseFloat(d3Slider.value);
                d4 = parseFloat(d4Slider.value);
                weight = parseFloat(weightSlider.value);
                glow = parseFloat(glowSlider.value);
                p.redraw();
            });
        });

        p.windowResized = () => {
            const parentWidth = sketchEl.clientWidth;
            const parentHeight = sketchEl.clientHeight;
            p.resizeCanvas(parentWidth, parentHeight);
        };

        saveButton.addEventListener("click", () => p.save("harmonograph.png"));
    };

    activeInstance = new p5(sketch);
}

export function destroyHarmonograph() {
    activeInstance?.remove();
    activeInstance = null;
}
