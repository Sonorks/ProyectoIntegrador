/*global alert: false */
/*global HTMLAudioElement: false */
/*global Event: false */
/*global console: false */
function iniciar(){
	//el Metronomo
	var synth = new Tone.Synth().toMaster();
	Tone.Transport.start();
	Tone.Transport.scheduleRepeat(function(time){
		synth.triggerAttackRelease("B4","8n");
		console.log(time);
	}, "0.5");

}

function izq() {
	"use strict";
	//var sonido = document.getElementById("sonido");
	//sonido.play();
	var synth = new Tone.Synth().toMaster();
	synth.triggerAttackRelease("C4","8n");
	document.getElementById("res").textContent = document.getElementById("res").textContent + "I-";	}

	function der() {
		"use strict";
		var synth = new Tone.Synth().toMaster();
		synth.triggerAttackRelease("A4","8n");
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
