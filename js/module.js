(function() {
	var ang = angular.module('taratatapp',[]);
	var mostrar;
	ang.controller('DatosController', function(){
		document.getElementById("nivelLbl").innerHTML += localStorage.getItem("nivel");
        document.getElementById("regionLbl").innerHTML += localStorage.getItem("region");
        document.getElementById("usuarioLbl").innerHTML += localStorage.getItem("usuario");
        region = localStorage.getItem("region");
        console.log(region);
        if(region==='costa_pacifica'){
        	mostrar="1";
        }
        else if(region==='Costa Caribe'){
        	mostrar="2";
        }
        else if(region==='Andina'){
        	mostrar="3";
        }
        else if(region==='Llanera'){
        	mostrar="4";
        }
        console.log(mostrar);
        this.regionSelected = function(regionSel){
        	if(regionSel===mostrar){
        		console.log("got it");
        		return true;
        	}
        	else{
        		return false;
        	}
        };
	});
	ang.directive('selectSong', function(){
		return{
			restrict: 'E',
			templateUrl: 'html/select.html'
		};
	});
})();