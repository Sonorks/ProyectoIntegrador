/*global alert: false */
/*global HTMLAudioElement: false */
/*global Event: false */
/*global console: false */
/*global Tone:false */
/*global requestAnimationFrame: false */
// Autodetect and create the renderer
var counter =0;
var renderer;
var canvas;
var stage;
var graphics;
var pent;
//Nivel de dificultad
var level=2;
var notas = [];
var count = 0;
var posiciones = [700,750,850,900,950,1000,1050,1100,1200,1250,1300,1350,1400,1450,1550,1600,1650,1700,1750,1800,1900,1950,2000,2050,2100,2150,2250,2300,2350,2400,2450,2500,2600,2750,2800,2850,2950,3000,3050,3100,3150,3200,3300,3450]
function iniciarPixi(){
  renderer = PIXI.autoDetectRenderer(1000, 300, {transparent: true});
  canvas = document.getElementById('canvas');
  canvas.appendChild(renderer.view);
  stage = new PIXI.Container();
  graphics = new PIXI.Graphics();
  //Crea las notas
  for (var i=0; i<posiciones.length; i++){
    var a_quarter = makeQuarterNote();
    a_quarter.y = 110;
    a_quarter.x = posiciones[i];
    notas.push(a_quarter);
    stage.addChild(a_quarter);
  }
  pent = makePentagram();
  graphics.drawRect(100,70,20,200);
  stage.addChild(graphics);
  stage.addChild(pent);
  //comienza la animacion
  animate();

  document.getElementById("BotonInicio").displayObject= false;
  document.getElementById("BotonInicio").disabled = true;

}

function makePentagram(){
  var pentagram = new PIXI.Graphics();
  // set a line style again
  pentagram.lineStyle(2, 0x000000, 0.5);
  //start drawing
  pentagram.moveTo(0,100);
  pentagram.lineTo(1000,100);
  pentagram.moveTo(0,120);
  pentagram.lineTo(1000,120);
  pentagram.moveTo(0,140);
  pentagram.lineTo(1000,140);
  pentagram.moveTo(0,160);
  pentagram.lineTo(1000,160);
  pentagram.moveTo(0,180);
  pentagram.lineTo(1000,180);
  pentagram.moveTo(1,100);
  pentagram.lineTo(1,180);
  pentagram.moveTo(1000,100);
  pentagram.lineTo(1000,180);
  pentagram.drawRect(30,90,20,100);
  return pentagram;


}

//Este metodo hace el dibujo de la cuarta
function makeQuarterNote(){
  var a_quarter = new PIXI.Graphics();
  // set a fill and line style again
  a_quarter.lineStyle(5, 0x000000, 1);
  a_quarter.beginFill(0x000000, 1);
  // draw a second shape
  a_quarter.moveTo(11,0);
  a_quarter.lineTo(11,50);
  a_quarter.drawCircle(5,50,6);
  a_quarter.endFill();
  //a_quarter.width = 40;
  //a_quarter.height = 50;
  return a_quarter;
}

function animate() {
  "use strict";
  for (var i=0; i<posiciones.length; i++){
    var nota = notas[i];
    if (notas[counter].x < 55) {
      notas[counter].visible = false;
      counter +=1;
    }
    /*if (notas[counter].x < 100){
        count = 0.8;
        notas[counter].scale.x = Math.sin(count)
        notas[counter].scale.y = Math.sin(count)
        notas[counter].rotation += 0.01
    }*/
    notas[i].x -= level;
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
  if (notas[counter].x <= 100 - (level*3) && notas[counter].x > 55) {
    var puntaje = document.getElementById('Score').innerHTML - (-100);
    document.getElementById('Score').innerHTML = puntaje;
    animateRotation();
    console.log("gj");

  } else {
    var puntaje = document.getElementById('Score').innerHTML - 100;
    document.getElementById('Score').innerHTML = puntaje;    
    console.log("pls"+notas[counter].x);
    console.log(counter);
  }
}

function animateRotation() {
  "use strict";
  count = 0.6;
  notas[counter].scale.x = Math.sin(count)
  notas[counter].scale.y = Math.sin(count)
  notas[counter].rotation += 0.75
  //requestAnimationFrame(animateRotation);    
  renderer.render(stage);
}
