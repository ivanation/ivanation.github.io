
let datos_topics="";
let datos_practice="";
let datos_writing="";
let page = "";
const back = document.getElementById("back");

///////////////////////////// puntajes //////////////////////////////

function comprobar_puntaje() {
    event.preventDefault();
    const form = document.getElementById("form_"+page);
    const formData = new FormData(form);
    let i = 0;
    for (const [key, value] of formData.entries()) {
        console.log(key, value);
        i++;
    }
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

function removeExtension(string) {
    const extensionIndex = string.lastIndexOf(".");
    if (extensionIndex != -1) {
        return string.slice(0, extensionIndex);
    } else {
        return string;
    }
}

function backAction() {
    back.addEventListener('click', function() {
        createLamina('topics', datos_topics);
    });
}

function printTopicsMenu(a, menu) {
    console.log("imprimiendo topics");
    let print ="";
    print += '<p class="w3-center"><i class="fa ' + menu.icon + ' w3-jumbo text-azul"></i></p>';
    print += '<p class="w3-center">' + menu.parrafo + "</p>";
    for (let i = 0; i < menu.titulos.length; i++) {
        const removido = removeExtension(menu.links[i])
        print += '<br><a href="javascript:void(0);" onclick="createLamina(\''+removido+'\', datos_'+removido+')" class="w3-border w3-round-large w3-padding-large w3-block w3-button">';
        print += '<span class="w3-left">' + menu.titulos[i] + '</span>';
        print += '<i class="fa fa-chevron-right w3-right w3-xlarge text-azul" style="margin-top: 2px;"></i></a>';
    }
    a.innerHTML = print;
}

function printPracticeMenu(a,params) {
    console.log("imprimiendo practice");
    let print = "";
    print += '<p class="w3-medium w3-center">Selecciona la palabra correcta</p><br><form id="form_practice">';
    for (let i = 0; i < params.words.length; i++) {
        print += '<p>' + params.words[i] + ' &nbsp; ';
        print += '<select name="name'+i+'" class="w3-input w3-border w3-round-large">';
            for (let z = 0; z < params.opciones[i].length; z++) {
                print += '<option value="'+z+'">'+params.opciones[i][z]+'</option>';
            }
        print += '</select></p>';
    }
    print += '<div class="w3-center w3-padding-large">';
    print += '<button class="w3-button azul w3-round-xxlarge" onclick="comprobar_puntaje()">Accept</button>';
    print += '<br><br></div>';
    print += '</form>';
    backAction();
    a.innerHTML = print;
}

function printWriting(a,params) {
    console.log("imprimiendo writing");
    let print = '<p class="w3-medium w3-center">Escribe en el orden correcto las siguientes expresiones</p><br><form id="form_writing">';
    for (let i = 0; i < params.length; i++) {
        print += '<p>' + params[i][0] + ' &nbsp; <input class="w3-input w3-round-large w3-border" type="text" name="name' + i + '">';
    }
    print += '</form>';
    backAction();
    a.innerHTML = print;
}

function createLamina(id, datos) {
    // guardo en que pagina estoy
    page = id;
    // coloco la plantilla
    plantillas(id);
    // coloco el spinner mientras cargo
    muestra(id);
    const bloque = document.getElementById(id+"_menu");
    bloque.innerHTML = '<br><br><p class="w3-center"><i class="fa fa-spinner w3-spin text-azul" style="font-size:64px"></i></p><br><br>';
    // obtengo los datos de una variable global si no, cargo el json
    if (datos != "") {
        console.log("datos encontrado", datos);
        choicePrint(id,bloque);
    }else{
        console.log("datos cargando");
        fetch("nivel1/class1/"+id+".json").then(response => response.json()).then(data => {
            choiceData(id, data);
            choicePrint(id,bloque);
        });
    }
}

function muestra(params) {
    const bloque = document.getElementById(params);
    const botonesPerfil = document.querySelectorAll('.laminas');
    botonesPerfil.forEach(function(boton) {
        boton.classList.add('w3-hide');
    });
    bloque.classList.remove('w3-hide');
}

function choicePrint(id,bloque) {
    if (id=='practice') {
        printPracticeMenu(bloque, datos_practice);
    }else if(id=='topics') {
        printTopicsMenu(bloque, datos_topics);
    }else if(id=='writing') {
        printWriting(bloque, datos_writing);
    }
}

function choiceData(id, data) {
    if (id=='practice') {
        datos_practice = data;
    }else if(id=='topics') {
        datos_topics = data;
    }else if(id=='writing') {
        datos_writing = data;
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