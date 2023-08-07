
pista = 0;

function comienza(){
    if (pista < datos[page].audios.length) {
        playAudio(datos[page].audios[pista]);
        nube(datos[page].preguntas[pista],1);
        pista++;
    }
}

function comienza2(){
    if (pista < datos[page].audios.length) {
        playAudio(datos[page].audios[pista]);
        nube(datos[page].preguntas[pista],0);
        pista++;
    }
}

function empezando() {
    document.getElementById("btnstart").style.display = "none";
    document.getElementById("btnmicro").classList.remove("w3-hide");
    comienza();
}

function nube(elemento, lado){
    const dialogo = document.getElementById("dialogo");
    const newDiv = document.createElement("div");
    if (lado == 1){
        newDiv.innerHTML = "<div class=\"w3-block w3-padding w3-animate-opacity\"><span class=\"nube-izqda\">"+elemento+"</span></div>";
    } else {
        newDiv.innerHTML = "<div class=\"w3-block w3-padding w3-animate-left w3-right-align\"><span class=\"nube-drcha\">"+elemento+"</span></div>";
    }
    dialogo.appendChild(newDiv);
}

function compararstring(a){
    a = a.replace(/[^\w\s]/gi, '').trim().toLowerCase();
    for (let i = 0; i < datos[page].respuestas[pista-1].length; i++) {
        let b = datos[page].respuestas[pista-1][i].replace(/[^\w\s]/gi, '').trim().toLowerCase();
        console.log("comparación: "+a+" = "+b);
        if (a.includes(b)){
            return true;
        }
    }
    return false;
}

////////////////////// voces
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var speechRecognition = new SpeechRecognition();

speechRecognition.lang = "en-US";

speechRecognition.onstart = function() {
    console.log('Listening...');
    let a =document.getElementById("btnmicro");
    a.classList.remove("azul");
    a.classList.add("w3-grey");
};

speechRecognition.onend = function() {
    console.log('No longer listening...');
    let a = document.getElementById("btnmicro");
    a.classList.remove("w3-grey");
    a.classList.add("azul");
};

speechRecognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    const confidence = event.results[0][0].confidence;
    console.log(`Transcript: ${transcript}`);
    console.log(`Confidence: ${confidence}`);
    if(compararstring(transcript)){
        nube(transcript,0);
        setTimeout(comienza, 1000);
        if(pista >= datos[page].audios.length){ /////////////////////////////// guardar progreso
            document.getElementById("micro-control").classList.add("w3-hide");
            datos[0].terminadas[datos[0].links.indexOf(page)] = 1;
            createLamina(0);
        }
    }else{
        let ele = document.getElementById("pista");
        ele.classList.remove("w3-hide");
        ele.innerHTML = datos[page].respuestas[pista-1][0];
    }
};

// Empezar a reconocer el habla
function microfono(){
    event.preventDefault();
    document.getElementById("pista").classList.add("w3-hide");
    speechRecognition.start();
    console.log('Ready to receive a color command.');
}
