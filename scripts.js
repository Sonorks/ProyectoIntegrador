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
var GROSOR_DE_LINEA =3;
//Constantes
var counter=0;
var counter2=0;
var renderer;
var canvas;
var stage;
var graphics;
var pent;
//Nivel de dificultad
var level=1;
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
var ritmo1=[];


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
                //partituras2 = "";
                partituras2 = allText.split(","); //En el archivo las notas estan separadas por comas (,)
            }
        }
    }
    rawFile2.send(null);
    //procesarDatos();
    iniciarPixi(); //Una vez leidos los archivos empiezan las animaciones
}
function encontrarConsecutivos(partitura,pos,nota){
  var cant = pos;
  while (partitura[cant]===nota || partitura[cant]===nota+'r'){
      cant++;
  }
  return (cant - pos);
}
function redoblesDeConsecutivos(partituras,pos,nota,cant){
  var redobles = [];
  cant = cant + pos;
  var i = 0;
  while(pos<cant){
    if(partituras[pos] === nota+'r'){
      redobles[i]=1;
      i++;
    }
    else if(partituras[pos] === nota){
      redobles[i]=0;
      i++;
    }
    pos++;
  }
  return redobles;
}

function procesarDatos(){
  var j = 0;
  for (i = 0 ; i <partituras.length; i++){
    if (partituras[i] === 'c'){
      var consecutivos = encontrarConsecutivos(partituras,i,'c');
      i = i+consecutivos-1;
      ritmo1[j] = ('c'+consecutivos);
    }
    else{
      ritmo1[j]=partituras[i];
      j++;
    }
  }
}
function iniciarPixi(){
  //readTextFile();
  var cantidad;
  renderer = PIXI.autoDetectRenderer(1000, 300, {transparent: true});
  canvas = document.getElementById('canvas');
  canvas.appendChild(renderer.view);
  stage = new PIXI.Container();
  graphics = new PIXI.Graphics();
  //Dibuja pentagrama
  pent = makePentagram();
  pent.y = Y_FIRST_PENT;
  var pent2= makePentagram();
  pent2.y = Y_SECOND_PENT;
  graphics.drawRect(100,0,20,290);
  stage.addChild(pent);
  stage.addChild(pent2);
  stage.addChild(graphics);
  //Crea las notas
  for (var i=0; i<partituras.length; i++){
      switch(partituras[i]){
          case 'n':
              dibujarNegra(100,1,0,0);
              break;
          case 'nr':
              dibujarNegra(100,1,0,1);
              break;
          case 'nx':
              quarterNoteX(100,1,1);
              break;
          case 'c':
              var union = false;
              cantidad = encontrarConsecutivos(partituras,i,'c');
              if(partituras[i-1]==='sc' || partituras[i-1]==='scr'){
                if(partituras[i-2]==='sc'){
                  posicion -=25;
                  notas[notas.length-1].x = -10;
                  dibujarNegra(25,1,0,0);
                  unirCorcheaSemiCorchea(25,1,0);
                  union = true;
                }
                else if (partituras[i-2]==='scr'){
                  posicion -=25;
                  notas[notas.length-1].x = -10;
                  dibujarNegra(25,1,0,1);
                  unirCorcheaSemiCorchea(25,1,0);
                  union = true;
                }
              }
              if (cantidad>1){
                procesarCorchea(cantidad,1,0,redoblesDeConsecutivos(partituras,i,'c',cantidad));
                i=i+cantidad-1;
              }
              else if(union === true){
                dibujarNegra(50,1,0,0);
              }
              else if(union === false){
                procesarCorchea(cantidad,1,0,redoblesDeConsecutivos(partituras,i,'c',cantidad));
              }
              break;
          case 'cx':
              var union = false;
              cantidad = encontrarConsecutivos(partituras,i,'cx');
              if(partituras[i-1]==='cx' || partituras[i-1]==='cxr'){
                if(partituras[i-2]==='cx'){
                  posicion -=25;
                  notas[notas.length-1].x = -10;
                  quarterNoteX(25,1,0,0);
                  unirCorcheaSemiCorchea(25,1,0);
                  union = true;
                }
                else if (partituras[i-2]==='cxr'){
                  posicion -=25;
                  notas[notas.length-1].x = -10;
                  quarterNoteX(25,1,0,1);
                  unirCorcheaSemiCorchea(25,1,0);
                  union = true;
                }
              }
              if (cantidad>1){
                procesarCorcheaCerrada(cantidad,1,0,redoblesDeConsecutivos(partituras,i,'cx',cantidad));
                i=i+cantidad-1;
              }
              else if(union === true){
                quarterNoteX(50,1,0,0);
              }
              else if(union === false){
                procesarCorcheaCerrada(cantidad,1,0,redoblesDeConsecutivos(partituras,i,'cx',cantidad));
              }
              break;
          case 'cr':
              var union = false;
              cantidad = encontrarConsecutivos(partituras,i,'c');
              if(partituras[i-1]==='sc' || partituras[i-1]==='scr'){
                if(partituras[i-2]==='sc'){
                  posicion -=25;
                  notas[notas.length-1].x = -10;
                  dibujarNegra(25,1,0,0);
                  unirCorcheaSemiCorchea(25,1,0);
                  union = true;
                }
                else if(partituras[i-2]==='scr'){
                  posicion -=25;
                  notas[notas.length-1].x = -10;
                  dibujarNegra(25,1,0,1);
                  unirCorcheaSemiCorchea(25,1,0);
                  union = true;
                }
              }
              if (cantidad>1){
                procesarCorchea(cantidad,1,0,redoblesDeConsecutivos(partituras,i,'c',cantidad));
                i=i+cantidad-1;
              }
              else if(union === true){
                dibujarNegra(50,1,0,1);
              }
              else if(union === false){
                procesarCorchea(cantidad,1,0,redoblesDeConsecutivos(partituras,i,'c',cantidad));
              }
              break;
          case 'cxr':
              var union = false;
              cantidad = encontrarConsecutivos(partituras,i,'cx');
              if(partituras[i-1]==='cx' || partituras[i-1]==='cxr'){
                if(partituras[i-2]==='cx'){
                  posicion -=25;
                  notas[notas.length-1].x = -10;
                  quarterNoteX(25,1,0,0);
                  unirCorcheaSemiCorchea(25,1,0);
                  union = true;
                }
                else if (partituras[i-2]==='cxr'){
                  posicion -=25;
                  notas[notas.length-1].x = -10;
                  quarterNoteX(25,1,0,1);
                  unirCorcheaSemiCorchea(25,1,0);
                  union = true;
                }
              }
              if (cantidad>1){
                procesarCorcheaCerrada(cantidad,1,0,redoblesDeConsecutivos(partituras,i,'cx',cantidad));
                i=i+cantidad-1;
              }
              else if(union === true){
                quarterNoteX(50,1,0,1);
              }
              else if(union === false){
                procesarCorcheaCerrada(cantidad,1,0,redoblesDeConsecutivos(partituras,i,'cx',cantidad));
              }
              break;
          case 'sc':
              var union = false;
              cantidad = encontrarConsecutivos(partituras,i,'sc');
              if(partituras[i-1]==='c' || partituras[i-1]==='cr'){
                if(partituras[i-2]==='c'){
                  posicion -=50;
                  notas[notas.length-1].x = -10;
                  dibujarNegra(50,1,0,0);
                  unirCorcheaSemiCorchea(50,1,0);
                  union = true;
                }
                else if(partituras[i-2]==='cr'){
                  posicion -=50;
                  notas[notas.length-1].x = -10;
                  dibujarNegra(50,1,0,1);
                  unirCorcheaSemiCorchea(50,1,0);
                  union = true;
                }
              }
              if(cantidad > 1){
                procesarSemiCorchea(cantidad,1,0,redoblesDeConsecutivos(partituras,i,'sc',cantidad));
                i=i+cantidad-1;
              }
              else if(union === true){
                dibujarNegra(25,1,0,0);
              }
              else if(union === false){
                procesarSemiCorchea(cantidad,1,0,redoblesDeConsecutivos(partituras,i,'sc',cantidad));
              }
              break;
          case 'scx':
              var union = false;
              cantidad = encontrarConsecutivos(partituras,i,'scx');
              if(partituras[i-1]==='scx' || partituras[i-1]==='scxr'){
                if(partituras[i-2]==='scx'){
                  posicion -=50;
                  notas[notas.length-1].x = -10;
                  quarterNoteX(50,1,0,0);
                  unirCorcheaSemiCorchea(50,1,0);
                  union = true;
                }
                else if(partituras[i-2]==='cr'){
                  posicion -=50;
                  notas[notas.length-1].x = -10;
                  quarterNoteX(50,1,0,1);
                  unirCorcheaSemiCorchea(50,1,0);
                  union = true;
                }
              }
              if(cantidad > 1){
                procesarSemiCorcheaCerrada(cantidad,1,0,redoblesDeConsecutivos(partituras,i,'sc',cantidad));
                i=i+cantidad-1;
              }
              else if(union === true){
                quarterNoteX(25,1,0,0);
              }
              else if(union === false){
                procesarSemiCorcheaCerrada(cantidad,1,0,redoblesDeConsecutivos(partituras,i,'sc',cantidad));
              }
              break;
          case 'scr':
              var union = false;
              cantidad = encontrarConsecutivos(partituras,i,'sc');
              if(partituras[i-1]==='c' || partituras[i-1]==='cr'){
                if(partituras[i-2]==='c'){
                  posicion -=50;
                  notas[notas.length-1].x = -10;
                  dibujarNegra(50,1,0,0);
                  unirCorcheaSemiCorchea(50,1,0);
                  union = true;
                }
                else if(partituras[i-2]==='cr'){
                  posicion -=50;
                  notas[notas.length-1].x = -10;
                  dibujarNegra(50,1,0,1);
                  unirCorcheaSemiCorchea(50,1,0);
                  union = true;
                }
              }
              if(cantidad > 1){
                procesarSemiCorchea(cantidad,1,0,redoblesDeConsecutivos(partituras,i,'sc',cantidad));
                i=i+cantidad-1;
              }
              else if(union === true){
                dibujarNegra(25,1,0,1);
              }
              else if(union === false){
                procesarSemiCorchea(cantidad,1,0,redoblesDeConsecutivos(partituras,i,'sc',cantidad));
              }
              break;
          case 'scxr':
              var union = false;
              cantidad = encontrarConsecutivos(partituras,i,'scx');
              if(partituras[i-1]==='scx' || partituras[i-1]==='scxr'){
                if(partituras[i-2]==='scx'){
                  posicion2 -=50;
                  notas2[notas2.length-1].x = -10;
                  quarterNoteX(50,1,0,0);
                  unirCorcheaSemiCorchea(50,1,0);
                  union = true;
                }
                else if(partituras[i-2]==='cr'){
                  posicion2 -=50;
                  notas2[notas2.length-1].x = -10;
                  quarterNoteX(50,1,0,1);
                  unirCorcheaSemiCorchea(50,1,0);
                  union = true;
                }
              }
              if(cantidad > 1){
                procesarSemiCorcheaCerrada(cantidad,1,0,redoblesDeConsecutivos(partituras,i,'scx',cantidad));
                i=i+cantidad-1;
              }
              else if(union === true){
                quarterNoteX(25,1,0,1);
              }
              else if(union === false){
                procesarSemiCorcheaCerrada(cantidad,1,0,redoblesDeConsecutivos(partituras,i,'scx',cantidad));
              }
              break;
          case 'b':
              dibujarBlanca(200,1,0,0);
              break;
          case 'sn':
              posicion+=100;
              break;
          case 'sq':
              dibujaSilencioCorchea(50,1);
              break;
          case 'ssc':
              dibujaSilencioSemiCorchea(25,1);
              break;
          case 'sb':
              posicion+=200;
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
              dibujarBlanca(200,2,1,0);
              break;
          case 'c':
              var union = false;
              cantidad = encontrarConsecutivos(partituras2,i,'c');
              if(partituras2[i-1]==='sc' || partituras2[i-1]==='scr'){
                if(partituras2[i-2]==='sc'){
                  console.log("Hay que unir");
                  posicion2 -=25;
                  notas2[notas2.length-1].x = -10;
                  dibujarNegra(25,2,1,0);
                  unirCorcheaSemiCorchea(25,2,1);
                  union = true;
                }
                if(partituras2[i-2]==='scr'){
                  console.log("Hay que unir");
                  posicion2 -=25;
                  notas2[notas2.length-1].x = -10;
                  dibujarNegra(25,2,1,1);
                  unirCorcheaSemiCorchea(25,2,1);
                  union = true;
                }
              }
              if (cantidad>1){
                procesarCorchea(cantidad,2,1,redoblesDeConsecutivos(partituras2,i,'c',cantidad));
                i=i+cantidad-1;
              }
              else if(union === true){
                dibujarNegra(50,2,1,0);
              }
              else if(union === false){
                procesarCorchea(cantidad,2,1,redoblesDeConsecutivos(partituras2,i,'c',cantidad));
              }
              break;
          case 'cx':
              var union = false;
              cantidad = encontrarConsecutivos(partituras2,i,'cx');
              if(partituras2[i-1]==='cx' || partituras2[i-1]==='cxr'){
                if(partituras2[i-2]==='cx'){
                  posicion -=25;
                  notas[notas.length-1].x = -10;
                  quarterNoteX(25,2,1,0);
                  unirCorcheaSemiCorchea(25,2,1);
                  union = true;
                }
                else if (partituras2[i-2]==='cxr'){
                  posicion -=25;
                  notas[notas.length-1].x = -10;
                  quarterNoteX(25,2,1,0);
                  unirCorcheaSemiCorchea(25,2,1);
                  union = true;
                }
              }
              if (cantidad>1){
                procesarCorcheaCerrada(cantidad,2,1,redoblesDeConsecutivos(partituras2,i,'cx',cantidad));
                i=i+cantidad-1;
              }
              else if(union === true){
                quarterNoteX(50,2,1,0);
              }
              else if(union === false){
                procesarCorcheaCerrada(cantidad,2,1,redoblesDeConsecutivos(partituras2,i,'cx',cantidad));
              }
              break;
          case 'cr':
            var union = false;
            cantidad = encontrarConsecutivos(partituras2,i,'c');
            if(partituras2[i-1]==='sc' || partituras2[i-1]==='scr'){
              if(partituras2[i-2]==='sc'){
                posicion2 -=25;
                notas2[notas2.length-1].x = -10;
                dibujarNegra(25,2,1,0);
                unirCorcheaSemiCorchea(25,2,1);
                union = true;
              }
              else if(partituras2[i-2]==='scr'){
                posicion2 -=25;
                notas2[notas2.length-1].x = -10;
                dibujarNegra(25,2,1,1);
                unirCorcheaSemiCorchea(25,2,1);
                union = true;
              }
            }
            if (cantidad>1){
              procesarCorchea(cantidad,2,0,redoblesDeConsecutivos(partituras2,i,'c',cantidad));
              i=i+cantidad-1;
            }
            else if(union === true){
              dibujarNegra(50,2,1,1);
            }
            else if(union === false){
              procesarCorchea(cantidad,2,0,redoblesDeConsecutivos(partituras2,i,'c',cantidad));
            }
              break;
          case 'cxr':
              var union = false;
              cantidad = encontrarConsecutivos(partituras2,i,'cx');
              if(partituras2[i-1]==='cx' || partituras2[i-1]==='cxr'){
                if(partituras2[i-2]==='cx'){
                  posicion -=25;
                  notas[notas.length-1].x = -10;
                  quarterNoteX(25,2,1,0);
                  unirCorcheaSemiCorchea(25,2,1);
                  union = true;
                }
                else if (partituras2[i-2]==='cxr'){
                  posicion -=25;
                  notas[notas.length-1].x = -10;
                  quarterNoteX(25,2,1,1);
                  unirCorcheaSemiCorchea(25,2,1);
                  union = true;
                }
              }
              if (cantidad>1){
                procesarCorcheaCerrada(cantidad,2,1,redoblesDeConsecutivos(partituras2,i,'cx',cantidad));
                i=i+cantidad-1;
              }
              else if(union === true){
                quarterNoteX(50,2,1,1);
              }
              else if(union === false){
                procesarCorcheaCerrada(cantidad,2,1,redoblesDeConsecutivos(partituras2,i,'cx',cantidad));
              }
              break;
          case 'sc':
              var union = false;
              cantidad = encontrarConsecutivos(partituras2,i,'sc');
              if(partituras2[i-1]==='c' || partituras2[i-1]==='cr'){
                if(partituras2[i-2]==='c'){
                  posicion2 -=50;
                  notas2[notas2.length-1].x = -10;
                  dibujarNegra(50,2,1,0);
                  unirCorcheaSemiCorchea(50,2,1);
                  union = true;
                }
                else if(partituras2[i-2]==='cr'){
                  posicion2 -=50;
                  notas2[notas2.length-1].x = -10;
                  dibujarNegra(50,2,1,0);
                  unirCorcheaSemiCorchea(50,2,1);
                  union = true;
                }
              }
              if(cantidad > 1){
                procesarSemiCorchea(cantidad,2,1,redoblesDeConsecutivos(partituras2,i,'sc',cantidad));
                i=i+cantidad-1;
              }
              else if(union === true){
                dibujarNegra(25,2,1,0);
              }
              else if(union === false){
                procesarSemiCorchea(cantidad,2,1,redoblesDeConsecutivos(partituras2,i,'sc',cantidad));
              }
              break;
          case 'scx':
            var union = false;
            cantidad = encontrarConsecutivos(partituras2,i,'scx');
            if(partituras2[i-1]==='scx' || partituras2[i-1]==='scxr'){
              if(partituras2[i-2]==='scx'){
                posicion2 -=50;
                notas2[notas2.length-1].x = -10;
                quarterNoteX(50,2,1,0);
                unirCorcheaSemiCorchea(50,2,1);
                union = true;
              }
              else if(partituras2[i-2]==='cr'){
                posicion2 -=50;
                notas2[notas2.length-1].x = -10;
                quarterNoteX(50,2,1,0);
                unirCorcheaSemiCorchea(50,2,1);
                union = true;
              }
            }
            if(cantidad > 1){
              procesarSemiCorcheaCerrada(cantidad,2,1,redoblesDeConsecutivos(partituras2,i,'scx',cantidad));
              i=i+cantidad-1;
            }
            else if(union === true){
              quarterNoteX(25,2,1,0);
            }
            else if(union === false){
              procesarSemiCorcheaCerrada(cantidad,2,1,redoblesDeConsecutivos(partituras2,i,'scx',cantidad));
            }
            break;
          case 'scr':
            var union = false;
            cantidad = encontrarConsecutivos(partituras2,i,'sc');
            if(partituras2[i-1]==='c' || partituras2[i-1]==='cr'){
              if(partituras2[i-2]==='c'){
                posicion2 -=50;
                notas2[notas2.length-1].x = -10;
                dibujarNegra(50,2,1,0);
                unirCorcheaSemiCorchea(50,2,1);
                union = true;
              }
              else if(partituras2[i-2]==='cr'){
                posicion2 -=50;
                notas2[notas2.length-1].x = -10;
                dibujarNegra(50,2,1,1);
                unirCorcheaSemiCorchea(50,2,1);
                union = true;
              }
            }
            if(cantidad > 1){
              procesarSemiCorchea(cantidad,2,1,redoblesDeConsecutivos(partituras2,i,'sc',cantidad));
              i=i+cantidad-1;
            }
            else if(union === true){
              dibujarNegra(25,2,1,1);
            }
            else if(union === false){
              procesarSemiCorchea(cantidad,2,1,redoblesDeConsecutivos(partituras2,i,'sc',cantidad));
            }
            break;
        case 'scxr':
            var union = false;
            cantidad = encontrarConsecutivos(partituras2,i,'scx');
            if(partituras2[i-1]==='scx' || partituras2[i-1]==='scxr'){
              if(partituras2[i-2]==='scx'){
                posicion2 -=50;
                notas2[notas2.length-1].x = -10;
                quarterNoteX(50,2,1,0);
                unirCorcheaSemiCorchea(50,2,1);
                union = true;
              }
              else if(partituras2[i-2]==='cr'){
                posicion2 -=50;
                notas2[notas2.length-1].x = -10;
                quarterNoteX(50,2,1,1);
                unirCorcheaSemiCorchea(50,2,1);
                union = true;
              }
            }
            if(cantidad > 1){
              procesarSemiCorcheaCerrada(cantidad,2,1,redoblesDeConsecutivos(partituras2,i,'scx',cantidad));
              i=i+cantidad-1;
            }
            else if(union === true){
              quarterNoteX(25,2,1,1);
            }
            else if(union === false){
              procesarSemiCorcheaCerrada(cantidad,2,1,redoblesDeConsecutivos(partituras2,i,'scx',cantidad));
            }
            break;
          case 'sn':
              posicion2+=100;
              break;
          case 'sq':
              dibujaSilencioCorchea(50,2);
              break;
          case 'ssc':
              dibujaSilencioSemiCorchea(25,2);
              break;
          case 'sb':
              posicion2+=200;
          default:
              console.log("Caracter: "+partituras2[i]+" no especificado. "+i);
      }
  }

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
}

function makePentagram(){
  var pentagram = new PIXI.Graphics();
  // set a line style again
  pentagram.lineStyle(2, 0x282828 ,0.7);
  //start drawing
  pentagram.drawRect(0,10,1000,20);
  pentagram.drawRect(0,30,1000,20);
  pentagram.drawRect(0,50,1000,20);
  pentagram.drawRect(0,70,1000,20);
  pentagram.drawRect(30,0,20,100);
  return pentagram;
}
function unirCorcheaSemiCorchea(aumento,mano,rotar){
  var barra = new PIXI.Graphics();
  barra.lineStyle(GROSOR_DE_LINEA, 0x000000, 1);
  barra.beginFill(0x000000, 1);
  barra.endFill();
  if(mano === 1){
    barra.y = Y_FIRST_SPACE_1;
    barra.x = posicion-aumento; //la barra se dibuja desde la nota anterior
    if(rotar === 1){
      barra.moveTo(0,Y_FIRST_SPACE_1+(HEIGHT_PENT_SPACE));
      barra.lineTo(aumento,Y_FIRST_SPACE_1+(HEIGHT_PENT_SPACE));
      }
    else{
        barra.moveTo(10,0);
        barra.lineTo(aumento + 10,0);
      }
    }
  else if (mano === 2){
    barra.y = Y_FIRST_SPACE_2+HEIGHT_PENT_SPACE*3;
    barra.x = posicion2-aumento; // la barra se dibuja desde la nota anterior
    if(rotar === 1){
      barra.moveTo(0,0);
      barra.lineTo(aumento,0);
    }
    else{
      barra.moveTo(10,-HEIGHT_PENT_SPACE*3);
      barra.lineTo(aumento+10,-HEIGHT_PENT_SPACE*3);
    }
  }
  añadiduras.push(barra);
  stage.addChild(barra);
}
function dibujarRedoble(){
  var redoble = new PIXI.Graphics();
  redoble.lineStyle(GROSOR_DE_LINEA, 0x000000, 1);
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
    dibujarSemiCorchea(25,mano,rotar,redoblar[0]);
  }
  else{
    dibujarNegra(25,mano,rotar,redoblar[0]);
    for(i = 1 ; i < cant; i++){
      var barra = new PIXI.Graphics();
      barra.lineStyle(GROSOR_DE_LINEA, 0x000000, 1);
      barra.beginFill(0x000000, 1);
      barra.endFill();
      var barra2 = barra;
      if(mano === 1){
        barra2.y=Y_FIRST_SPACE_1;
        barra2.x=posicion-25;
        barra.y = Y_FIRST_SPACE_1;
        barra.x = posicion-25; //la barra se dibuja desde la nota anterior
        if(rotar === 1){
          barra.moveTo(0,Y_FIRST_SPACE_1+HEIGHT_PENT_SPACE);
          barra.lineTo(25,Y_FIRST_SPACE_1+HEIGHT_PENT_SPACE);
          barra2.moveTo(0,Y_FIRST_SPACE_1+HEIGHT_PENT_SPACE-8);
          barra2.lineTo(25,Y_FIRST_SPACE_1+HEIGHT_PENT_SPACE-8);
        }
        else{
          barra.moveTo(10,0);
          barra.lineTo(35,0);
          barra2.moveTo(10,8);
          barra2.lineTo(35,8);
        }
      }
      else if (mano === 2){
        barra2.y=Y_FIRST_SPACE_2;
        barra2.x=posicion2-25;
        barra.y = Y_FIRST_SPACE_2;
        barra.x = posicion2-25; // la barra se dibuja desde la nota anterior
        if(rotar === 1){
          barra2.moveTo(0,HEIGHT_PENT_SPACE*3-8);
          barra2.lineTo(25,HEIGHT_PENT_SPACE*3-8);
          barra.moveTo(0,HEIGHT_PENT_SPACE*3);
          barra.lineTo(25,HEIGHT_PENT_SPACE*3);
        }
        else{
          barra2.moveTo(10,8);
          barra2.lineTo(35,8);
          barra.moveTo(10,0);
          barra.lineTo(35,0);
        }
      }
      añadiduras.push(barra);
      //añadiduras.push(barra2);
      stage.addChild(barra2);
      stage.addChild(barra);
      dibujarNegra(25,mano,rotar,redoblar[i]);
    }
  }
}

function procesarSemiCorcheaCerrada(cant,mano,rotar,redoblar){
  if(cant === 1){
    dibujarSemiCorcheaCerrada(25,mano,rotar,redoblar[0]);
  }
  else{
    quarterNoteX(25,mano,rotar,redoblar[0]);
    for(i = 1 ; i < cant; i++){
      var barra = new PIXI.Graphics();
      barra.lineStyle(GROSOR_DE_LINEA, 0x000000, 1);
      barra.beginFill(0x000000, 1);
      barra.endFill();
      var barra2 = barra;
      if(mano === 1){
        barra2.y=Y_FIRST_SPACE_1;
        barra2.x=posicion-25;
        barra.y = Y_FIRST_SPACE_1;
        barra.x = posicion-25; //la barra se dibuja desde la nota anterior
        if(rotar === 1){
          barra.moveTo(0,Y_FIRST_SPACE_1+HEIGHT_PENT_SPACE);
          barra.lineTo(25,Y_FIRST_SPACE_1+HEIGHT_PENT_SPACE);
          barra2.moveTo(0,Y_FIRST_SPACE_1+HEIGHT_PENT_SPACE-8);
          barra2.lineTo(25,Y_FIRST_SPACE_1+HEIGHT_PENT_SPACE-8);
        }
        else{
          barra.moveTo(10,0);
          barra.lineTo(35,0);
          barra2.moveTo(10,8);
          barra2.lineTo(35,8);
        }
      }
      else if (mano === 2){
        barra2.y=Y_FIRST_SPACE_2;
        barra2.x=posicion2-25;
        barra.y = Y_FIRST_SPACE_2;
        barra.x = posicion2-25; // la barra se dibuja desde la nota anterior
        if(rotar === 1){
          barra2.moveTo(0,HEIGHT_PENT_SPACE*3-8);
          barra2.lineTo(25,HEIGHT_PENT_SPACE*3-8);
          barra.moveTo(0,HEIGHT_PENT_SPACE*3);
          barra.lineTo(25,HEIGHT_PENT_SPACE*3);
        }
        else{
          barra2.moveTo(10,8);
          barra2.lineTo(35,8);
          barra.moveTo(10,0);
          barra.lineTo(35,0);
        }
      }
      añadiduras.push(barra);
      //añadiduras.push(barra2);
      stage.addChild(barra2);
      stage.addChild(barra);
      quarterNoteX(25,mano,rotar,redoblar[i]);
    }
  }
}

//dibujarSemiCorchea(25,mano,rotar,redoblar[0]); //Falta dibujar esta monda
function dibujarSemiCorchea(tiempo,mano,rotar,redoblar){
  var sc_container = new PIXI.Container();
  var sc = new PIXI.Graphics()
        .lineStyle(GROSOR_DE_LINEA, 0x000000, 1)
        .moveTo(11,0)
        .lineTo(11,50)
        .moveTo(11,0)
        .bezierCurveTo(10,25,35,15,25,35)
        .moveTo(11,20)
        .bezierCurveTo(20,35,35,25,25,45)
  sc_container.addChild(sc);
  var _ellipse = ellipse(1);
  _ellipse.x=13;
  _ellipse.y=55;
  _ellipse.rotation=2.8;
  sc_container.addChild(_ellipse);
  if(mano === 1){
      sc_container.x = posicion;
      sc_container.y = Y_FIRST_SPACE_1;
      if (redoblar === 1){
        //Si se indica que hay que redoblar, se agrega el redoble
          var redoble = dibujarRedoble();
          redoble.x = posicion;
          redoble.y = Y_FIRST_SPACE_1;
      }
      posicion=posicion+tiempo;
      if(rotar === 1){
          rotate(sc_container);
      }
      notas.push(sc_container);
  }
  else if (mano === 2){
      var sc_container = semicorcheaRotada();
      sc_container.x=posicion2;
      sc_container.y=Y_FIRST_SPACE_2+5;
      if (redoblar === 1){//Si se indica que hay que redoblar, se agrega el redoble
          var redoble = dibujarRedoble();
          redoble.x = posicion2;
          redoble.y = Y_FIRST_SPACE_2;
      }
      posicion2=posicion2+tiempo;
      //No es necesario rotar esto, cuando mano es 2, todo se debe rotar
      // if(rotar === 1){
      //     rotate(sc_container);
      // }
      notas2.push(sc_container);
  }
  if (redoblar === 1){
    //si tiene redoble, se agrega el redoble al vector de añadiduras para que se pueda animar
    añadiduras.push(redoble);
    stage.addChild(redoble);
  }
  stage.addChild(sc_container);

}

function dibujarSemiCorcheaCerrada(tiempo,mano,rotar,redoblar){
  var sc_container = new PIXI.Container();
  var sc = new PIXI.Graphics()
        .lineStyle(GROSOR_DE_LINEA, 0x000000, 1)
        .moveTo(11,0)
        .lineTo(11,50)
        .moveTo(11,0)
        .bezierCurveTo(10,25,35,15,25,35)
        .moveTo(11,20)
        .bezierCurveTo(20,35,35,25,25,45)
        .moveTo(11,50)
        .lineTo(0,HEIGHT_NOTE+10)
        .moveTo(0,HEIGHT_NOTE)
        .lineTo(11,HEIGHT_NOTE+10);
  sc_container.addChild(sc);
  if(mano === 1){
      sc_container.x = posicion;
      sc_container.y = Y_FIRST_SPACE_1;
      if (redoblar === 1){
        //Si se indica que hay que redoblar, se agrega el redoble
          var redoble = dibujarRedoble();
          redoble.x = posicion;
          redoble.y = Y_FIRST_SPACE_1;
      }
      posicion=posicion+tiempo;
      if(rotar === 1){
          rotate(sc_container);
      }
      notas.push(sc_container);
  }
  else if (mano === 2){
      var sc_container = semicorcheaCerradaRotada();
      sc_container.x=posicion2;
      sc_container.y=Y_FIRST_SPACE_2+5;
      if (redoblar === 1){//Si se indica que hay que redoblar, se agrega el redoble
          var redoble = dibujarRedoble();
          redoble.x = posicion2;
          redoble.y = Y_FIRST_SPACE_2;
      }
      posicion2=posicion2+tiempo;
      //No es necesario rotar esto, cuando mano es 2, todo se debe rotar
      // if(rotar === 1){
      //     rotate(sc_container);
      // }
      notas2.push(sc_container);
  }
  if (redoblar === 1){
    //si tiene redoble, se agrega el redoble al vector de añadiduras para que se pueda animar
    añadiduras.push(redoble);
    stage.addChild(redoble);
  }
  stage.addChild(sc_container);

}

function semicorcheaRotada(){
  var sc_container = new PIXI.Container();
  var semicorchea_rotada = new PIXI.Graphics()
        .lineStyle(GROSOR_DE_LINEA,0x000000,1)
        .moveTo(11,0)
        .lineTo(11,50)
        .bezierCurveTo(15,35,40,40,25,20)
        .moveTo(11,40)
        .bezierCurveTo(15,25,40,30,25,10);
  sc_container.addChild(semicorchea_rotada);
  var _ellipse = ellipse(1);
  _ellipse.x=9;
  _ellipse.y=-4;
  _ellipse.rotation=-0.25;
  sc_container.addChild(_ellipse);
  return sc_container;
}

function semicorcheaCerradaRotada(){
  var sc_container = new PIXI.Container();
  var semicorchea_rotada = new PIXI.Graphics()
        .lineStyle(GROSOR_DE_LINEA,0x000000,1)
        .moveTo(11,0)
        .lineTo(11,50)
        .bezierCurveTo(15,35,40,40,25,20)
        .moveTo(11,40)
        .bezierCurveTo(15,25,40,30,25,10)
        .moveTo(11,0)
        .lineTo(22,-10)
        .moveTo(22,0)
        .lineTo(11,-10);
  sc_container.addChild(semicorchea_rotada);
  return sc_container;
}

function procesarCorchea(cant,mano,rotar,redoblar){
  if(cant === 1){
    dibujarCorchea(50,mano,rotar,redoblar[0]);
  }
  else{
    dibujarNegra(50,mano,rotar,redoblar[0]);
    for(i = 1 ; i < cant; i++){
      var barra = new PIXI.Graphics();
      barra.lineStyle(GROSOR_DE_LINEA, 0x000000, 1);
      barra.beginFill(0x000000, 1);
      barra.endFill();
      if(mano === 1){
        barra.y = Y_FIRST_SPACE_1;
        barra.x = posicion-50; //la barra se dibuja desde la nota anterior
        if(rotar === 1){
          barra.moveTo(0,Y_FIRST_SPACE_1+(HEIGHT_PENT_SPACE));
          barra.lineTo(50,Y_FIRST_SPACE_1+(HEIGHT_PENT_SPACE));
          }
        else{
            barra.moveTo(10,0);
            barra.lineTo(60,0);
          }
        }
      else if (mano === 2){
        barra.y = Y_FIRST_SPACE_2+HEIGHT_PENT_SPACE*3;
        barra.x = posicion2-50; // la barra se dibuja desde la nota anterior
        if(rotar === 1){
          barra.moveTo(0,0);
          barra.lineTo(50,0);
        }
        else{
          barra.moveTo(10,-HEIGHT_PENT_SPACE*3);
          barra.lineTo(60,-HEIGHT_PENT_SPACE*3);
        }
      }
      añadiduras.push(barra);
      stage.addChild(barra);
      dibujarNegra(50,mano,rotar,redoblar[i]);
    }
  }
}

function procesarCorcheaCerrada(cant,mano,rotar,redoblar){
  if(cant === 1){
    dibujarCorcheaCerrada(50,mano,rotar,redoblar[0]);
  }
  else{
    quarterNoteX(50,mano,rotar,redoblar[0]);
    for(i = 1 ; i < cant; i++){
      var barra = new PIXI.Graphics();
      barra.lineStyle(GROSOR_DE_LINEA, 0x000000, 1);
      barra.beginFill(0x000000, 1);
      barra.endFill();
      if(mano === 1){
        barra.y = Y_FIRST_SPACE_1;
        barra.x = posicion-50; //la barra se dibuja desde la nota anterior
        if(rotar === 1){
          barra.moveTo(0,Y_FIRST_SPACE_1+(HEIGHT_PENT_SPACE));
          barra.lineTo(50,Y_FIRST_SPACE_1+(HEIGHT_PENT_SPACE));
          }
        else{
            barra.moveTo(10,0);
            barra.lineTo(60,0);
          }
        }
      else if (mano === 2){
        barra.y = Y_FIRST_SPACE_2+HEIGHT_PENT_SPACE*3;
        barra.x = posicion2-50; // la barra se dibuja desde la nota anterior
        if(rotar === 1){
          barra.moveTo(0,0);
          barra.lineTo(50,0);
        }
        else{
          barra.moveTo(10,-HEIGHT_PENT_SPACE*3);
          barra.lineTo(60,-HEIGHT_PENT_SPACE*3);
        }
      }
      añadiduras.push(barra);
      stage.addChild(barra);
      quarterNoteX(50,mano,rotar,redoblar[i]);
    }
  }
}

//Este metodo hace el dibujo de la cuarta
function dibujarCorchea(aumento,mano,rotar,redoblar){
    //Se dibuja la corchea
    var c_container = new PIXI.Container();
    var corchea = new PIXI.Graphics()
          .lineStyle(GROSOR_DE_LINEA, 0x000000, 1)
          .moveTo(11,0)
          .lineTo(11,50)
          .moveTo(11,0)
          .bezierCurveTo(10,25,35,15,25,35);
    c_container.addChild(corchea);
    var _ellipse = ellipse(1);
    _ellipse.x=13;
    _ellipse.y=55;
    _ellipse.rotation=2.8;
    c_container.addChild(_ellipse);

    if(mano === 1){
      //se posiciona la corchea en el pentagrama adecuado
        c_container.x = posicion;
        c_container.y = Y_FIRST_SPACE_1;
        if (redoblar === 1){
            var redoble = dibujarRedoble();
            redoble.x = posicion;
            redoble.y = Y_FIRST_SPACE_1;
        }
        posicion=posicion+aumento;//se avanza en la posicion del pentagrama adecuado el tiempo que dura la nota
        notas.push(c_container);//Se añade la nota al vector de notas
    }
    else if (mano === 2){
      //se posiciona la c_container en el pentagrama adecuado
        var c_container = corcheaRotada();
        c_container.x=posicion2;
        c_container.y=Y_FIRST_SPACE_2;
        if (redoblar === 1){
            var redoble = dibujarRedoble();
            redoble.x = posicion2;
            redoble.y = Y_FIRST_SPACE_2;
        }
        posicion2=posicion2+aumento;//se avanza en la posicion del pentagrama adecuado el tiempo que dura la nota

        notas2.push(c_container);//Se añade la nota al vector de notas
    }
    if (redoblar === 1){
      añadiduras.push(redoble); //En caso de que se indique que la nota lleva redoble, se agrega el redoble al vector de añadiduras
      stage.addChild(redoble);
    }


    stage.addChild(c_container); //Se agrega la corchea a la parte visual
}

function dibujarCorcheaCerrada(aumento,mano,rotar,redoblar){
    //Se dibuja la corchea
    var c_container = new PIXI.Container();
    var corchea = new PIXI.Graphics()
          .lineStyle(GROSOR_DE_LINEA, 0x000000, 1)
          .moveTo(11,0)
          .lineTo(11,50)
          .moveTo(11,0)
          .bezierCurveTo(10,25,35,15,25,35)
          .moveTo(11,50)
          .lineTo(0,HEIGHT_NOTE+10)
          .moveTo(0,HEIGHT_NOTE)
          .lineTo(11,HEIGHT_NOTE+10);
    c_container.addChild(corchea);

    if(mano === 1){
      //se posiciona la corchea en el pentagrama adecuado
        c_container.x = posicion;
        c_container.y = Y_FIRST_SPACE_1;
        if (redoblar === 1){
            var redoble = dibujarRedoble();
            redoble.x = posicion;
            redoble.y = Y_FIRST_SPACE_1;
        }
        posicion=posicion+aumento;//se avanza en la posicion del pentagrama adecuado el tiempo que dura la nota
        notas.push(c_container);//Se añade la nota al vector de notas
    }
    else if (mano === 2){
      //se posiciona la c_container en el pentagrama adecuado
        var c_container = corcheaCerradaRotada();
        c_container.x=posicion2;
        c_container.y=Y_FIRST_SPACE_2;
        if (redoblar === 1){
            var redoble = dibujarRedoble();
            redoble.x = posicion2;
            redoble.y = Y_FIRST_SPACE_2;
        }
        posicion2=posicion2+aumento;//se avanza en la posicion del pentagrama adecuado el tiempo que dura la nota

        notas2.push(c_container);//Se añade la nota al vector de notas
    }
    if (redoblar === 1){
      añadiduras.push(redoble); //En caso de que se indique que la nota lleva redoble, se agrega el redoble al vector de añadiduras
      stage.addChild(redoble);
    }


    stage.addChild(c_container); //Se agrega la corchea a la parte visual
}

function corcheaRotada(){
  var c_container = new PIXI.Container();
  var corchea_rotada = new PIXI.Graphics()
        .lineStyle(GROSOR_DE_LINEA,0x000000,1)
        .moveTo(11,0)
        .lineTo(11,50)
        .bezierCurveTo(15,35,40,40,25,20)
  c_container.addChild(corchea_rotada);
  var _ellipse = ellipse(1);
  _ellipse.x=9;
  _ellipse.y=-4;
  _ellipse.rotation=-0.25;
  c_container.addChild(_ellipse);
  return c_container;
}

function corcheaCerradaRotada(){
  var c_container = new PIXI.Container();
  var corchea_rotada = new PIXI.Graphics()
        .lineStyle(GROSOR_DE_LINEA,0x000000,1)
        .moveTo(11,0)
        .lineTo(11,50)
        .bezierCurveTo(15,35,40,40,25,20)
        .moveTo(11,0)
        .lineTo(22,-10)
        .moveTo(22,0)
        .lineTo(11,-10);
  c_container.addChild(corchea_rotada);
  return c_container;
}

function dibujarNegra(aumento,mano,rotar,redoblar){
    var negra = new PIXI.Container();
    negra.addChild(plica());
    var _ellipse = ellipse(1);
    _ellipse.x=13;
    _ellipse.y=55;
    _ellipse.rotation=2.8;
    negra.addChild(_ellipse);
    //var redoble = dibujarRedoble();
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
    return negra;
}
//ellipse
function ellipse(esRellena){
    var ellipse = new PIXI.Graphics()
            .lineStyle(GROSOR_DE_LINEA,0x000000,1);
    if(esRellena===1){
      ellipse.beginFill(0x000000);
    }
    ellipse.drawEllipse(8,8,8,4);
    return ellipse;
}

//plica
function plica(){
  var plica = new PIXI.Graphics()
      .lineStyle(GROSOR_DE_LINEA, 0x000000, 1)
      .moveTo(11,0)
      .lineTo(11,50)
      .endFill();
  return plica;
}

function dibujarBlanca(aumento,mano,rotar,redoblar){
  //Se dibuja la afrodecendiente
  var blanca = new PIXI.Container();

  blanca.addChild(plica());
  var _ellipse = ellipse();
  _ellipse.x=13;
  _ellipse.y=55;
  _ellipse.rotation=2.8;
  blanca.addChild(_ellipse);
    if(mano === 1){
        blanca.x = posicion;
        blanca.y = Y_FIRST_SPACE_1;
        if (redoblar === 1){
          //Si se indica que hay que redoblar, se agrega el redoble
            var redoble = dibujarRedoble();
            redoble.x = posicion;
            redoble.y = Y_FIRST_SPACE_1;
        }
        posicion=posicion+aumento;
        if(rotar === 1){
            rotate(blanca); //Si se indica la rotacion, se rota
        }
        notas.push(blanca); //Se agrega la afrodecendiente al vector de notas adecuadas
    }
    else if (mano === 2){
      //se posiciona la afrodecendiente en las posiciones que corresponde
        blanca.x=posicion2;
        blanca.y=Y_FIRST_SPACE_2;
        if (redoblar === 1){//Si se indica que hay que redoblar, se agrega el redoble
            var redoble = dibujarRedoble();
            redoble.x = posicion2;
            redoble.y = Y_FIRST_SPACE_2;
        }
        posicion2=posicion2+aumento;
        if(rotar === 1){
            rotate(blanca);//Si se indica la rotacion, se rota
        }
        notas2.push(blanca);
    }
    if (redoblar === 1){
      //si tiene redoble, se agrega el redoble al vector de añadiduras para que se pueda animar
      añadiduras.push(redoble);
      stage.addChild(redoble);
    }
    stage.addChild(blanca);
}

//Dibuja silencio de corchea.
function dibujaSilencioCorchea(aumento,mano){
//arc(cx, cy, radius, startAngle, endAngle, anticlockwise)
  var silencioCorchea = new PIXI.Graphics()
          .beginFill(0x000000)
          .lineStyle(GROSOR_DE_LINEA, 0x000000, 1)
          .drawCircle(5, 5,4)
          .endFill()
          .arc(10, 5, 10, 3.14, 0.6,true)
          .lineTo(10,40);
    if(mano === 1){
      //Se posiciona en el pentagrama superior
        silencioCorchea.x = posicion;
        silencioCorchea.y = Y_FIRST_SPACE_1+5;
        posicion = posicion  + aumento;
        añadiduras.push(silencioCorchea);
    }
    else if (mano === 2){
      //Se posiciona en el pentagrama inferior
        silencioCorchea.x = posicion2;
        silencioCorchea.y = Y_FIRST_SPACE_2+5;
        posicion2 = posicion2  + aumento;
        añadiduras.push(silencioCorchea);
    }
    //Se agrega al escenario
 stage.addChild(silencioCorchea);
}

//Dibuja silencio de corchea.
function dibujaSilencioSemiCorchea(aumento,mano){
//arc(cx, cy, radius, startAngle, endAngle, anticlockwise)
    var ssc = new PIXI.Graphics()
        .beginFill(0x000000)
        .lineStyle(GROSOR_DE_LINEA, 0x000000, 1)
        .drawCircle(4, 5,3)
        .endFill()
        .arc(10,5,10,3.14,0.6,true)
        .lineTo(10,40)
        .beginFill(0x000000)
        .drawCircle(0, 18,3)
        .endFill()
        .arc(6,18,10,3.14,0.6,true);
    if(mano === 1){
      //Se posiciona en el pentagrama superior
        ssc.x = posicion;
        ssc.y = Y_FIRST_SPACE_1+5;
        posicion = posicion + ssc.width + aumento;
        añadiduras.push(ssc);
    }
    else if (mano === 2){
      //Se posiciona en el pentagrama inferior
        ssc.x = posicion2;
        ssc.y = Y_FIRST_SPACE_2+5;
        posicion2 = posicion2 + ssc.width + aumento;
        añadiduras.push(ssc);
    }
    //Se agrega al escenario
 stage.addChild(ssc);
}

function quarterNoteX(aumento,mano,rotar){
  var note = new PIXI.Graphics();
  //set a fill and line style again
  note.lineStyle(GROSOR_DE_LINEA, 0x000000, 1);
  note.beginFill(0x000000, 1);
  note.moveTo(11,0);
  note.lineTo(11,HEIGHT_NOTE-5);
  note.lineStyle(GROSOR_DE_LINEA,0x000000,1);
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
