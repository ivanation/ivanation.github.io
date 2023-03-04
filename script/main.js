
const colors = ["blue","black","beige","brown","grey","green","magenta","olive","orange","pink","purple","red","ultramarine","violet","white","yellow"]

const clothes = ["umbrella","waistcoat","handbag","belt","bikini","boots","cap","dress","gloves","hat","jacket","jeans","trousers","pyjamas","heels","sandals","scarf","shirt","shorts","skirt","sneakers","socks","suit","sunglasses","swimsuit","raincoat","tie","top","shoes","t-shirt"]

const inicio = ["study","test","colors","clothes"]

const numbers = [["one",1],["two",2],["three",3],["four",4],["five",5],["six",6],["seven",7],["eight",8],["nine",9],["ten",10],["eleven",11],["twelve",12],["thirteen",13],["fourteen",14],["fifteen",15],["sixteen",16],["seventeen",17],["eighteen",18],["nineteen",19],["twenty",20],["thirty",30],["forty",40],["fifty",50],["sixty",60],["seventy",70],["eighty",80],["ninety",90],["one hundred",100]]

///////////////////////////////// paginacion

function avanza(num){
    if (num == 1) {
        cont++
        if (cont >= len) cont = 0
        actiualiza()
    }else{
        cont--
        if (cont < 0) cont = len - 1
        actiualiza()
    }
}

///////////////////////////////// api de voz

//const idres = document.getElementById("result");

function habla(txt) {
    event.preventDefault()

    // Verificar si el navegador admite la API de voz en la web
    if ('speechSynthesis' in window) {
        
        // Crear una instancia del objeto SpeechSynthesisUtterance
        const synthesisUtterance = new SpeechSynthesisUtterance(txt);

        // Extrae las voces
        //const voices = window.speechSynthesis.getVoices();

        let n = -1;

        // Imprimir las diferentes voces disponibles en la consola
        //console.log('Las diferentes voces disponibles son: ');
        //idres.innerHTML += 'Las diferentes voces disponibles son: ' + '<br>';
        
        for (let i = 0; i < voices.length; i++) {
            //idres.innerHTML += i + ' ' +  voices[i].name + ' ' + voices[i].lang + '<br>'
            //console.log(`${i}. ${voices[i].name}. ${voices[i].lang}`)
            if(voices[i].lang.includes('US')){
                if(n == -1){
                    n=i
                }
                if(voices[i].name.includes('Zira')){
                    n=i
                }
            }
        }

        //n = 116;

        //console.log('voz mia',voices[n])
        //idres.innerHTML += 'voz mia: '+ n + ' ' + voices[n].name + ' '+ voices[n].lang + '<br>';
        
        synthesisUtterance.voice = voices[n];
        synthesisUtterance.lang = voices[n].lang // // Android Chrome required
        synthesisUtterance.voiceURI = voices[n].voiceURI // Who knows if required?

        synthesisUtterance.pitch = 1
        synthesisUtterance.volume = 1
        synthesisUtterance.rate = 1

        // Obtener el contenido del texto que se va a convertir en habla
        if (synthesisUtterance.text !== txt) {
            synthesisUtterance.text = txt
        }

        // Iniciar la conversión de texto a habla
        window.speechSynthesis.speak(synthesisUtterance);

    } else {
        // Si el navegador no admite la API de voz en la web, mostrar un mensaje de error
        console.error('El navegador no admite la API de voz en la web');
    }

    return false;
}

//habla(' ')

let timeout = 0
const maxTimeout = 2000
const interval = 250
let voices = []

const loadVoices = (cb) => {
    voices = speechSynthesis.getVoices()

    if (voices.length > 0) {
        return cb(undefined, voices)
    }

    if (timeout >= maxTimeout) {
        return cb(new Error('loadVoices max timeout exceeded'))
    }

    timeout += interval
    setTimeout(() => loadVoices(cb), interval)
}

loadVoices((err, voices) => {
    if (err) return console.error(err)
    //console.log(voices[0]) // voices loaded and available
    //idres.innerHTML += voices[0].name + '<br>'
})

///////////////////////////////// auxiliares

function ran(inferior, superior, paso = 1) {
    let numPosibilidades = superior - inferior
    let aleat = Math.random() * numPosibilidades
    aleat = Math.round(aleat)
    return (parseInt(inferior) + aleat) * paso
}