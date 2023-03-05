///////////////////////////// API VOICE //////////////////////////////

let voicesLoaded = false
let voices = []

const loadVoices = () => {
    return new Promise((resolve, reject) => {
        if (voicesLoaded) {
            resolve(voices)
            return
        }
        
        let timeout = 0
        const maxTimeout = 2000
        const interval = 250
        
        const checkVoices = () => {
            voices = speechSynthesis.getVoices()
            
            if (voices.length > 0) {
                voicesLoaded = true
                resolve(voices)
            }
            
            if (timeout >= maxTimeout) {
                reject(new Error('loadVoices max timeout exceeded'))
            }
            
            timeout += interval
            setTimeout(checkVoices, interval)
        }

        checkVoices()
    })
}

const speak = (text) => {

    loadVoices().then((voices) => {
        const voice = voices.find(v => v.lang.includes('US') && v.name.includes('Zira')) || voices.find(v => v.lang.includes('US'))
        const utterance = new SpeechSynthesisUtterance(text)
        if (utterance.text !== text) {
            utterance.text = text
        }
        utterance.voice = voice
        utterance.lang = voice.lang
        utterance.voiceURI = voice.voiceURI
        utterance.pitch = 1
        utterance.volume = 1
        utterance.rate = 1
        window.speechSynthesis.speak(utterance)
    }).catch((err) => {
        console.error(err)
    })

}

loadVoices()
speak("welcome")