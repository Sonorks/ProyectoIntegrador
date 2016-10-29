(function() {
	var ang = angular.module('taratatapp',[]);
	var mostrar;
        var nivel;

	ang.controller('DatosController', function(){
		document.getElementById("nivelLbl").innerHTML += localStorage.getItem("nivel");
        document.getElementById("regionLbl").innerHTML += localStorage.getItem("region");
        document.getElementById("usuarioLbl").innerHTML += localStorage.getItem("usuario");
        region = localStorage.getItem("region");
        nivelSel = localStorage.getItem("nivel");
        console.log(region);
        console.log(nivelSel);
        if(region==='Costa_pacifica'){
        	mostrar="1";
        }
        else if(region==='Costa_caribe'){
        	mostrar="2";
        }
        else if(region==='Andina'){
        	mostrar="3";
        }
        else if(region==='Llanera'){
        	mostrar="4";
        }
        if(nivelSel==='Basico'){
                nivel="1";
        }
        else if(nivelSel==='Intermedio'){
                nivel="2";
        }
        else if(nivelSel==='Dificil'){
                nivel="3";
        }
        else if(nivelSel==='Experto'){
                nivel="4";
        }
        console.log(nivel);
        this.regionSelected = function(regionSel){
        	if(regionSel===mostrar){
        		return true;
        	}
        	else{
        		return false;
        	}
        };
        this.nivelSelected = function(nivelSelec){
                if(nivelSelec===nivel){
                        return true;
                }
                else{
                        return false;
                }
        }
        var instrumentos;
        FileInstruments = "./audios/listaAudios.txt"; //Directorio del archivo de audios
          var rawFile = new XMLHttpRequest();
          rawFile.open("GET",FileInstruments,false);
          rawFile.setRequestHeader('Content-Type','text/plain');
          rawFile.onreadystatechange = function ()
          {
            if(rawFile.readyState === 4)
            {
              if(rawFile.status === 200 || rawFile.status == 0)
              {
                var allText = rawFile.responseText;
                instrumentos = allText.split(","); //En el archivo las notas estan separadas por comas (,)
              }
            }
          };
          rawFile.send(null);  

        var sel = document.getElementById('selectInstrumento');
        var sel2= document.getElementById('selectInstrumento2');
        for(var i = 0; i < instrumentos.length; i++) {
            var opt = document.createElement('option');
            opt.innerHTML = instrumentos[i];
            opt.value = instrumentos[i];
            var opt2 = document.createElement('option');
            opt2.innerHTML = instrumentos[i];
            opt2.value = instrumentos[i];
            sel.appendChild(opt);
            sel2.appendChild(opt2);
        }
	});
	ang.directive('selectSong', function(){
		return{
			restrict: 'E',
			templateUrl: 'html/select.html'
		};
	});
        
        
})();
