
window.addEventListener('deviceorientation', moveAnimal);
window.addEventListener('deviceorientation', changeColor);
function changeColor(ev) {
    if (ev.beta < 4 && ev.beta > -4 && ev.gamma < 4 && ev.gamma > -4) {
        if (ev.alpha > 0 && ev.alpha < 90) document.body.style.background = "red";/////
        else if (ev.alpha > 90 && ev.alpha < 180) document.body.style.background = "blue";////
        else if (ev.alpha > 180 && ev.alpha < 270) document.body.style.background = "green";
        else if (ev.alpha > 270 && ev.alpha < 360) document.body.style.background = "yellow";//////
    }
}

//var output = document.querySelector('.output');
var animal   = document.querySelector('.animal');
var maxX= 1430; //document.body.clientWidth;
var maxY= 800;  // window.screen.availHeight;

function moveAnimal(event) {
    var x = event.beta;  //-180=-90.....90=180
    var y = event.gamma; //-90,90

    if(!(x < 4 && x > -4 && y < 4 && y > -4))
        document.body.style.backgroundImage = "url('../pictures/bambus1.jpg')";////

   // output.innerHTML  = "beta : " + x + "\n";
    //output.innerHTML += "gamma: " + y + "\n";

    if(x<-90){ y=0; x=0}
    if(x>90) {y=0;x=0}
    if(y<-90){ x=0;y=0}
    if(y>90){ x=0;y=0}

    x += 90;
    y += 90;

    //output.innerHTML  += "x : " + x + "\n";
   // output.innerHTML += "y: " + y + "\n";


    animal.style.top  = (maxX*x/180) + "px";
    animal.style.left = (maxY*y/180) + "px";


    //output.innerHTML  += "px : " + (maxX*x/180-200) + "\n";
   // output.innerHTML += "py: " + (maxY*y/180-200) + "\n";

    //output.innerHTML  += "maxX : " + maxX + "\n";
   // output.innerHTML += "maxY: " + maxY + "\n";
}


