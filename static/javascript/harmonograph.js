// const saveButton = document.getElementById("save");

const f1Slider = document.getElementById("f1-slider");
const f2Slider = document.getElementById("f2-slider");
const f3Slider = document.getElementById("f3-slider");
const f4Slider = document.getElementById("f4-slider");

const a1Slider = document.getElementById("a1-slider");
const a2Slider = document.getElementById("a2-slider");
const a3Slider = document.getElementById("a3-slider");
const a4Slider = document.getElementById("a4-slider");

const p1Slider = document.getElementById("p1-slider");
const p2Slider = document.getElementById("p2-slider");
const p3Slider = document.getElementById("p3-slider");
const p4Slider = document.getElementById("p4-slider");

const d1Slider = document.getElementById("d1-slider");
const d2Slider = document.getElementById("d2-slider");
const d3Slider = document.getElementById("d3-slider");
const d4Slider = document.getElementById("d4-slider");

const weightSlider = document.getElementById("line-weight");
const glowSlider = document.getElementById("glow");

const saveButton = document.getElementById("save");

var f1;
var f2;
var f3;
var f4;

var a1;
var a2;
var a3;
var a4;

var p1;
var p2;
var p3;
var p4;

var d1;
var d2;
var d3;
var d4;

var dt;
var iterations;
var weight;
var glow;


function setup() {
    f1 = pow(10, parseFloat(f1Slider.value));
    f2 = pow(10, parseFloat(f2Slider.value));
    f3 = pow(10, parseFloat(f3Slider.value));
    f4 = pow(10, parseFloat(f4Slider.value));
    a1 = parseFloat(a1Slider.value);
    a2 = parseFloat(a2Slider.value);
    a3 = parseFloat(a3Slider.value);
    a4 = parseFloat(a4Slider.value);
    p1 = map(parseFloat(p1Slider.value), 0, 1, 0, TWO_PI);
    p2 = map(parseFloat(p2Slider.value), 0, 1, 0, TWO_PI);
    p3 = map(parseFloat(p3Slider.value), 0, 1, 0, TWO_PI);
    p4 = map(parseFloat(p4Slider.value), 0, 1, 0, TWO_PI);
    d1 = parseFloat(d1Slider.value);
    d2 = parseFloat(d2Slider.value);
    d3 = parseFloat(d3Slider.value);
    d4 = parseFloat(d4Slider.value);
    dt = 0.001;
    
    iterations = 100000;
    weight = parseFloat(weightSlider.value);
    glow = parseFloat(glowSlider.value);

    parentElement = document.getElementById("sketch");
    parentWidth = parentElement.clientWidth;
    parentHeight = parentElement.clientHeight;
    canvas = createCanvas(parentWidth, parentHeight);
    canvas.parent("sketch");
    pixelDensity(1);
    background(0);
}

function draw() {
    translate(width / 2, height / 2);
    background(0);
    renderHarmonograph();
    noLoop();
}

function renderHarmonograph () {
    let t = 0;
    noFill();
    stroke(149, 255, 175);
    strokeWeight(weight);
    drawingContext.shadowBlur = glow;
    drawingContext.shadowColor = color(149, 255, 175);
    beginShape();
    for (let i = 0; i < iterations; i++) {
        x = a1 * sin(t * f1 + p1) * exp(-d1 * t) + a2 * sin(t * f2 + p2) * exp(-d2 * t);
        y = a3 * sin(t * f3 + p3) * exp(-d3 * t) + a4 * sin(t * f4 + p4) * exp(-d4 * t);
        vertex(x, y);
        t += dt;
    }
    endShape();
}

[
    f1Slider, f2Slider, f3Slider, f4Slider,
    a1Slider, a2Slider, a3Slider, a4Slider,
    p1Slider, p2Slider, p3Slider, p4Slider,
    d1Slider, d2Slider, d3Slider, d4Slider,
    weightSlider, glowSlider,
].forEach(el => {
    el.addEventListener("input", () => {
        f1 = pow(10, parseFloat(f1Slider.value));
        f2 = pow(10, parseFloat(f2Slider.value));
        f3 = pow(10, parseFloat(f3Slider.value));
        f4 = pow(10, parseFloat(f4Slider.value));
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
        redraw();
    })

})

saveButton.addEventListener("click", () => save("harmonograph.png"));