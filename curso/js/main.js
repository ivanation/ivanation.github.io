let datos,page,nivel,pista=0;const back=document.getElementById("back");function comprobar_puntaje(){event.preventDefault();let e=document.getElementById("form_"+datos[page].name),a=document.getElementById("form_msj_"+datos[page].name),t=new FormData(e),n=0;for(let[i,o]of t.entries()){if(console.log(i,o,datos[page].respuestas[n]),o!=datos[page].respuestas[n])return a.classList.remove("w3-hide"),!1;n++}datos[0].terminadas[datos[0].links.indexOf(page)]=1,createLamina(0)}function comprobar_puntaje_texto(){event.preventDefault();let e=document.getElementById("form_"+datos[page].name),a=document.getElementById("form_msj_"+datos[page].name),t=new FormData(e),n=0;for(let[i,o]of t.entries()){let s=o.replace(/[^\w\s]/gi,"").trim().toLowerCase(),r=datos[page].respuestas[n].replace(/[^\w\s]/gi,"").trim().toLowerCase();if(console.log(i,s,r),s!=r)return a.classList.remove("w3-hide"),!1;n++}datos[0].terminadas[datos[0].links.indexOf(page)]=1,createLamina(0)}function cargaAudio(e){let a=document.getElementById("audios"),t=document.getElementById(e);if(!a.contains(t)){let n=document.createElement("div");n.innerHTML='<audio id="'+e+'"><source src="audios/'+e+'.mp3" type="audio/mpeg"></audio>',a.appendChild(n)}}function playAudio(e){let a=document.getElementById(e);a.currentTime=0,a.play()}function pauseAudio(e){document.getElementById(e).pause()}function isAudioPlaying(e){return!document.getElementById(e).paused}function createDiv(e){let a=document.createElement("div");a.id="vista_"+e,a.className="laminas",document.getElementById("vistas").appendChild(a)}function plantillas(e){let a=document.getElementById("vista_"+page);if(a.hasChildNodes()){console.log("vacio");return}{let t='<div class="w3-main" style="margin-top: 52px;"><div id="vista_'+page+'_menu" class="w3-container w3-content" style="max-width: 600px;"></div></div>';a.innerHTML=t}}function backAction(){back.onclick=function(){createLamina(0)}}function backRoad(){back.onclick=function(){window.location.href="road.html"}}function printTopics(){console.log("imprimiendo topics");let e=document.getElementById("vista_"+page+"_menu");backRoad(),e.innerHTML=`
    <h2 class="text-azul w3-center">${datos[page].titular}</h2>
    <div class="w3-center">
        <p><i class="fa ${datos[page].icon} w3-jumbo text-azul"></i></p>
        <p>${datos[page].parrafo}</p>
    </div>
    ${datos[page].titulos.map((e,a)=>`
    <br>
    <a href="javascript:void(0);" onclick="createLamina(${datos[page].links[a]})" class="w3-button w3-border w3-round-large w3-padding-large w3-block">
        <span class="w3-left">${e}</span>
        <i class="fa ${datos[page].iconos[datos[page].terminadas[a]]} w3-right w3-xlarge ${datos[page].colors[datos[page].terminadas[a]]}" style="margin-top: 2px;"></i></a>
    </a>
    `).join("")}
    `}function loadEasySpeech(){let e=document.createElement("script");e.src="js/microfono.js",document.head.appendChild(e)}function printSpeaking(){console.log("imprimiendo speaking");for(let e=0;e<datos[page].audios.length;e++)cargaAudio(datos[page].audios[e]);loadEasySpeech();let a=`
        <div class="w3-main w3-content" style="max-width: 600px;">
            <div id="dialogo">
            </div>
        </div>
        <div id="micro-control" class="w3-center sombra-inv w3-bottom w3-padding-16" style="padding-bottom: 15px;">
            <div id="pista" class="w3-padding w3-hide">How are you?</div>
            <button id="btnstart" class="w3-button azul w3-round-xxlarge" onclick="empezando()">Comenzar</button>
            <button id="btnmicro" class="w3-circle azul w3-xlarge w3-hide" style="padding: 10px 21px; border: 0;" onclick="microfono()"><i class="fa fa-microphone"></i></button>
        </div>
    `;backAction(),pista=0,document.getElementById("vista_"+page).innerHTML=a}function printListening(){console.log("imprimiendo listening");for(let e=0;e<datos[page].audios.length;e++)cargaAudio(datos[page].audios[e]);let a=`
        <p class="w3-medium w3-center">Escucha y responde con la opci\xf3n correcta</p>
        <form id="form_${datos[page].name}">
            ${datos[page].audios.map((e,a)=>`
            <br>
            <div class="w3-row">
                <div class="w3-col text-azul" style="width:50px;">
                    <a href="javascript:void(0);" class="w3-xlarge btn-audio" onclick="playAudio('${e}')"><i class="fa fa-play-circle w3-xxlarge vertical"></i></a>
                </div>
                <div class="w3-rest">
                    <select name="name${a}" class="w3-input w3-round-large w3-border">
                        ${datos[page].opciones[a].map((e,a)=>`<option value="${a}">${e}</option>`).join("")}
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
    `;backAction(),document.getElementById("vista_"+page+"_menu").innerHTML=a}function printPracticeMenu(){console.log("imprimiendo practice");let e=`
        <p class="w3-medium w3-center">Selecciona la palabra correcta</p><br>
        <form id="form_${datos[page].name}">
            ${datos[page].words.map((e,a)=>`
                <p>${e} &nbsp;
                <select name="name${a}" class="w3-input w3-border w3-round-large">
                    ${datos[page].opciones[a].map((e,a)=>`<option value="${a}">${e}</option>`).join("")}
                </select>
                </p>
            `).join("")}
            <p id="form_msj_${datos[page].name}" class="w3-medium w3-center w3-hide w3-red">La respuesta es incorrecta</p>
            <div class="w3-center w3-padding-large">
                <button class="w3-button azul w3-round-xxlarge" onclick="comprobar_puntaje()">Accept</button>
                <br><br>
            </div>
        </form>
    `;backAction(),document.getElementById("vista_"+page+"_menu").innerHTML=e}function printWriting(){console.log("imprimiendo writing");let e=`
      <p class="w3-medium w3-center">${datos[page].parrafo}</p><br>
      <form id="form_${datos[page].name}">
        ${datos[page].words.map((e,a)=>`
          <p>${e} &nbsp; <input class="w3-input w3-round-large w3-border" type="text" name="name${a}">
        `).join("")}
        <p id="form_msj_${datos[page].name}" class="w3-medium w3-center w3-hide w3-red">La respuesta es incorrecta</p>
        <div class="w3-center w3-padding-large">
          <button class="w3-button azul w3-round-xxlarge" onclick="comprobar_puntaje_texto()">Accept</button>
          <br><br>
        </div>
      </form>
    `;backAction(),document.getElementById("vista_"+page+"_menu").innerHTML=e}function printFrases(){console.log("imprimiendo frases");for(let e=0;e<datos[page].audios.length;e++)cargaAudio(datos[page].audios[e]);let a=document.getElementById("vista_"+page+"_menu");if(!a.hasChildNodes()){let t=`
            <div class="w3-center">
                <h2 class="text-azul">${datos[page].titulo}</h2>
                <p class="w3-medium">${datos[page].parrafo}</p>
                <button id="btn_play" onclick="btnFrases('${datos[page].audios[0]}')" class="w3-circle azul w3-xlarge w3-hover-gray" style="padding: 5px 12px; border: 0; position:relative; top: 10px;"><i class="fa fa-volume-up"></i></button>
                <br>
                <div>
                ${datos[page].frases.map((e,a)=>`
                    <div class="w3-left-align w3-padding-large" style="border-top: 1px solid #ccc;">
                        <span>${e}</span><br>
                        <span class="traduc">${datos[page].traducciones[a]}</span>
                    </div>
                `).join("")}
                    <div style="border-top: #ccc solid 1px;"></div>
                </div>
            </div>
        `;backAction(),document.getElementById("vista_"+page+"_menu").innerHTML=t;let n=document.createElement("div");n.innerHTML=`
        <br><br>
        <!-- boton continue -->
        <div class="w3-bottom w3-center w3-padding-large">
            <button id="btn_continue_${page}" onclick="btnContinueFrases()" class="w3-button azul w3-round-xxlarge w3-hide">${datos[page].boton}</button>
            <br><br>
        </div>`,document.getElementById("vista_"+page).appendChild(n)}}function btnFrases(e){playAudio(e),document.getElementById("btn_continue_"+page).classList.remove("w3-hide")}function btnContinueFrases(){isAudioPlaying(datos[page].audios[0])&&pauseAudio(datos[page].audios[0]),document.getElementById("btn_continue_"+page).classList.add("w3-hide"),0===datos[page].link&&(datos[0].terminadas[datos[page].refTopic]=1),createLamina(datos[page].link)}function printGrammar(){console.log("imprimiendo grammar");let e=document.getElementById("vista_"+page+"_menu");e.hasChildNodes()||fetch("nivel1/html/"+datos[page].contenido).then(e=>e.text()).then(a=>{e.innerHTML=a,backAction();let t=document.createElement("div");t.innerHTML=`
            <br><br>
            <!-- boton continue -->
            <div class="w3-bottom w3-center w3-padding-large">
                <button id="btn_continue_${page}" onclick="btnContinueGrammar()" class="w3-button azul w3-round-xxlarge">${datos[page].boton}</button>
                <br><br>
            </div>`,document.getElementById("vista_"+page).appendChild(t)})}function btnContinueGrammar(){0===datos[page].link&&(datos[0].terminadas[datos[0].links.indexOf(page)]=1),createLamina(datos[page].link)}function createLamina(e){plantillas("vista_"+(page=e)),muestra("vista_"+page),choicePrint(datos[page].func)}function muestra(e){let a=document.getElementById(e),t=document.querySelectorAll(".laminas");t.forEach(function(e){e.classList.add("w3-hide")}),a.classList.remove("w3-hide")}function choicePrint(e){let a={0:printTopics,1:printPracticeMenu,2:printWriting,3:printListening,4:printSpeaking,5:printGrammar,6:printFrases}[e];a?a():console.log("No existe la función")}function setCookie(e,a,t){let n=new Date;n.setTime(n.getTime()+864e5*t);let i="expires="+n.toUTCString();document.cookie=e+"="+a+";"+i+";path=/"}function getCookie(e){let a=e+"=",t=document.cookie.split(";");for(let n=0;n<t.length;n++){let i=t[n];for(;" "==i.charAt(0);)i=i.substring(1);if(0==i.indexOf(a))return i.substring(a.length,i.length)}return""}function checkCookie(){let e=getCookie("username");""!=e?alert("Welcome again "+e):""!=(e=prompt("Please enter your name:",""))&&null!=e&&setCookie("username",e,365)}