/*global alert: false */
/*global HTMLAudioElement: false */
/*global Event: false */
/*global console: false */
/*global Tone:false */
/*global PIXI:false */
/*global requestAnimationFrame: false */
// Autodetect and create the renderer
var renderer = PIXI.autoDetectRenderer(800, 600);

  // Set the background color of the renderer to a baby-blue'ish color
renderer.backgroundColor = 0x3498db;

  // Append the renderer to the body of the page
document.body.appendChild(renderer.view);

  // Se crea el contenedor principal
var stage = new PIXI.Container();
var graphics = new PIXI.Graphics();

  //Se crea la nota
var a_quarter = PIXI.Sprite.fromImage('quarter_note.png');
a_quarter.width = 40;
a_quarter.height = 50;
a_quarter.x = 700;
a_quarter.y = 120;

//Definicion del rectangulo
graphics.drawRect(100, 100, 20, 200);

  // Add the elements to the stage
stage.addChild(graphics);
stage.addChild(a_quarter);

// Start animating
animate();

function animate() {
    "use strict";
    requestAnimationFrame(animate);
    // La nota se mueve
    a_quarter.x -= 1;
    // La nota desaparece si pasa el rectangulo
    if (a_quarter.x === 55) a_quarter.visible = false;
    // Render our container
    renderer.render(stage);
}

function makeNoteBigger() {
    "use strict";
    a_quarter.width = 60;
    a_quarter.height = 70;
    // Render our container
    renderer.render(stage);
}

function makeNoteSmaller() {
    "use strict";
    a_quarter.width = 30;
    a_quarter.height = 35;
    // Render our container
    renderer.render(stage);
}
function iniciar() {
	//el Metronomo
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
	//var sonido = document.getElementById("sonido");
	//sonido.play();
	var synth = new Tone.Synth().toMaster();
	synth.triggerAttackRelease("C4", "8n");
	document.getElementById("res").textContent = document.getElementById("res").textContent + "I-";
}

function der() {
    "use strict";
	var synth = new Tone.Synth().toMaster();
	synth.triggerAttackRelease("A4", "8n");
	document.getElementById("res").textContent = document.getElementById("res").textContent + "D-";
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
    if (a_quarter.x <= 110 && a_quarter.x >= 90) {
        var puntaje = document.getElementById('Score').innerHTML + 100;
        document.getElementById('Score').innerHTML = puntaje;
        console.log("gj");
    } else {
        var puntaje = document.getElementById('Score').innerHTML - 100;
        document.getElementById('Score').innerHTML = puntaje;
        console.log("pls..");
    }
}
