/*global alert: false */
/*global HTMLAudioElement: false */
/*global Event: false */
/*global console: false */
/*global Tone:false */
/*global requestAnimationFrame: false */
// Autodetect and create the renderer
/*MACROS*/
var PI_NUMBER = 3.14159265359;
var PI_MEDIOS = PI_NUMBER/2;
var Y_FIRST_PENT = 30;
var Y_FIRST_SPACE_1 = 40; /**Posición del primer espacio del pentagrama 1*/
var Y_FIRST_SPACE_2 = 170; /**Posición del primer espacio del pentagrama 2*/
var HEIGHT_PENT = 100;
var GAP_FROM_PENTS = 30;/**Espacion qye hay entre pentagrama 1 y 2*/
var Y_SECOND_PENT = Y_FIRST_PENT+HEIGHT_PENT+GAP_FROM_PENTS;
var HEIGHT_NOTE = 50;
var HEIGHT_PENT_SPACE = 20; /**Altura del espacio del pentagrama*/
var NOTE_HEIGHT;
var DO_SPACE = Y_FIRST_PENT+HEIGHT_PENT_SPACE*3; /**Posición del espacio DO, cuarta linea de arriba a abajo*/
var NOTE_IN_DO = DO_SPACE-NOTE_HEIGHT;
var PENT_DISTANCE = Y_FIRST_SPACE_2-Y_FIRST_SPACE_1; /**Espacio entre espacios de los pentagrmas*/
//Constantes
var counter=0;
var counter2=0;
var renderer;
var canvas;
var stage;
var graphics;
var pent;
//Nivel de dificultad
var level=4;
var notas = [];
var notas2 = [];
var notasTocadas = [];
var notasTocadas2 = [];
var count = 0;
var añadiduras = [];
var posiciones2  =[];//= [800,900,1100,1250,1400,1600,1700,1900,2050,2200,2400,2500,2700,2850,3000,3200,3300,3500,3650,3800];
var posiciones = []//; [700,800,900,950,1050,1100,1200,1250,1350,1450,1500,1600,1700,1750,1850,1900,2000,2050,2150,2250,2300,2400,2500,2550,2600,2650,2750,2800,2850,2950,3000,3050,3100,3200,3300,3350,3400,3450,3550,3600,3650,3750,3800,3850,3900];

function readTextFile(file)
{
    file1 = "./canciones/timbal1.txt";
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET",file1,false);
    rawFile.setRequestHeader('Content-Type','text/plain')
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                posiciones = allText.split(",");
            }
        }
    }
    rawFile.send(null);
    file2 = "./canciones/timbal2.txt";
    var rawFile2 = new XMLHttpRequest();
    rawFile2.open("GET",file2,false);
    rawFile2.setRequestHeader('Content-Type','text/plain')
    rawFile2.onreadystatechange = function ()
    {
        if(rawFile2.readyState === 4)
        {
            if(rawFile2.status === 200 || rawFile2.status == 0)
            {
                var allText = rawFile2.responseText;
                posiciones2 = allText.split(",");
            }
        }
    }
    rawFile2.send(null);
    iniciarPixi();
}

function iniciarPixi(){

  //readTextFile();
  renderer = PIXI.autoDetectRenderer(1000, 300, {transparent: true});
  canvas = document.getElementById('canvas');
  canvas.appendChild(renderer.view);
  stage = new PIXI.Container();
  graphics = new PIXI.Graphics();
  //Crea las notas
  for (var i=0; i<posiciones.length; i++){
   var negra = makeQuarterNote();
   NOTE_HEIGHT = negra.height;
    if(posiciones[i+1]-posiciones[i] === 50){
        semi = semiCorchea(posiciones[i]);
        semi.y = NOTE_IN_DO;
        semi.x = posiciones[i];
        añadiduras.push(semi);
        stage.addChild(semi);
    }
    negra.y = NOTE_IN_DO;
    negra.x=posiciones[i];
    notas.push(negra);
    stage.addChild(negra);
  }

  for (var i=0; i<posiciones2.length; i++){
    var negra = makeQuarterNote();
    if(posiciones2[i+1]-posiciones2[i] === 50){
        semi = semiCorchea(posiciones2[i]);
        semi.y = Y_FIRST_SPACE_2+(HEIGHT_PENT_SPACE);
        semi.x = posiciones2[i];
        //Si se requiere voltear
        rotate(a_quarter);
        añadiduras.push(semi);
        stage.addChild(semi);
    }
    negra.y = Y_FIRST_SPACE_2+HEIGHT_PENT_SPACE;
    negra.x=posiciones2[i];
    notas2.push(negra);
    stage.addChild(negra);
    
  }

  pent = makePentagram();
  pent.y = Y_FIRST_PENT;
  var pent2= makePentagram();
  pent2.y = Y_SECOND_PENT;
  graphics.drawRect(100,0,20,290);
  stage.addChild(graphics);
  stage.addChild(pent);
  stage.addChild(pent2);
  //comienza la animacion
  animate();

  document.getElementById("BotonInicio").displayObject= false;
  document.getElementById("BotonInicio").disabled = true;
}

function rotate(note){
  setCenterPivot(note);
  note.rotation = PI_NUMBER;
  //arregla desfase.
  note.y = note.y+30;

}

function setCenterPivot(graphic){
  //vamos a obtener el centro del container para usarlo
  //de eje de rotacion
  var mitad_y = graphic.height/2;
  var mitad_x = graphic.width/2;
  graphic.pivot = new PIXI.Point(mitad_x,mitad_y);
  console.log("pivot = " + graphic.pivot);
  console.log("mitad_y = " + mitad_y);
  console.log("mitad_x = " + mitad_x);
}

function makePentagram(){
  var pentagram = new PIXI.Graphics();
  // set a line style again
  pentagram.lineStyle(2, 0x000000,1);
  //start drawing
  pentagram.drawRect(0,10,1000,20);
  pentagram.drawRect(0,30,1000,20);
  pentagram.drawRect(0,50,1000,20);
  pentagram.drawRect(0,70,1000,20);
  pentagram.drawRect(30,0,20,100);
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
  a_quarter.lineTo(11,HEIGHT_NOTE);
  a_quarter.drawCircle(5,HEIGHT_NOTE,5);
  a_quarter.endFill();
  QUARTER_NOTE_HEIGHT = a_quarter.height;
  return a_quarter;
}

function quarterNoteX(){
  var note = new PIXI.Graphics();
  // set a fill and line style again
  note.lineStyle(5, 0x000000, 1);
  note.beginFill(0x000000, 1);
  note.moveTo(20,0);
  note.lineTo(20,HEIGHT_NOTE);
  note.lineStyle(3,0x000000,1);
  note.lineTo(0,70);
  note.moveTo(0,HEIGHT_NOTE);
  note.lineTo(20,70);
  note.endFill();
  return note;
}

function semiCorchea(){
  var note = new PIXI.Graphics();
  note.lineStyle(5, 0x000000, 1);
  note.beginFill(0x000000, 1);
  note.moveTo(0,0);
  note.lineTo(50,0);
  note.endFill();
  var semiQuaver = new PIXI.Graphics();
  //la semecorchea esta hecha de dos negras unidas
  var qNote = makeQuarterNote();
  semiQuaver.addChild(note);
  return semiQuaver;
}


function animate() {
  "use strict";
  for (var i=0; i<posiciones.length; i++){
    var nota = notas[i];
    if (counter < posiciones.length){
        if (notas[counter].x < 55) {
          if(notasTocadas[counter] != 1){
              var puntaje = document.getElementById('Score').innerHTML - 200;
              document.getElementById('Score').innerHTML = puntaje;
          }
        notas[counter].visible = false;
        counter +=1;
        }
    }
	notas[i].x -= level;
  }
      for (var i=0; i<posiciones2.length; i++){
        var nota = notas2[i];
        if (counter2 < posiciones2.length){
            if (notas2[counter2].x < 55 ) {
                if(notasTocadas2[counter2] != 1){
                    var puntaje = document.getElementById('Score').innerHTML - 200;
                    document.getElementById('Score').innerHTML = puntaje;
                }
                notas2[counter2].visible = false;
                counter2 +=1;
            }
        }
      notas2[i].x -= level;
      }
    for(var j =0; j<añadiduras.length; j++){
        if(añadiduras[j].x <55){
            añadiduras[j].visible = false;
        }
        añadiduras[j].x -= level;
    }
    if(counter2===posiciones2.length && counter === posiciones.length){
        console.log("Fin del juego");
    }
  requestAnimationFrame(animate);
  renderer.render(stage);

}

function metronomo() {
  "use strict";
     var synth = new Tone.Synth().toMaster();
  Tone.Transport.start();
  Tone.Transport.scheduleRepeat(function (time) {
  synth.triggerAttackRelease("B1","8n");
  }, "0.48");

}

function izq() {
  "use strict";
  var cascara = new Howl({
  src: ['audios/cascaraHTML.mp3']
  });
  cascara.play();
  puntaje(false);
}

function der() {
  "use strict";
  var campana = new Howl({
  src: ['audios/campanaHTML.mp3']
  });
  campana.play();
  puntaje(true);
}
function s(Event) {
  "use strict";
  var char = event.which || event.keyCode;
  if (char === 115 || char === 83) {
    izq();
  } else if (char === 75 || char === 107) {
    der();
  }
}
function puntaje(mano) {
  "use strict";
//true = derecha, false = izquierda
  if(mano === true){
      if (notas[counter].x <= 130 - (level*3) && notas[counter].x > 85) {
        var puntaje = document.getElementById('Score').innerHTML - (-100);
        document.getElementById('Score').innerHTML = puntaje;
        animateRotation(mano);
        notasTocadas[counter]=1;

      } else {
        var puntaje = document.getElementById('Score').innerHTML - 100;
        document.getElementById('Score').innerHTML = puntaje;
      }
  }
  else if (mano === false){
      if (notas2[counter2].x <= 130 - (level*3) && notas2[counter2].x > 85) {
        var puntaje = document.getElementById('Score').innerHTML - (-100);
        document.getElementById('Score').innerHTML = puntaje;
        animateRotation(mano);
        notasTocadas2[counter2]=1;

      } else {
        var puntaje = document.getElementById('Score').innerHTML - 100;
        document.getElementById('Score').innerHTML = puntaje;
      }
  }
}

function animateRotation(mano) {
  "use strict";
    //true = derecha, false = izquierda
  count = 0.6;
  if(mano === true){
  notas[counter].scale.x = Math.sin(count)
  notas[counter].scale.y = Math.sin(count)
  notas[counter].rotation += 0.75
  }
  else if(mano === false){
  notas2[counter2].scale.x = Math.sin(count)
  notas2[counter2].scale.y = Math.sin(count)
  notas2[counter2].rotation += 0.75
  }
  //requestAnimationFrame(animateRotation);
  renderer.render(stage);
}
