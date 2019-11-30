// grab the canvas element, get the context for API access and
// preset some variables
var canvas = document.querySelector( 'canvas' ),
    c = canvas.getContext( '2d' ),
    mouseX = 0,
    mouseY = 0,
    width = 1500,
    height = 550,
    colour = 'hotpink',
    mousedown = false;

// resize the canvas
canvas.width = width;
canvas.height = height;


function getYellow(){
    colour = 'yellow';
}

function getRed(){
    colour = 'red';
}

function getBlack(){
    colour = 'black';
}
function getGreen(){
    colour = 'green';
}
function getPink(){
    colour = 'pink';
}
function getWhite(){
    colour = 'white';
}


function draw() {
    if (mousedown) {
        // set the colour
        c.fillStyle = colour;
        // start a path and paint a circle of 20 pixels at the mouse position
        c.beginPath();
        c.arc( mouseX, mouseY, 10 , 0, Math.PI*2, true );
        c.closePath();
        c.fill();
    }
}

// get the mouse position on the canvas (some browser trickery involved)
canvas.addEventListener( 'mousemove', function( event ) {
    if( event.offsetX ){
        mouseX = event.offsetX;
        mouseY = event.offsetY;
    } else {
        mouseX = event.pageX - event.target.offsetLeft;
        mouseY = event.pageY - event.target.offsetTop;
    }
    // call the draw function
    draw();
}, false );

canvas.addEventListener( 'mousedown', function( event ) {
    mousedown = true;
}, false );
canvas.addEventListener( 'mouseup', function( event ) {
    mousedown = false;
}, false );

var link = document.createElement('a');
link.innerHTML = 'download image';
link.addEventListener('click', function(ev) {
    link.href = canvas.toDataURL();
    link.download = "mypainting.png";
}, false);
document.body.appendChild(link);



//     colour = 'white',
