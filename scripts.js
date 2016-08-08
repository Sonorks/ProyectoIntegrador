/*global alert: false */
/*global HTMLAudioElement: false */
/*global Event: false */
/*global console: false */
function izq() {
    "use strict";
    var sonido = document.getElementById("sonido");
    sonido.play();
    document.getElementById("res").textContent = document.getElementById("res").textContent + "I-";
}

function der() {
    "use strict";
    var sonido2 = document.getElementById("sonido2");
    sonido2.play();
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
