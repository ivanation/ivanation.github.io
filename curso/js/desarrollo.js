
let datos, page, nivel;
let pista = 0;
const back = document.getElementById("back");
const logo = document.getElementById("logo");
let cont = 0;
let errores = 0;
let errores_maximos = 0;
let excludedArray = [];

///////////////////////////// puntajes //////////////////////////////

function salvar_puntaje() {
    users[usuario]["finish"][datos[0].links.indexOf(page)] = 1;
    let data = new FormData();
    data.append("data",JSON.stringify(users));
    data.append("nro",clase);
    fetch("nivel1/leer.php", {method: "POST",body: data});
}

function salvar_puntaje_frases() {
    users[usuario]["finish"][datos[page].refTopic] = 1;
    let data = new FormData();
    data.append("data",JSON.stringify(users));
    fetch("nivel1/leer.php", {method: "POST",body: data});
}

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
    audio.currentTime = 0;
    audio.play();
}

function pauseAudio(elemento){
    let audio = document.getElementById(elemento);
    audio.pause();
}

function isAudioPlaying(elemento){
    let audio = document.getElementById(elemento);
    return !audio.paused;
}

///////////////////////////// impresoras //////////////////////////////

function createDiv(params) {
    const div = document.createElement('div');
    div.id = "vista_"+params;
    div.className = "laminas";
    document.getElementById("vistas").appendChild(div);
}

function plantillas(params) {
    const b = document.getElementById("vista_"+page);
    // comprobar si esta vacia
    if (b.hasChildNodes()) {
        console.log("vacio");
        return;
    } else {
        const a = '<div class="w3-main" style="margin-top: 52px;"><div id="vista_'+ page + '_menu" class="w3-container w3-content" style="max-width: 600px;"></div></div>';
        b.innerHTML = a;
    }  
}

function backAction() {
    back.onclick = function() {
        createLamina(0);
    }
}

function backRoad() {
    back.onclick = function() {
        window.location.href = "road.html";
    }
}

///////////////////////////////////////////////////////////////////////////

function printTopics() {
    console.log("imprimiendo topics");
    const bloque = document.getElementById("vista_"+ page + "_menu");
    backRoad();
    bloque.innerHTML = `
    <h2 class="text-azul w3-center">${datos[page].titular}</h2>
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

function printNumberTest() {
    console.log("imprimiendo number test");
    cont = 0;
    errores = 0;
    errores_maximos = 0;
    excludedArray = [];
    const len = datos[page].words.length;
    const randomIndex = Math.floor(Math.random() * len);
    excludedArray.push(randomIndex);
    const opciones = randomOptions(randomIndex);
    const print = `
    <div class="w3-center">
        <p class="w3-medium">Selecciona la opción correcta</p>
        <span id="circulo_${page}"><span id="numero" class="w3-text-gray">${datos[page].words[randomIndex][1]}</span></span>
        <br>
        <div class="w3-center" id="opciones_test">
            ${opciones.map((value) => `
                <p resp="${value}" class="w3-border w3-round-large w3-hover-grey w3-padding" onclick="clickTest()">${datos[page].words[value][0]}</p>
            `).join("")}
        </div>
    </div>`;
    errores_maximos = Math.ceil(len*0.1);
    document.getElementById('vista_'+ page + '_menu').innerHTML = print;
    logo.innerHTML = `<span id="cont_${page}">${errores}</span> / <span id="total_${page}">${errores_maximos}</span>`;
    backAction();
}

function randomOptions(pos) {
    const len = datos[page].words.length;
    // selecciono dos posiciones random que no sean pos
    let randomIndex1 = Math.floor(Math.random() * len);
    while (randomIndex1 == pos) {
        randomIndex1 = Math.floor(Math.random() * len);
    }
    let randomIndex2 = Math.floor(Math.random() * len);
    while (randomIndex2 == pos || randomIndex2 == randomIndex1) {
        randomIndex2 = Math.floor(Math.random() * len);
    }
    // hago un array con los resultados
    let array = [randomIndex1, randomIndex2, pos];
    // desordeno el array
    const len2 = array.length;
    for (let i = 0; i < len2; i++) {
        let randomIndex = Math.floor(Math.random() * len2);
        let temp = array[i];
        array[i] = array[randomIndex];
        array[randomIndex] = temp;
    }
    return array;
}

function seleccionaGanador(excludedArray) {
    const len = datos[page].words.length;
    let randomIndex = Math.floor(Math.random() * len);
    while (excludedArray.includes(randomIndex)) {
        randomIndex = Math.floor(Math.random() * len);
    }
    return randomIndex;
}

function clickTest() {
    event.preventDefault();
    let resp = event.target.getAttribute("resp");
    if (resp == excludedArray[excludedArray.length-1]) {
        actualizaTest();
    } else {
        errores++;
        if (errores > errores_maximos) {
            createLamina(0);
        }else{
            actualizaTest();
        }
    }
}

function actualizaTest() {
    const len = datos[page].words.length;
    const randomIndex = seleccionaGanador(excludedArray);
    excludedArray.push(randomIndex);
    // si ya no quedan mas numeros pasa la prueba
    if (excludedArray.length == len) {
        datos[0].terminadas[datos[0].links.indexOf(page)] = 1;
        salvar_puntaje();
        createLamina(0);
    } else {
        const opciones = randomOptions(randomIndex);
        //console.log(excludedArray);
        document.getElementById("opciones_test").innerHTML = opciones.map((value) => `
        <p resp="${value}" class="w3-border w3-round-large w3-hover-grey w3-padding" onclick="clickTest()">${datos[page].words[value][0]}</p>`).join("");
        document.getElementById("cont_"+page).innerHTML = errores;
        document.getElementById('numero').innerHTML = datos[page].words[randomIndex][1];
    }
    
}

function printNumber() {
    console.log("imprimiendo number");
    let len = datos[page].words.length;
    for (let i = 0; i < len; i++) {
        cargaAudio(datos[page].words[i][1]);
    }
    cont = 0;
    const print = `
    <div class="w3-center">
        <p class="w3-medium">Escucha y repite los mejor que puedas</p>
        <span id="circulo_${page}"><span id="numero" class="w3-text-gray">${datos[page].words[cont][1]}</span></span>
        <br><br>
        <div class="w3-row">
            <div class="w3-col s3 m3 l3">
                <span onclick="avanzaNumber(0)" class="cu"><i class="fa fa-chevron-left" aria-hidden="true"></i></span>
            </div>
            <div class="w3-col s6 m6 l6">
                <span><a id="sonido" href="javascript:void(0)" onclick="playAudio(datos[page].words[cont][1]);"><i class="fa fa-volume-down" aria-hidden="true"></i>&nbsp;<span id="name_${page}">${datos[page].words[cont][0]}</span></a></h3>
            </div>
            <div class="w3-col s3 m3 l3">
                <span onclick="avanzaNumber(1)" class="cu"><i class="fa fa-chevron-right" aria-hidden="true"></i></span>
            </div>
        </div>
    </div>`;
    document.getElementById('vista_'+ page + '_menu').innerHTML = print;
    logo.innerHTML = `<span id="cont_${page}">${cont+1}</span> / <span id="total_${page}">${len}</span>`;
    backAction();
}

function actualizaNumber(paso) {
    cont += paso
    const len = datos[page].words.length;
    document.getElementById("cont_"+page).innerHTML = cont+1;
    document.getElementById("total_"+page).innerHTML = len;
    document.getElementById("name_"+page).innerHTML = datos[page].words[cont][0];
    document.getElementById("numero").innerHTML = datos[page].words[cont][1];
    playAudio(datos[page].words[cont][1]);
}

function avanzaNumber(paso){
    if (paso == 1) {
        if(datos[page].words[cont+1]){
            actualizaNumber(1);
        }else{
            datos[0].terminadas[datos[0].links.indexOf(page)] = 1;
            salvar_puntaje();
            cont = -1;
            actualizaNumber(1);
        }
    } else {
        if(datos[page].words[cont-1]){
            actualizaNumber(-1);
        }else{
            cont = datos[page].words.length;
            actualizaNumber(-1);
        }
    }
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
    document.getElementById("vista_"+page).innerHTML = print;
}

function printListening(){
    console.log("imprimiendo listening");
    for (let i = 0; i < datos[page].audios.length; i++) {
        cargaAudio(datos[page].audios[i]);
    }
    const print = `
        <p class="w3-medium w3-center">Escucha y responde con la opción correcta</p>
        <form id="form_${datos[page].name}">
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
        <p id="form_msj_${datos[page].name}" class="w3-medium w3-center w3-hide w3-red">La respuesta es incorrecta</p>
            <div class="w3-center w3-padding-large">
                <button class="w3-button azul w3-round-xxlarge" onclick="comprobar_puntaje()">Accept</button>
                <br><br>
            </div>
        </form>
    `;
    backAction();
    document.getElementById("vista_"+ page + "_menu").innerHTML = print;
}


function printPracticeMenu() {
    console.log("imprimiendo practice");
    const print = `
        <p class="w3-medium w3-center">Selecciona la palabra correcta</p><br>
        <form id="form_${datos[page].name}">
            ${datos[page].words.map((word, i) => `
                <p>${word} &nbsp;
                <select name="name${i}" class="w3-input w3-border w3-round-large">
                    ${datos[page].opciones[i].map((option, z) => `<option value="${z}">${option}</option>`).join("")}
                </select>
                </p>
            `).join("")}
            <p id="form_msj_${datos[page].name}" class="w3-medium w3-center w3-hide w3-red">La respuesta es incorrecta</p>
            <div class="w3-center w3-padding-large">
                <button class="w3-button azul w3-round-xxlarge" onclick="comprobar_puntaje()">Accept</button>
                <br><br>
            </div>
        </form>
    `;
    backAction();
    document.getElementById("vista_"+ page + "_menu").innerHTML = print;
}
  
function printWriting() {
    console.log("imprimiendo writing");
    const print = `
      <p class="w3-medium w3-center">${datos[page].parrafo}</p><br>
      <form id="form_${datos[page].name}">
        ${datos[page].words.map((word, i) => `
          <p>${word} &nbsp; <input class="w3-input w3-round-large w3-border" type="text" name="name${i}">
        `).join("")}
        <p id="form_msj_${datos[page].name}" class="w3-medium w3-center w3-hide w3-red">La respuesta es incorrecta</p>
        <div class="w3-center w3-padding-large">
          <button class="w3-button azul w3-round-xxlarge" onclick="comprobar_puntaje_texto()">Accept</button>
          <br><br>
        </div>
      </form>
    `;
    backAction();
    document.getElementById("vista_"+ page + "_menu").innerHTML = print;
}

function printFrases() {
    console.log("imprimiendo frases");
    for (let i = 0; i < datos[page].audios.length; i++) {
        cargaAudio(datos[page].audios[i]);
    }
    const bloque = document.getElementById("vista_"+ page + "_menu");
    if (!bloque.hasChildNodes()) {
        const print = `
            <div class="w3-center">
                <h2 class="text-azul">${datos[page].titulo}</h2>
                <p class="w3-medium">${datos[page].parrafo}</p>
                <button id="btn_play" onclick="btnFrases('${datos[page].audios[0]}')" class="w3-circle azul w3-xlarge w3-hover-gray" style="padding: 5px 12px; border: 0; position:relative; top: 10px;"><i class="fa fa-volume-up"></i></button>
                <br>
                <div>
                ${datos[page].frases.map((word, i) => `
                    <div class="w3-left-align w3-padding-large" style="border-top: 1px solid #ccc;">
                        <span>${word}</span><br>
                        <span class="traduc">${datos[page].traducciones[i]}</span>
                    </div>
                `).join("")}
                    <div style="border-top: #ccc solid 1px;"></div>
                </div>
            </div>
        `;
        backAction();
        document.getElementById("vista_"+ page + "_menu").innerHTML = print;
        const div = document.createElement('div');
        div.innerHTML = `
        <br><br>
        <!-- boton continue -->
        <div class="w3-bottom w3-center w3-padding-large">
            <button id="btn_continue_${page}" onclick="btnContinueFrases()" class="w3-button azul w3-round-xxlarge w3-hide">${datos[page].boton}</button>
            <br><br>
        </div>`;
        document.getElementById("vista_"+page).appendChild(div);
    }
}

function btnFrases(elemento) { ///////////////// revisar y guardar que termino
    playAudio(elemento);
    document.getElementById("btn_continue_"+page).classList.remove("w3-hide");
}

function btnContinueFrases(){
    if (isAudioPlaying(datos[page].audios[0])){
        pauseAudio(datos[page].audios[0]);
    }
    document.getElementById("btn_continue_" + page).classList.add("w3-hide");
    if (datos[page].link === 0){
        datos[0].terminadas[datos[page].refTopic] = 1;
        salvar_puntaje_frases();
    }
    createLamina(datos[page].link)
}

function printGrammar() {
    console.log("imprimiendo grammar");
    const bloque = document.getElementById("vista_"+ page + "_menu");
    if (!bloque.hasChildNodes()) {
        fetch("nivel1/html/"+datos[page].contenido).then(response => response.text()).then(data => {
            bloque.innerHTML = data;
            backAction();
            const div = document.createElement('div');
            div.innerHTML = `
            <br><br>
            <!-- boton continue -->
            <div class="w3-bottom w3-center w3-padding-large">
                <button id="btn_continue_${page}" onclick="btnContinueGrammar()" class="w3-button azul w3-round-xxlarge">${datos[page].boton}</button>
                <br><br>
            </div>`;
            document.getElementById("vista_"+page).appendChild(div);
        });
    }
}

function btnContinueGrammar(){
    if (datos[page].link === 0) datos[0].terminadas[datos[0].links.indexOf(page)] = 1;
    createLamina(datos[page].link)
}

///////////////////////////////

function createLamina(id) {
    page = id;
    plantillas("vista_"+page);
    muestra("vista_"+page);
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
    const functions = {
        0: printTopics,
        1: printPracticeMenu,
        2: printWriting,
        3: printListening,
        4: printSpeaking,
        5: printGrammar,
        6: printFrases,
        7: printNumber,
        8: printNumberTest
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