(function() {
	var ang = angular.module('taratatapp',[]);
	var mostrar;

	ang.controller('DatosController', function(){
        document.getElementById("regionLbl").innerHTML += localStorage.getItem("region");
        document.getElementById("usuarioLbl").innerHTML += localStorage.getItem("usuario");
        region = localStorage.getItem("region");
        var banner = document.getElementById("bannerRegion");
        if(region==='Costa Pacifica'){
        	mostrar="1";
                banner.src="img/Fondos/CostaPacifica.jpg"
        }
        else if(region==='Atlantica'){
        	mostrar="2";
                banner.src="img/Fondos/CostaCaribe.jpg"
        }
        else if(region==='Andina'){
        	mostrar="3";
                banner.src="img/Fondos/Andina.jpg"
        }
        else if(region==='Llanera'){
        	mostrar="4";
                banner.src="img/Fondos/llanera.jpg"
        }
        this.regionSelected = function(regionSel){
        	if(regionSel===mostrar){
        		return true;
        	}
        	else{
        		return false;
        	}
        };
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
