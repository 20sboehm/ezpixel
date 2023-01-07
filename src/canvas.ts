let canvas = document.getElementById('canvas') as HTMLCanvasElement;
let canvasBG = document.getElementById('canvasBG') as HTMLCanvasElement;
let penBtn = document.getElementById('penBtn')!;
let eraserBtn = document.getElementById('eraserBtn')!;
let colorSelect = document.getElementById('colorSelect')! as HTMLInputElement;
let setColorBtn = document.getElementById('setColor')!;
let selectSpriteSizeBtn = document.getElementById('spriteSizeBtn')!;
let spriteSizeSelect = document.getElementById('spriteSizeSelect')! as HTMLInputElement;

let rect = canvas.getBoundingClientRect();
let painter = canvas.getContext('2d')!;
let painterBG = canvasBG.getContext('2d')!;
let mouseX = 0;
let mouseY = 0;
let inputCheckInterval = setInterval(handleDrawInput, 5);
let pixelData: string[][] = [[]];
let currentTool: ToolType;
let mouseDown = false;
let penColor = 'rgba(0, 0, 0, 1)';
let spriteSize = 16;
let scaleFactor = canvas.width / spriteSize;

enum ToolType 
{
    Pen,
    Eraser
}

currentTool = ToolType.Pen;

// Set up everything we need for the canvas and its initial display
setupCanvas();

window.addEventListener('mousemove', function(event) 
{
    mouseX = event.x - rect.x;
    mouseY = event.y - rect.y;
})

document.onmousedown = function() 
{ 
    mouseDown = true;
}

document.onmouseup = function() 
{
    mouseDown = false;
}

// Keep track of where the canvas is releative to the browser window to make sure the coordinate math stays accurate
window.onresize = function(event) 
{
    rect = canvas.getBoundingClientRect();
}

penBtn.addEventListener('click', function() 
{
    currentTool = ToolType.Pen;
})

eraserBtn.addEventListener('click', function() 
{
    currentTool = ToolType.Eraser;
})

selectSpriteSizeBtn.addEventListener('click', function()
{
    painter.scale(1/scaleFactor, 1/scaleFactor); // "Unscale" the canvas before rescaling it to its new scaling in the setupCanvas() method
    painterBG.scale(1/scaleFactor, 1/scaleFactor);
    spriteSize = parseInt(spriteSizeSelect.value);
    scaleFactor = canvas.width / spriteSize;
    painter.clearRect(0, 0, spriteSize, spriteSize);
    painterBG.clearRect(0, 0, spriteSize, spriteSize);
    pixelData = [[]];
    setupCanvas();
})

setColorBtn.addEventListener('click', function()
{
    penColor = colorSelect.value;
})

//
// ---------- FUNCTIONS ----------
//

function setupCanvas()
{
    painter.scale(scaleFactor, scaleFactor);
    painterBG.scale(scaleFactor, scaleFactor);

    // Initialize the canvas with opacity-0 color values
    for (let i = 0; i < spriteSize; i++) 
    {
        pixelData[i] = [];
        for (let j = 0; j < spriteSize; j++) {
            pixelData[i][j] = 'rgba(0, 0, 0, 0)';
        }
    }

    drawBG();
    drawSprite();
}

// Draw Background
function drawBG()
{
    painterBG.fillStyle = "rgb(255, 255, 255, 1)";
    painterBG.fillRect(0, 0, spriteSize, spriteSize);
    for (let i = 0; i < spriteSize; i++)
    {
        for (let j = 0; j < spriteSize; j++)
        {
            if (((i+j) % 2) == 0)
            {
                painterBG.fillStyle = "rgb(30, 30, 30, .1)";
                painterBG.fillRect(i, j, 1, 1);
            }
            else
            {
                painterBG.fillStyle = "rgb(30, 30, 30, .2)";
                painterBG.fillRect(i, j, 1, 1);
            }
        }
    }
}

// Draw data stored in pixelData
function drawSprite() 
{
    painter.clearRect(0, 0, spriteSize, spriteSize);
    for (let i = 0; i < spriteSize; i++) {
        for (let j = 0; j < spriteSize; j++) {
            painter.fillStyle = pixelData[i][j];
            painter.fillRect(i, j, 1, 1);
        }
    }
}

// Input pixel data
function handleDrawInput() 
{
    console.log(mouseDown);
    if (mouseDown && mouseInBounds())
    {
        //console.log('X: ' + mouseX + ' | Y: ' + mouseY);
        let pixelX = Math.floor((mouseX) / scaleFactor);
        let pixelY = Math.floor((mouseY) / scaleFactor);
        if (mouseInBounds()) {
            if (currentTool == ToolType.Pen) {
                pixelData[pixelX][pixelY] = penColor;
            }
            else if (currentTool == ToolType.Eraser) {
                pixelData[pixelX][pixelY] = 'rgba(0, 0, 0, 0)';
            }
        }
        drawSprite();
    }

}

function mouseInBounds() 
{
    if (mouseX >= 0 && mouseX <= canvas.width-1 && mouseY >= 0 && mouseY <= canvas.height-1) {
        return true;
    }
    return false;
}

// Save the canvas to a PNG image
// Credit: https://stackoverflow.com/questions/11112321/how-to-save-canvas-as-png-image
function DownloadCanvasAsImage() 
{
    let downloadLink = document.createElement('a');
    downloadLink.setAttribute('download', 'CanvasAsImage.png');
    let dataURL = canvas.toDataURL('image/png');
    let url = dataURL.replace(/^data:image\/png/,'data:application/octet-stream');
    downloadLink.setAttribute('href', url);
    downloadLink.click();
}