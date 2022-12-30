"use strict";
let canvas = document.getElementById("canvas");
let penBtn = document.getElementById("penBtn");
let eraserBtn = document.getElementById("eraserBtn");
let rect = canvas.getBoundingClientRect();
let painter = canvas.getContext("2d");
let mouseX = 0;
let mouseY = 0;
let inputCheckInterval = setInterval(handleDrawInput, 5);
let pixelData = [[]];
let currentTool;
let mouseDown = false;
let penColor = "rgba(0, 0, 0, 1)";
var ToolType;
(function (ToolType) {
    ToolType[ToolType["Pen"] = 0] = "Pen";
    ToolType[ToolType["Eraser"] = 1] = "Eraser";
})(ToolType || (ToolType = {}));
painter.scale(32, 32);
currentTool = ToolType.Pen;
// Initialize the canvas with opacity-0 color values
for (let i = 0; i < 16; i++) {
    pixelData[i] = [];
    for (let j = 0; j < 16; j++) {
        pixelData[i][j] = "rgba(0, 0, 0, 0)";
    }
}
window.addEventListener("mousemove", function (event) {
    mouseX = event.x - rect.x;
    mouseY = event.y - rect.y;
});
document.body.onmousedown = function () {
    mouseDown = true;
};
document.body.onmouseup = function () {
    mouseDown = false;
};
penBtn.addEventListener("click", function () {
    currentTool = ToolType.Pen;
});
eraserBtn.addEventListener("click", function () {
    currentTool = ToolType.Eraser;
    console.log("eraser selected");
});
// Draw data stored in pixelData
function drawSprite() {
    painter.clearRect(0, 0, 16, 16);
    for (let i = 0; i < 16; i++) {
        for (let j = 0; j < 16; j++) {
            painter.fillStyle = pixelData[i][j];
            painter.fillRect(i, j, 1, 1);
        }
    }
}
// Input pixel data
function handleDrawInput() {
    if (mouseDown && mouseInBounds()) {
        console.log("X: " + mouseX + " | Y: " + mouseY);
        let pixelX = Math.floor((mouseX) / 32);
        let pixelY = Math.floor((mouseY) / 32);
        if (mouseInBounds()) {
            if (currentTool == ToolType.Pen) {
                pixelData[pixelX][pixelY] = penColor;
            }
            else if (currentTool == ToolType.Eraser) {
                pixelData[pixelX][pixelY] = "rgba(0, 0, 0, 0)";
            }
        }
        drawSprite();
    }
}
function mouseInBounds() {
    if (mouseX >= 0 && mouseX <= canvas.width - 1 && mouseY >= 0 && mouseY <= canvas.height - 1) {
        return true;
    }
    return false;
}
// Save the canvas to a PNG image
// Credit: https://stackoverflow.com/questions/11112321/how-to-save-canvas-as-png-image
function DownloadCanvasAsImage() {
    let downloadLink = document.createElement('a');
    downloadLink.setAttribute('download', 'CanvasAsImage.png');
    let dataURL = canvas.toDataURL('image/png');
    let url = dataURL.replace(/^data:image\/png/, 'data:application/octet-stream');
    downloadLink.setAttribute('href', url);
    downloadLink.click();
}
