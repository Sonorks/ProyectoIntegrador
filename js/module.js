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
	});
	ang.directive('selectSong', function(){
		return{
			restrict: 'E',
			templateUrl: 'html/select.html'
		};
	});
})();