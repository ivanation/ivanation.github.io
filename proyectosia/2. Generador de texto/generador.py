import requests
import gradio as gr
import os
from dotenv import load_dotenv

# Cargar variables de entorno desde la carpeta superior
# (El archivo .env está en "proyectos de IA/", un nivel arriba)
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

# Configuración de la API
API_KEY = os.getenv("GOOGLE_API_KEY")
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={API_KEY}"

def generar_texto(tema):
    '''
    Usa la API de Google Gemini vía REST para generar un texto de 100 palabras
    '''
    if not tema.strip():
        return "Por favor, introduce un tema o idea para generar el texto."
    
    if not API_KEY:
        return "Error: No se encontró la API_KEY en el archivo .env"

    # Payload con el prompt específico de 100 palabras
    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": f"Escribe un texto creativo y profesional sobre el siguiente tema: '{tema}'. IMPORTANTE: La respuesta debe tener aproximadamente 100 palabras."
                    }
                ]
            }
        ]
    }

    headers = {
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(API_URL, json=payload, headers=headers)
        response.raise_for_status()
        
        data = response.json()
        texto_generado = data['candidates'][0]['content']['parts'][0]['text']
        return texto_generado
        
    except Exception as e:
        return f"Error en la generación: {str(e)}"

# Interfaz de Gradio
interface = gr.Interface(
    fn=generar_texto,
    inputs=gr.Textbox(lines=2, placeholder="Escribe un tema (ej: El futuro de la IA en la medicina)...", label="Tema o Idea"),
    outputs=gr.Textbox(lines=10, label="Texto Generado"),
    title="✍️ Generador de Texto Creativo",
    description="Introduce un tema y la IA generará un texto de unas 100 palabras para ti.",
    theme="soft"
)

if __name__ == "__main__":
    interface.launch()
