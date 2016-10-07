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
var level=2;
var notas = [];
var notas2 = [];
var notasTocadas = [];
var notasTocadas2 = [];
var count = 0;
var añadiduras = [];
var partituras = [];
var posicion=700;
var posicion2 = 700;
var posiciones2  =[];//= [800,900,1100,1250,1400,1600,1700,1900,2050,2200,2400,2500,2700,2850,3000,3200,3300,3500,3650,3800];
var posiciones = []//; [700,800,900,950,1050,1100,1200,1250,1350,1450,1500,1600,1700,1750,1850,1900,2000,2050,2150,2250,2300,2400,2500,2550,2600,2650,2750,2800,2850,2950,3000,3050,3100,3200,3300,3350,3400,3450,3550,3600,3650,3750,3800,3850,3900];



function readTextFile(file) //Leemos los archivos de ritmos usando una peticion HTTP Request. Como HTTP usualmente es para acceso remoto, para usarlo local permitimos a chrome hacerlo con allow--files-from-local
{
    file1 = "./canciones/pruebas.txt"; //Directorio del archivo de ritmos para el pentagrama superior
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
                partituras = allText.split(","); //En el archivo las notas estan separadas por comas (,)
            }
        }
    }
    rawFile.send(null);
    file2 = "./canciones/pruebas.txt"; //Directorio del archivo de ritmos para el pentagrama inferior
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
                partituras2 = "";
                //partituras2 = allText.split(","); //En el archivo las notas estan separadas por comas (,)
            }
        }
    }
    rawFile2.send(null);
    iniciarPixi(); //Una vez leidos los archivos empiezan las animaciones
}

function iniciarPixi(){
  //readTextFile();
  renderer = PIXI.autoDetectRenderer(1000, 300, {transparent: true});
  canvas = document.getElementById('canvas');
  canvas.appendChild(renderer.view);
  stage = new PIXI.Container();
  graphics = new PIXI.Graphics();
  //Crea las notas
  for (var i=0; i<partituras.length; i++){
      switch(partituras[i]){
          case 'n':
              dibujarNegra(100,1,1,0); //(TiempoDeLaNota,Mano(Derecha=pentagrama superior, Izquierda=Pentagrama inferior,Rotar,Redoble (1=con redoble, 0=sin))
              break;
          case 'nr':
              dibujarNegra(100,1,1,1);
              break;    
          case 'nx':
              quarterNoteX(100,1,1);
              break;
          case 'sc1d':
              dibujarSemiCorchea1(50,1,1,0,0,0,1);//dibujarSemiCorchea1(aumento,mano,tipo,rotar,redoble1,redoble2,doble);
              break;
          case 'sc2d':
              if (partituras[i-1]==='sc1' || partituras[i-1]==='sc2' || partituras[i-1]==='sc1x' || partituras[i-1]==='sc2x' || partituras[i-1]=== 'sc1d'){
                 dibujarSemiCorchea2(0,1,1,0,0,0,1);//dibujarSemiCorchea1(aumento,mano,tipo,rotar,redoble1,redoble2,doble);
              break;
              }
              else{
                 dibujarSemiCorchea2(50,1,1,0,0,0,1);
              }
              break;
          case 'b':
              dibujarBlanca(); //No esta dibujada jijijojo
              break;
          case 'sn':
              posicion+=100;
              break;
          case 'ssc':
              dibujaSilencioCorchea(50,1);
              break;
          case 'sb':
              posicion+=200;
              break;
          case 'pc':
              procesarCorchea(4,1,0,0);
              break;
          case 'psc':
              procesarSemiCorchea(4,1,0,0);
              break;
          //A la verga todo preprocesamiento de la hilera del usuario para transformar las corcheas unidas en figuras propias de la graficada
          //AQUI HAY ERRORES CON LAS NOTACIONES DE LAS CORCHEAS: SE PROPONE LEER LA NOTA QUE SIGUE (I+1) Y SI ES CORCHEA DIBUJAR LA BARRA HORIZONTAL.
          //PARA LA ULTIMA SE PUEDE LEER (I-1) PARA DIBUJAR UNA NEGRA EN LUGAR DE LA CORCHEA COMO TAL
          case 'sc1r':
              dibujarSemiCorchea1(50,1,1,0,1,0,0);
              break;
          case 'sc1r2r':
              dibujarSemiCorchea1(50,1,1,0,1,1,0);
              break;
          case 'sc2r':
              dibujarSemiCorchea1(50,1,1,0,0,1,0);
              break;
          case 'sc':
              dibujarCorchea(50,1,1,0); //aumento,mano,rotar,redoble
              break;
          case 'scr':
              dibujarCorchea(50,1,1,1);
              break;
          case 'scx':
              quarterNoteX(50,1,1);
          case 'sc1':
              dibujarSemiCorchea1(50,1,1,1,0,0);
              break;
          case 'sc1x':
              dibujarSemiCorchea1(50,1,2,1,0,0);
              break;
          case 'sc2':
              if (partituras[i-1]==='sc1' || partituras[i-1]==='sc2' || partituras[i-1]==='sc1x' || partituras[i-1]==='sc2x' || partituras[i-1]=== 'sc1d'){
                 dibujarSemiCorchea2(0,1,1,1,0,0,0);
              }
              else{
                 dibujarSemiCorchea2(50,1,1,1,0,0,0);
              }
              break;
          case 'sc2x':
              if (partituras[i-1]==='sc1' || partituras[i-1]==='sc' || partituras[i-1]==='sc1x' || partituras[i-1]==='scx' || partituras[i-1]=== 'sc1d'){
                  dibujarSemiCorchea2(0,1,2,1,0,0,0);
              }
              else{
                  dibujarSemiCorchea2(50,1,2,1,0,0,0);
              }
              break;
          default:
              console.log("Caracter: "+partituras[i]+" no especificado. "+i);
      }

  }

  for (var i=0; i<partituras2.length; i++){
        switch(partituras2[i]){
          case 'n':
              dibujarNegra(100,2,1,0);
              break;
          case 'nr':
              dibujarNegra(100,2,1,1);
              break;
          case 'nx':
              quarterNoteX(100,2,1);
              break;
          case 'b':
              dibujarBlanca();
              break;
          case 'sn':
              posicion2+=100;
              break;
          case 'ssc':
              dibujaSilencioCorchea(50,2);
              break;
          case 'sb':
              posicion2+=200;
          case 'pc':
              procesarCorchea(4,1,0);
              break;
          //A la verga todo preprocesamiento de la hilera del usuario para transformar las corcheas unidas en figuras propias de la graficada
          //AQUI HAY ERRORES CON LAS NOTACIONES DE LAS CORCHEAS: SE PROPONE LEER LA NOTA QUE SIGUE (I+1) Y SI ES CORCHEA DIBUJAR LA BARRA HORIZONTAL.
          //PARA LA ULTIMA SE PUEDE LEER (I-1) PARA DIBUJAR UNA NEGRA EN LUGAR DE LA CORCHEA COMO TAL
          case 'sc1d':
              dibujarSemiCorchea1(50,2,1,0,0,0,1);//dibujarSemiCorchea1(aumento,mano,tipo,rotar,redoble1,redoble2,doble);
              break;
          case 'sc2d':
              if (partituras2[i-1]==='sc1' || partituras2[i-1]==='sc2' || partituras2[i-1]==='sc1x' || partituras2[i-1]==='sc2x' || partituras2[i-1]=== 'sc1d'){
                 dibujarSemiCorchea2(0,2,1,1,0,0,1);//dibujarSemiCorchea1(aumento,mano,tipo,rotar,redoble1,redoble2,doble);
              break;
              }
              else{
                 dibujarSemiCorchea2(50,2,1,1,0,0,1);
              }
              break;
          case 'sc':
              dibujarCorchea(50,2,1,0); //dibujar SemiCorchea
              break;
          case 'scr':
              dibujarCorchea(50,2,1,1); //dibujar SemiCorchea
              break;
          case 'scx':
              quarterNoteX(50,2,1); //dibujar SemiCorcheaX
          case 'sc1':
              dibujarSemiCorchea1(50,2,1,1);
              break;
          case 'sc1x':
              dibujarSemiCorchea1(50,2,2,1);
              break;
          case 'sc2':
              if (partituras2[i-1]==='sc1' || partituras2[i-1]==='sc2' || partituras2[i-1]==='sc1x' || partituras2[i-1]==='sc2x'){
                 dibujarSemiCorchea2(0,2,1,1,0,0,0);
              }
              else{
                 dibujarSemiCorchea2(50,2,1,1,0,0,0);
              }
              break;
          case 'sc2x':
              if (partituras2[i-1]==='sc1' || partituras2[i-1]==='sc' || partituras2[i-1]==='sc1x' || partituras2[i-1]==='scx'){
                  dibujarSemiCorchea2(50,2,2,1,0,0,0);
              }
              else{
                  dibujarSemiCorchea2(100,2,2,1,0,0,0);
              }
              break;
          
          default:
              console.log("Caracter: "+partituras2[i]+" no especificado. "+i);
      }
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
  //console.log("pivot = " + graphic.pivot);
  //console.log("mitad_y = " + mitad_y);
  //console.log("mitad_x = " + mitad_x);
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

function dibujarRedoble(){
  var redoble = new PIXI.Graphics();
  redoble.lineStyle(2, 0x000000, 1);
  redoble.beginFill(0x000000, 1);
  redoble.moveTo(12,25);
  redoble.lineTo(-15,25);
  redoble.moveTo(12,30);
  redoble.lineTo(-15,30);
  redoble.moveTo(12,35);
  redoble.lineTo(-15,35);
  redoble.endFill();
  redoble.rotation -= 0.15;
  /* **Lineas necesarias para que el método funcione al ser llamada**
  var redoble = dibujarRedoble(); //Antes de darle posicion a la nota
  notas.push(redoble); //Al final del metodo
  stage.addChild(redoble); //Al final del metodo
  */
  return redoble;
}


function procesarSemiCorchea(cant,mano,rotar,redoblar){
  if(cant === 1){
    dibujarSemiCorchea(25,mano,rotar,redoblar); //Falta dibujar esta monda
  }
  else{
    dibujarNegra(25,mano,rotar,redoblar);
    for(i = 1 ; i < cant; i++){
      var barra = new PIXI.Graphics();
      barra.lineStyle(5, 0x000000, 1);
      barra.beginFill(0x000000, 1);
      if(rotar === 1){
        barra.moveTo(0,0);
        barra.lineTo(25,0);    
      }
      else{
        barra.moveTo(10,0);
        barra.lineTo(35,0);  
      }
      barra.endFill();
      if(mano === 1){
        barra.y = Y_FIRST_SPACE_1;
        barra.x = posicion-25; //la barra se dibuja desde la nota anterior
        }
        else if (mano === 2){
          barra.y = Y_FIRST_SPACE_2+HEIGHT_PENT_SPACE*3;
          barra.x = posicion2-50; // la barra se dibuja desde la nota anterior
        }
        añadiduras.push(barra);
        stage.addChild(barra);
      dibujarNegra(25,mano,rotar,redoblar);
    }
  }
}
function procesarCorchea(cant,mano,rotar,redoblar){
  if(cant === 1){
    dibujarCorchea(50,mano,rotar,redoblar);
  }
  else{
    dibujarNegra(50,mano,rotar,redoblar);
    for(i = 1 ; i < cant; i++){
      var barra = new PIXI.Graphics();
      barra.lineStyle(5, 0x000000, 1);
      barra.beginFill(0x000000, 1);
      if(rotar === 1){
        barra.moveTo(0,0);
        barra.lineTo(50,0);    
      }
      else{
        barra.moveTo(10,0);
        barra.lineTo(60,0);  
      }
      barra.endFill();
      if(mano === 1){
        barra.y = Y_FIRST_SPACE_1;
        barra.x = posicion-50; //la barra se dibuja desde la nota anterior
        }
        else if (mano === 2){
          barra.y = Y_FIRST_SPACE_2+HEIGHT_PENT_SPACE*3;
          barra.x = posicion2-50; // la barra se dibuja desde la nota anterior
        }
        añadiduras.push(barra);
        stage.addChild(barra);
      dibujarNegra(50,mano,rotar,redoblar);
    }
  }
}
//Este metodo hace el dibujo de la cuarta
function dibujarCorchea(aumento,mano,rotar,redoblar){
    //Se dibuja la corchea
    var corchea = new PIXI.Graphics();
    corchea.lineStyle(5,0x000000,1);
    corchea.beginFill(0x000000,1);
    corchea.moveTo(11,0);
    corchea.lineTo(11,HEIGHT_NOTE);
    corchea.drawCircle(5,HEIGHT_NOTE,5);    
    corchea.endFill();
    //corchea.arc(3, 12, 7, 0, 2,true);
    //var redoble = dibujarRedoble();
    QUARTER_NOTE_HEIGHT = corchea.height;
    if(mano === 1){
      //se posiciona la corchea en el pentagrama adecuado
        corchea.x = posicion;
        corchea.y = Y_FIRST_SPACE_1;
        if (redoblar === 1){
            var redoble = dibujarRedoble();
            redoble.x = posicion;
            redoble.y = Y_FIRST_SPACE_1;
        }
        posicion=posicion+aumento;//se avanza en la posicion del pentagrama adecuado el tiempo que dura la nota
        if(rotar === 1){
            rotate(corchea);
            corchea.arc(3, 9, 7, 0, 3.5,true);//Esto hay que arreglarlo: Es la colita de la corchea xd
        }
        else{
            corchea.arc(17, 12, 7, 0, 4,true);//Esto hay que arreglarlo: Es la colita de la corchea xd
        }
        notas.push(corchea);//Se añade la nota al vector de notas
    }
    else if (mano === 2){
      //se posiciona la corchea en el pentagrama adecuado
        corchea.x=posicion2;
        corchea.y=Y_FIRST_SPACE_2;
        if (redoblar === 1){
            var redoble = dibujarRedoble();
            redoble.x = posicion2;
            redoble.y = Y_FIRST_SPACE_2;
        }
        posicion2=posicion2+aumento;//se avanza en la posicion del pentagrama adecuado el tiempo que dura la nota
        if(rotar === 1){
            rotate(corchea);
            corchea.arc(3, 9, 7, 0, 3.5,true);
        }
        else{
            corchea.arc(17, 12, 7, 0, 4,true);
        }
        notas2.push(corchea);//Se añade la nota al vector de notas
    }
    if (redoblar === 1){
      añadiduras.push(redoble); //En caso de que se indique que la nota lleva redoble, se agrega el redoble al vector de añadiduras
      stage.addChild(redoble);
    }
    stage.addChild(corchea); //Se agrega la corchea a la parte visual
}
function dibujarNegra(aumento,mano,rotar,redoblar){
  //Se dibuja la afrodecendiente 
    var negra = new PIXI.Graphics();
    negra.lineStyle(5,0x000000,1);
    negra.beginFill(0x000000,1);
    negra.moveTo(11,0);
    negra.lineTo(11,HEIGHT_NOTE);
    negra.drawCircle(5,HEIGHT_NOTE,5);    
    negra.endFill();
    //var redoble = dibujarRedoble();
    QUARTER_NOTE_HEIGHT = negra.height;
    if(mano === 1){
      //se posiciona la afrodecendiente en las posiciones que corresponde
        negra.x = posicion;
        negra.y = Y_FIRST_SPACE_1;
        if (redoblar === 1){
          //Si se indica que hay que redoblar, se agrega el redoble
            var redoble = dibujarRedoble();
            redoble.x = posicion;
            redoble.y = Y_FIRST_SPACE_1;
        }
        posicion=posicion+aumento;
        if(rotar === 1){
            rotate(negra); //Si se indica la rotacion, se rota
        }
        notas.push(negra); //Se agrega la afrodecendiente al vector de notas adecuadas
    }
    else if (mano === 2){
      //se posiciona la afrodecendiente en las posiciones que corresponde
        negra.x=posicion2;
        negra.y=Y_FIRST_SPACE_2;
        if (redoblar === 1){//Si se indica que hay que redoblar, se agrega el redoble
            var redoble = dibujarRedoble();
            redoble.x = posicion2;
            redoble.y = Y_FIRST_SPACE_2;
        }
        posicion2=posicion2+aumento;
        if(rotar === 1){
            rotate(negra);//Si se indica la rotacion, se rota
        }
        notas2.push(negra); //Se agrega la afrodecendiente al vector de notas adecuadas
    }
    if (redoblar === 1){
      //si tiene redoble, se agrega el redoble al vector de añadiduras para que se pueda animar
      añadiduras.push(redoble);
      stage.addChild(redoble);
    }
    //se agrega la afrodecendiente a la parte visual
    stage.addChild(negra);
}

//Dibuja silencio de corchea.
function dibujaSilencioCorchea(aumento,mano){
//arc(cx, cy, radius, startAngle, endAngle, anticlockwise)
  var silencioCorchea = new PIXI.Graphics()
          .beginFill(0x000000)
          .lineStyle(4, 0x000000, 1)
          .drawCircle(5, 5,4)
          .endFill()
          .arc(10, 5, 10, 3.14, 0.6,true)
          .lineTo(10,40);
    if(mano === 1){
      //Se posiciona en el pentagrama superior
        silencioCorchea.x = posicion;
        silencioCorchea.y = Y_FIRST_SPACE_1+5;
        posicion = posicion + aumento;
        añadiduras.push(silencioCorchea);
    }
    else if (mano === 2){
      //Se posiciona en el pentagrama inferior
        silencioCorchea.x = posicion2;
        silencioCorchea.y = Y_FIRST_SPACE_2+5;
        posicion2 = posicion2 + aumento;
        añadiduras.push(silencioCorchea);
    }
    //Se agrega al escenario
 stage.addChild(silencioCorchea);
}


function quarterNoteX(aumento,mano,rotar){
  var note = new PIXI.Graphics();
  //set a fill and line style again
  note.lineStyle(5, 0x000000, 1);
  note.beginFill(0x000000, 1);
  note.moveTo(11,0);
  note.lineTo(11,HEIGHT_NOTE-5);
  note.lineStyle(3,0x000000,1);
  note.lineTo(0,HEIGHT_NOTE+5);
  note.moveTo(0,HEIGHT_NOTE-5);
  note.lineTo(11,HEIGHT_NOTE+5);
  note.endFill();

  //note = dibujaSilencioCorchea();

    if(mano === 1){
        note.x = posicion;
        note.y = Y_FIRST_SPACE_1;
        posicion=posicion+aumento;
        if(rotar === 1){
            rotate(note);
        }
        notas.push(note);
    }
    else if (mano === 2){
        note.x=posicion2;
        note.y=Y_FIRST_SPACE_2;
        posicion2=posicion2+aumento;
        if(rotar === 1){
            rotate(note);
        }
        notas2.push(note);
    }
    stage.addChild(note);
}

function dibujarSemiCorchea1(aumento,mano,tipo,rotar,redoble1,redoble2,doble){
  var note = new PIXI.Graphics();
  note.lineStyle(5, 0x000000, 1);
  note.beginFill(0x000000, 1);
  //note.endFill();
  
  //la semecorchea esta hecha de dos negras unidas
  if(tipo === 1){
      if(mano === 1){
        note.y = Y_FIRST_SPACE_1;
        note.x = posicion;
        if(rotar === 1){
            note.moveTo(0,60);
            note.lineTo(50,60); 
            if(doble === 1){
                note.moveTo(0,50);
                note.lineTo(50,50);
            }
            note.endFill();
          }
        else{
            note.moveTo(10,0);
            note.lineTo(60,0);
            if(doble === 1){
                note.moveTo(10,10);
                note.lineTo(60,10);
            }
            note.endFill();
          }
      }
      else if(mano === 2){
        note.y = Y_FIRST_SPACE_2+HEIGHT_PENT_SPACE*3;
        note.x = posicion2;
        if(rotar === 1){
            note.moveTo(0,0);
            note.lineTo(50,0); 
            if(doble === 1){
                note.moveTo(0,-10);
                note.lineTo(50,-10);
            }
            note.endFill();
          }
        else{
            note.moveTo(10,-60);
            note.lineTo(60,-60);
            if(doble === 1){
                note.moveTo(10,-50);
                note.lineTo(60,-50);
            }
            note.endFill();
          }
        //rotate(note);
      }
      dibujarNegra(aumento,mano,rotar,redoble1);
      añadiduras.push(note);
      stage.addChild(note);
      dibujarNegra(50,mano,rotar,redoble2);
  }
  else if (tipo === 2){
      if(mano === 1){
        note.y = Y_FIRST_SPACE_1;
        note.x = posicion;
      }
      else if(mano === 2){
        note.y = Y_FIRST_SPACE_2+HEIGHT_PENT_SPACE*3;
        note.x = posicion2-10;
        //rotate(note);
      }
      quarterNoteX(aumento,mano,rotar);
      añadiduras.push(note);
      stage.addChild(note);
      quarterNoteX(50,mano,rotar);
  }
  //return semiQuaver;
}

function dibujarSemiCorchea2(aumento,mano,tipo,rotar,redoble1,redoble2,doble){
  var note = new PIXI.Graphics();
  note.lineStyle(5, 0x000000, 1);
  note.beginFill(0x000000, 1);
  if(rotar === 1){
    note.moveTo(0,0);
    note.lineTo(50,0);    
  }
  else{
    note.moveTo(10,0);
    note.lineTo(60,0);  
  }
  note.endFill();
  //la semecorchea esta hecha de dos negras unidas
  if(tipo === 1){
      if(aumento===0){ //Si le precede una sc1
        if(mano === 1){
        note.y = Y_FIRST_SPACE_1;
        note.x = posicion-50;
        }
        else if (mano === 2){
          note.y = Y_FIRST_SPACE_2+HEIGHT_PENT_SPACE*3;
          note.x = posicion2-50;
        }
        añadiduras.push(note);
        stage.addChild(note);
        dibujarNegra(50,mano,rotar,redoble2);
      }
      else{
        //posicion -=50;
        if(mano === 1){
          note.y = Y_FIRST_SPACE_1;
          note.x = posicion;
        }
        else if( mano === 2){
          note.y = Y_FIRST_SPACE_2+HEIGHT_PENT_SPACE*3;
          note.x = posicion2;
        }
        dibujarNegra(aumento,mano,rotar,redoble1);
        añadiduras.push(note);
        stage.addChild(note);
        dibujarNegra(100,mano,rotar,redoble2);
        }
  }
  else if(tipo === 2){
      if(aumento===0){ //Si le precede una sc1
        if(mano === 1){
        note.y = Y_FIRST_SPACE_1;
        note.x = posicion-50;
        }
        else if (mano === 2){
          note.y = Y_FIRST_SPACE_2+HEIGHT_PENT_SPACE*3;
          note.x = posicion2-50;
        }
        añadiduras.push(note);
        stage.addChild(note);
        quarterNoteX(50,mano,rotar);
      }
      else{
        posicion -=50;
        quarterNoteX(aumento,mano,rotar);
        if(mano === 1){
          note.y = Y_FIRST_SPACE_1;
          note.x = posicion;
        }
        else if( mano === 2){
          note.y = Y_FIRST_SPACE_2+HEIGHT_PENT_SPACE*3;
          note.x = posicion2;
        }
        añadiduras.push(note);
        stage.addChild(note);
        quarterNoteX(100,mano,rotar);
        }
  }

  //return semiQuaver;
}


function animate() {
  "use strict";
  for (var i=0; i<notas.length; i++){
    if (counter < notas.length){
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
    for (var i=0; i<notas2.length; i++){
        if (counter2 < notas2.length){
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
    if(counter2===posiciones2.length && counter === notas.length){
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