export function initImageToAscii() {
    // Width
    const widthSlider = document.getElementById("width");
    let widthValue = document.getElementById("width-value");
    widthValue.innerHTML = "Width: " + widthSlider.value + " characters";
    widthSlider.addEventListener("input", () => {
        widthValue.innerHTML = "Width: " + widthSlider.value + " characters";
    });

    // Contrast
    const contrastSlider = document.getElementById("contrast");
    let contrastValue = document.getElementById("contrast-value");
    contrastValue.innerHTML = "Contrast: " + contrastSlider.value + "%";
    contrastSlider.addEventListener("input", () => {
        contrastValue.innerHTML = "Contrast: " + contrastSlider.value + "%";
    });

    // Character Depth
    const charDepthSlider = document.getElementById("depth");
    let charDepthValue = document.getElementById("depth-value");
    charDepthValue.innerHTML = "Character Depth: " + charDepthSlider.value;
    charDepthSlider.addEventListener("input", () => {
        charDepthValue.innerHTML = "Character Depth: " + charDepthSlider.value;
    });

}