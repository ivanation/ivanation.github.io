import requests
import gradio as gr
import os
from dotenv import load_dotenv

# Cargar variables de entorno desde la carpeta superior
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

# Configuración de la API
API_KEY = os.getenv("GOOGLE_API_KEY")
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={API_KEY}"

def resumir_texto(text):
    '''
    Usa la API de Google Gemini vía REST (requests) para resumir el texto
    '''
    if not text.strip():
        return "Por favor, introduce algún texto para resumir."
    
    if not API_KEY:
        return "Error: No se encontró la API_KEY en el archivo .env"

    # Payload según la estructura del curl proporcionado
    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": f"Por favor resume el siguiente texto de manera concisa:\n\n{text}"
                    }
                ]
            }
        ]
    }

    headers = {
        "Content-Type": "application/json"
    }

    try:
        # Realizamos la petición POST
        response = requests.post(API_URL, json=payload, headers=headers)
        response.raise_for_status() # Lanza excepción si hay error HTTP
        
        data = response.json()
        
        # Extraemos el texto de la respuesta (siguiendo la estructura de Gemini API)
        # data['candidates'][0]['content']['parts'][0]['text']
        resumen = data['candidates'][0]['content']['parts'][0]['text']
        return resumen
        
    except Exception as e:
        return f"Error en la petición: {str(e)}"

# Interfaz de Gradio
interface = gr.Interface(
    fn=resumir_texto,
    inputs=gr.Textbox(lines=10, placeholder="Pega aquí tu texto...", label="Texto original"),
    outputs=gr.Textbox(lines=5, label="Resumen"),
    title="🚀 Resumidor de texto con IA (REST API)",
    description="Resumidor usando Gemini 1.5 Flash mediante peticiones HTTP directas.",
    theme="soft"
)

if __name__ == "__main__":
    interface.launch()