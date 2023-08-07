
let datos, page;
let pista = 0;
const back = document.getElementById("back");

///////////////////////////// puntajes //////////////////////////////

// aqui enviar a post los datos y a cookies
function comprobar_puntaje() {
    event.preventDefault();
    const form = document.getElementById("form_"+datos[page].name);
    const msj = document.getElementById("form_msj_"+datos[page].name);
    const formData = new FormData(form);
    let i = 0;
    for (const [key, value] of formData.entries()) {
        console.log(key, value, datos[page].respuestas[i]);
        if (value != datos[page].respuestas[i]) {
            msj.classList.remove("w3-hide");
            return false;
        }
        i++;
    }
    datos[0].terminadas[datos[0].links.indexOf(page)] = 1;
    createLamina(0);
}

// aqui enviar a post los datos y a cookies
function comprobar_puntaje_texto() {
    event.preventDefault();
    const form = document.getElementById("form_"+datos[page].name);
    const msj = document.getElementById("form_msj_"+datos[page].name);
    const formData = new FormData(form);
    let i = 0;
    for (const [key, value] of formData.entries()) {
        let a = value.replace(/[^\w\s]/gi, '').trim().toLowerCase();
        let b = datos[page].respuestas[i].replace(/[^\w\s]/gi, '').trim().toLowerCase();
        console.log(key, a, b);
        if (a != b) {
            msj.classList.remove("w3-hide");
            return false;
        }
        i++;
    }
    datos[0].terminadas[datos[0].links.indexOf(page)] = 1;
    createLamina(0);
}

///////////////////////////// audios ////////////////////////////

function cargaAudio(params) {
    const dialogo = document.getElementById("audios");
    const audio = document.getElementById(params);
    if (dialogo.contains(audio)) {
        return;
    }else{
        const newDiv = document.createElement("div");
        newDiv.innerHTML = '<audio id="'+params+'"><source src="audios/'+params+'.mp3" type="audio/mpeg"></audio>';
        dialogo.appendChild(newDiv);
    }
}

function playAudio(elemento){
    let audio = document.getElementById(elemento);
    audio.play();
}

///////////////////////////// impresoras //////////////////////////////

function plantillas(params) {
    const b = document.getElementById(params);
    // comprobar si esta vacia
    if (b.hasChildNodes()) {
        return;
    } else {
        const a = '<div class="w3-main" style="margin-top: 52px;"><div id="'+params+'_menu" class="w3-container w3-content" style="max-width: 600px;"></div></div>';
        b.innerHTML = a;
    }  
}

function backAction() {
    back.addEventListener('click', function() {
        createLamina(0);
    });
}

function printTopics() {
    console.log("imprimiendo topics");
    const bloque = document.getElementById("topics_menu");
    bloque.innerHTML = `
    <div class="w3-center">
        <p><i class="fa ${datos[page].icon} w3-jumbo text-azul"></i></p>
        <p>${datos[page].parrafo}</p>
    </div>
    ${datos[page].titulos.map((titulo, i) => `
    <br>
    <a href="javascript:void(0);" onclick="createLamina(${datos[page].links[i]})" class="w3-button w3-border w3-round-large w3-padding-large w3-block">
        <span class="w3-left">${titulo}</span>
        <i class="fa ${datos[page].iconos[datos[page].terminadas[i]]} w3-right w3-xlarge ${datos[page].colors[datos[page].terminadas[i]]}" style="margin-top: 2px;"></i></a>
    </a>
    `).join("")}
    `;
}

function loadEasySpeech() {
    const script = document.createElement("script");
    script.src = "js/microfono.js";
    document.head.appendChild(script);
}

function printSpeaking() {
    console.log("imprimiendo speaking");
    for (let i = 0; i < datos[page].audios.length; i++) {
        cargaAudio(datos[page].audios[i]);
    }
    loadEasySpeech();
    const print = `
        <div class="w3-main w3-content" style="max-width: 600px;">
            <div id="dialogo">
            </div>
        </div>
        <div id="micro-control" class="w3-center sombra-inv w3-bottom w3-padding-16" style="padding-bottom: 15px;">
            <div id="pista" class="w3-padding w3-hide">How are you?</div>
            <button id="btnstart" class="w3-button azul w3-round-xxlarge" onclick="empezando()">Comenzar</button>
            <button id="btnmicro" class="w3-circle azul w3-xlarge w3-hide" style="padding: 10px 21px; border: 0;" onclick="microfono()"><i class="fa fa-microphone"></i></button>
        </div>
    `;
    backAction();
    pista = 0;
    document.getElementById("speaking").innerHTML = print;
}

function printListening(){
    console.log("imprimiendo listening");
    for (let i = 0; i < datos[page].audios.length; i++) {
        cargaAudio(datos[page].audios[i]);
    }
    const print = `
        <p class="w3-medium">Escucha y responde con la opción correcta</p>
        <form id="form_listening">
            ${datos[page].audios.map((word, i) =>`
            <br>
            <div class="w3-row">
                <div class="w3-col text-azul" style="width:50px;">
                    <a href="javascript:void(0);" class="w3-xlarge btn-audio" onclick="playAudio('${word}')"><i class="fa fa-play-circle w3-xxlarge vertical"></i></a>
                </div>
                <div class="w3-rest">
                    <select name="name${i}" class="w3-input w3-round-large w3-border">
                        ${datos[page].opciones[i].map((option, z) => `<option value="${z}">${option}</option>`).join("")}
                    </select>
                </div>
            </div>
            `).join("")}
        <p id="form_msj_listening" class="w3-medium w3-center w3-hide w3-red">La respuesta es incorrecta</p>
            <div class="w3-center w3-padding-large">
                <button class="w3-button azul w3-round-xxlarge" onclick="comprobar_puntaje()">Accept</button>
                <br><br>
            </div>
        </form>
    `;
    backAction();
    document.getElementById("listening_menu").innerHTML = print;
}


function printPracticeMenu() {
    console.log("imprimiendo practice");
    const print = `
        <p class="w3-medium w3-center">Selecciona la palabra correcta</p><br>
        <form id="form_practice">
            ${datos[page].words.map((word, i) => `
                <p>${word} &nbsp;
                <select name="name${i}" class="w3-input w3-border w3-round-large">
                    ${datos[page].opciones[i].map((option, z) => `<option value="${z}">${option}</option>`).join("")}
                </select>
                </p>
            `).join("")}
            <p id="form_msj_practice" class="w3-medium w3-center w3-hide w3-red">La respuesta es incorrecta</p>
            <div class="w3-center w3-padding-large">
                <button class="w3-button azul w3-round-xxlarge" onclick="comprobar_puntaje()">Accept</button>
                <br><br>
            </div>
        </form>
    `;
    backAction();
    document.getElementById("practice_menu").innerHTML = print;
}
  
function printWriting() {
    console.log("imprimiendo writing");
    const print = `
      <p class="w3-medium w3-center">Escribe en el orden correcto las siguientes expresiones</p><br>
      <form id="form_writing">
        ${datos[page].words.map((word, i) => `
          <p>${word} &nbsp; <input class="w3-input w3-round-large w3-border" type="text" name="name${i}">
        `).join("")}
        <p id="form_msj_writing" class="w3-medium w3-center w3-hide w3-red">La respuesta es incorrecta</p>
        <div class="w3-center w3-padding-large">
          <button class="w3-button azul w3-round-xxlarge" onclick="comprobar_puntaje_texto()">Accept</button>
          <br><br>
        </div>
      </form>
    `;
    backAction();
    document.getElementById("writing_menu").innerHTML = print;
}

function printFrases() {
    console.log("imprimiendo frases");
}

function printGrammar() {
    console.log("imprimiendo grammar");
    const bloque = document.getElementById("grammar_menu");
    if (!bloque.hasChildNodes()) {
        fetch("nivel1/html/"+datos[page].contenido).then(response => response.text()).then(data => {
            bloque.innerHTML = data;
            backAction();
            const div = document.createElement('div');
            div.innerHTML = `
            <br><br>
            <!-- boton continue -->
            <div class="w3-bottom w3-center w3-padding-large">
                <button id="btn_continue" onclick="createLamina(${datos[page].link})" class="w3-button azul w3-round-xxlarge">Continue</button>
                <br><br>
            </div>`;
            document.getElementById("grammar").appendChild(div);
        });
    }
}

function createLamina(id) {
    page = id;
    const name = datos[page].name;
    console.log(name);
    plantillas(name);
    muestra(name);
    console.log(datos[page].func);
    choicePrint(datos[page].func);
}

function muestra(params) {
    const bloque = document.getElementById(params);
    const botonesPerfil = document.querySelectorAll('.laminas');
    botonesPerfil.forEach(function(boton) {
        boton.classList.add('w3-hide');
    });
    bloque.classList.remove('w3-hide');
}

function choicePrint(id) {
    console.log("printer"+id);
    const functions = {
        0: printTopics,
        1: printPracticeMenu,
        2: printWriting,
        3: printListening,
        4: printSpeaking,
        5: printGrammar,
    };

    const functionToCall = functions[id];
    if (functionToCall) {
        functionToCall();
    }else {
        console.log("No existe la función");
    }
}

///////////////////////////// manejo de cookies //////////////////////////////

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    let user = getCookie("username");
    if (user != "") {
        alert("Welcome again " + user);
    } else {
        user = prompt("Please enter your name:", "");
        if (user != "" && user != null) {
        setCookie("username", user, 365);
        }
    }
}