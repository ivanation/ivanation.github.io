let datos,page,topics;const back=document.getElementById("back");function comprobar_puntaje(){event.preventDefault();let e=document.getElementById("form_"+datos[page].name),t=document.getElementById("form_msj_"+datos[page].name),a=new FormData(e),i=0;for(let[n,o]of a.entries()){if(console.log(n,o,datos[page].respuestas[i]),o!=datos[page].respuestas[i])return t.classList.remove("w3-hide"),!1;i++}datos[0].terminadas[datos[0].links.indexOf(page)]=1,createLamina(0)}function comprobar_puntaje_texto(){event.preventDefault();let e=document.getElementById("form_"+datos[page].name),t=document.getElementById("form_msj_"+datos[page].name),a=new FormData(e),i=0;for(let[n,o]of a.entries()){let s=o.replace(/[^\w\s]/gi,"").trim().toLowerCase(),r=datos[page].respuestas[i].replace(/[^\w\s]/gi,"").trim().toLowerCase();if(console.log(n,s,r),s!=r)return t.classList.remove("w3-hide"),!1;i++}datos[0].terminadas[datos[0].links.indexOf(page)]=1,createLamina(0)}function cargaAudio(e){let t=document.getElementById("audios"),a=document.getElementById(e);if(!t.contains(a)){let i=document.createElement("div");i.innerHTML='<audio id="'+e+'"><source src="audios/'+e+'.mp3" type="audio/mpeg"></audio>',t.appendChild(i)}}function playAudio(e){document.getElementById(e).play()}function plantillas(e){let t=document.getElementById(e);!t.hasChildNodes()&&(t.innerHTML='<div class="w3-main" style="margin-top: 52px;"><div id="'+e+'_menu" class="w3-container w3-content" style="max-width: 600px;"></div></div>')}function backAction(){back.addEventListener("click",function(){createLamina(0)})}function printTopics(){console.log("imprimiendo topics");let e=document.getElementById("topics_menu");e.innerHTML=`
    <div class="w3-center">
        <p><i class="fa ${datos[page].icon} w3-jumbo text-azul"></i></p>
        <p>${datos[page].parrafo}</p>
    </div>
    ${datos[page].titulos.map((e,t)=>`
    <br>
    <a href="javascript:void(0);" onclick="createLamina(${datos[page].links[t]})" class="w3-button w3-border w3-round-large w3-padding-large w3-block">
        <span class="w3-left">${e}</span>
        <i class="fa ${datos[page].iconos[datos[page].terminadas[t]]} w3-right w3-xlarge ${datos[page].colors[datos[page].terminadas[t]]}" style="margin-top: 2px;"></i></a>
    </a>
    `).join("")}
    `}function loadEasySpeech(){let e=document.createElement("script");e.src="js/microfono.js",document.head.appendChild(e)}function printSpeaking(){console.log("imprimiendo speaking");for(let e=0;e<datos[page].audios.length;e++)cargaAudio(datos[page].audios[e]);loadEasySpeech();let t=`
        <div class="w3-main w3-content" style="max-width: 600px;">
            <div id="dialogo">
            </div>
        </div>
        <div id="micro-control" class="w3-center sombra-inv w3-bottom w3-padding-16" style="padding-bottom: 15px;">
            <div id="pista" class="w3-padding w3-hide">How are you?</div>
            <button id="btnstart" class="w3-button azul w3-round-xxlarge" onclick="empezando()">Comenzar</button>
            <button id="btnmicro" class="w3-circle azul w3-xlarge w3-hide" style="padding: 10px 21px; border: 0;" onclick="microfono()"><i class="fa fa-microphone"></i></button>
        </div>
    `;backAction(),pista=0,document.getElementById("speaking").innerHTML=t}function printListening(){console.log("imprimiendo listening");for(let e=0;e<datos[page].audios.length;e++)cargaAudio(datos[page].audios[e]);let t=`
        <p class="w3-medium">Escucha y responde con la opci\xf3n correcta</p>
        <form id="form_listening">
            ${datos[page].audios.map((e,t)=>`
            <br>
            <div class="w3-row">
                <div class="w3-col text-azul" style="width:50px;">
                    <a href="javascript:void(0);" class="w3-xlarge btn-audio" onclick="playAudio('${e}')"><i class="fa fa-play-circle w3-xxlarge vertical"></i></a>
                </div>
                <div class="w3-rest">
                    <select name="name${t}" class="w3-input w3-round-large w3-border">
                        ${datos[page].opciones[t].map((e,t)=>`<option value="${t}">${e}</option>`).join("")}
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
    `;backAction(),document.getElementById("listening_menu").innerHTML=t}function printPracticeMenu(){console.log("imprimiendo practice");let e=`
        <p class="w3-medium w3-center">Selecciona la palabra correcta</p><br>
        <form id="form_practice">
            ${datos[page].words.map((e,t)=>`
                <p>${e} &nbsp;
                <select name="name${t}" class="w3-input w3-border w3-round-large">
                    ${datos[page].opciones[t].map((e,t)=>`<option value="${t}">${e}</option>`).join("")}
                </select>
                </p>
            `).join("")}
            <p id="form_msj_practice" class="w3-medium w3-center w3-hide w3-red">La respuesta es incorrecta</p>
            <div class="w3-center w3-padding-large">
                <button class="w3-button azul w3-round-xxlarge" onclick="comprobar_puntaje()">Accept</button>
                <br><br>
            </div>
        </form>
    `;backAction(),document.getElementById("practice_menu").innerHTML=e}function printWriting(){console.log("imprimiendo writing");let e=`
      <p class="w3-medium w3-center">Escribe en el orden correcto las siguientes expresiones</p><br>
      <form id="form_writing">
        ${datos[page].words.map((e,t)=>`
          <p>${e} &nbsp; <input class="w3-input w3-round-large w3-border" type="text" name="name${t}">
        `).join("")}
        <p id="form_msj_writing" class="w3-medium w3-center w3-hide w3-red">La respuesta es incorrecta</p>
        <div class="w3-center w3-padding-large">
          <button class="w3-button azul w3-round-xxlarge" onclick="comprobar_puntaje_texto()">Accept</button>
          <br><br>
        </div>
      </form>
    `;backAction(),document.getElementById("writing_menu").innerHTML=e}function createLamina(e){page=e;let t=datos[page].name;console.log(t),plantillas(t),muestra(t),console.log(datos[page].func),choicePrint(datos[page].func)}function muestra(e){let t=document.getElementById(e),a=document.querySelectorAll(".laminas");a.forEach(function(e){e.classList.add("w3-hide")}),t.classList.remove("w3-hide")}function choicePrint(e){let t={0:printTopics,1:printPracticeMenu,2:printWriting,3:printListening,4:printSpeaking}[e];t?t():console.log("No existe la función")}function setCookie(e,t,a){let i=new Date;i.setTime(i.getTime()+864e5*a);let n="expires="+i.toUTCString();document.cookie=e+"="+t+";"+n+";path=/"}function getCookie(e){let t=e+"=",a=document.cookie.split(";");for(let i=0;i<a.length;i++){let n=a[i];for(;" "==n.charAt(0);)n=n.substring(1);if(0==n.indexOf(t))return n.substring(t.length,n.length)}return""}function checkCookie(){let e=getCookie("username");""!=e?alert("Welcome again "+e):""!=(e=prompt("Please enter your name:",""))&&null!=e&&setCookie("username",e,365)}