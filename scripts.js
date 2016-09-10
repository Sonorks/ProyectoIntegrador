/*global alert: false */
/*global HTMLAudioElement: false */
/*global Event: false */
/*global console: false */
/*global Tone:false */
/*global requestAnimationFrame: false */
document.write("<"+"script type='text/javascript' src='pixi.min.js'><"+"/script>")
// Autodetect and create the renderer
var counter =0;
var renderer;
var canvas;
var stage;
var graphics;
var notas = [];
function iniciarPixi(){
  renderer = PIXI.autoDetectRenderer(1000, 300);
  renderer.backgroundColor = 0xCEF6F5;
  canvas = document.getElementById('canvas');
  canvas.appendChild(renderer.view);
  stage = new PIXI.Container();
  //renderer.view.backgroundImage()
  graphics = new PIXI.Graphics();
 
  for (var i=0; i<15; i++){
      var a_quarter = PIXI.Sprite.fromImage('quarter_note.png');
      a_quarter.width = 40;
      a_quarter.height = 50;
      a_quarter.x =700 +(100*i);a_quarter.y=120;
      notas.push(a_quarter);
      stage.addChild(a_quarter);
  }
  graphics.drawRect(100,100,20,200);
  stage.addChild(graphics);
  
  animate();
 
  document.getElementById("BotonInicio").displayObject= false;
  
}
function animate() {
    "use strict";
    for (var i=0; i< 15; i++){
        var nota = notas[i];
        if (notas[counter].x === 55 || notas[counter.x] === 54) {
        notas[counter].visible = false;
        counter +=1;
        }
        notas[i].x -= 1;
    }
    requestAnimationFrame(animate);
    
   
    renderer.render(stage);
}

function makeNoteBigger() {
    "use strict";
    a_quarter.width = 60;
    a_quarter.height = 70;
    renderer.render(stage);
}

function makeNoteSmaller() {
    "use strict";
    a_quarter.width = 30;
    a_quarter.height = 35;
    renderer.render(stage);
}
function metronomo() {
    "use strict";
	var synth = new Tone.Synth().toMaster();
	Tone.Transport.start();
	Tone.Transport.scheduleRepeat(function (time) {
		synth.triggerAttackRelease("B4", "8n");
		console.log(time);
	}, "0.5");

}

function izq() {
	"use strict";
	var synth = new Tone.Synth().toMaster();
	synth.triggerAttackRelease("C4", "8n");
    puntaje();
}

function der() {
    "use strict";
	var synth = new Tone.Synth().toMaster();
	synth.triggerAttackRelease("A4", "8n");
    puntaje();
}
function s(Event) {
	"use strict";
	var char = event.which || event.keyCode;
	console.log(char);
	if (char === 115 || char === 83) {
		izq();
	} else if (char === 75 || char === 107) {
		der();
	}
}
function puntaje() {
    "use strict";
    if (notas[counter].x <= 110 && notas[counter].x > 50) {
        var puntaje = document.getElementById('Score').innerHTML - (-100);
        document.getElementById('Score').innerHTML = puntaje;
        console.log("gj");

    } else {
        var puntaje = document.getElementById('Score').innerHTML - 100;
        document.getElementById('Score').innerHTML = puntaje;
        console.log("pls"+notas[counter].x);
        console.log(counter);
    }
}
