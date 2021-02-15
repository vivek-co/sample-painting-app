var canvas, // to access canvas element from html
    contxt, // to get context of canvas
    dragging = false, // to identify mouse dragging
    dragStartPoint, // for drag start point
    imgData, // to put image in context
    triangles = [], // to save cordinates of drawn triangles
    startPoints = [], // to save starting points of drwan triangles
    colour, // for random color
    colours = []; // to save colours of drwan triangles

function getCanvasCoordinates(event) {
    var x = event.clientX - canvas.getBoundingClientRect().left,
        y = event.clientY - canvas.getBoundingClientRect().top;

    return { x: x, y: y };
}

// Using getImageData function get the previous data and store in imgData variable.
function copy() {
    imgData = contxt.getImageData(0, 0, canvas.width, canvas.height);
}

// Put previous data using putImageData function.
function paste() {
    contxt.putImageData(imgData, 0, 0);
}


// Draw the Triangle using Mouse Coordinates.
function drawTriangle(position) {
    var coordinates = [],
        angle = 100,
        sides = 3,

        radius = Math.sqrt(Math.pow((dragStartPoint.x - position.x), 2) + Math.pow((dragStartPoint.x - position.x), 2)),
        index = 0;

    for (index = 0; index < sides; index++) {
        coordinates.push({ x: dragStartPoint.x + radius * Math.cos(angle), y: dragStartPoint.y - radius * Math.sin(angle) });
        angle += (2 * Math.PI) / sides;
    }
    contxt.fillStyle = colour;
    contxt.beginPath();
    contxt.strokeStyle = 'black';
    contxt.lineWidth = 5;
    contxt.moveTo(coordinates[0].x, coordinates[0].y);
    for (index = 1; index < sides; index++) {
        contxt.lineTo(coordinates[index].x, coordinates[index].y);
    }
    contxt.closePath();
    contxt.stroke();
    contxt.fill();
}

//randomColor function is helps to generate different color randomaly.
function randomColor() {
    var r = Math.round(Math.random() * 256);
    var g = Math.round(Math.random() * 256);
    var b = Math.round(Math.random() * 256);

    return 'rgb( ' + r + ',' + g + ',' + b + ')';

}

// Using dragstart, drag, and dragStop function we find out where the  starting position, drag interval, and 
// end position of the Mouse and it takes event as a perameter,
function dragStart(event) {
    dragging = true;
    dragStartPoint = getCanvasCoordinates(event);
    startPoints.push(dragStartPoint);
    copy();
}

function drag(event) {
    var position;
    if (dragging === true) {
        paste();
        position = getCanvasCoordinates(event);
        colour = randomColor();
        drawTriangle(position);
    }
}

function dragStop(event) {
    dragging = false;
    paste();
    colour = randomColor();
    var position = getCanvasCoordinates(event);
    triangles.push(position);
    colours.push(colour);
    drawTriangle(position);

}

function deleteTriangle(event) {
    contxt.clearRect(0, 0, canvas.width, canvas.height);
    let i = 0;
    while (triangles[i]) {
        if (triangles[i].x != event.layerX && triangles[i].y != event.layerY) {
            dragStartPoint = startPoints[i];
            colour = colours[i];
            drawTriangle(triangles[i]);
            i++;
        } else {
            triangles.splice(i, 1);
            startPoints.splice(i, 1);
            colours.splice(i, 1);
        }
    }
}


function init() {
    canvas = document.getElementById("triangle"); // Find the canvas element using getElementById function,
    contxt = canvas.getContext('2d');

    // Using addEventListener function attack a click event to the Documents, when the User clicks anywhere in the Documents,
    canvas.addEventListener('mousedown', dragStart, false);
    canvas.addEventListener('mousemove', drag, false);
    canvas.addEventListener('mouseup', dragStop, false);
    canvas.addEventListener('dblclick', deleteTriangle, false);

    document.getElementById("clear").addEventListener('mousedown', function () {
        contxt.clearRect(0, 0, canvas.width, canvas.height);
        triangles = [];
        startPoints = [];
        colours = [];
    });


}

window.addEventListener('load', init, false);
