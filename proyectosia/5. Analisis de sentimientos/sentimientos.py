import requests
import gradio as gr
import os
from dotenv import load_dotenv

# Cargar variables de entorno desde la carpeta superior
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

# Configuración de la API
API_KEY = os.getenv("GOOGLE_API_KEY")
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={API_KEY}"

def analizar_sentimiento(text):
    '''
    Usa la API de Google Gemini para realizar un análisis de sentimientos
    '''
    if not text.strip():
        return "Por favor, introduce un texto para analizar el sentimiento."
    
    if not API_KEY:
        return "Error: No se encontró la API_KEY en el archivo .env"

    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": f"Analiza el sentimiento del siguiente texto. Indica si es Positivo, Negativo o Neutral, y proporciona una breve explicación del tono detectado:\n\n{text}"
                    }
                ]
            }
        ]
    }

    headers = {"Content-Type": "application/json"}

    try:
        response = requests.post(API_URL, json=payload, headers=headers)
        response.raise_for_status()
        data = response.json()
        return data['candidates'][0]['content']['parts'][0]['text']
    except Exception as e:
        return f"Error en el análisis de sentimiento: {str(e)}"

# Interfaz de Gradio
interface = gr.Interface(
    fn=analizar_sentimiento,
    inputs=gr.Textbox(lines=5, placeholder="Pega un comentario o reseña aquí...", label="Texto a analizar"),
    outputs=gr.Textbox(lines=5, label="Resultado del Análisis"),
    title="😊 Análisis de Sentimientos",
    description="Descubre el tono emocional (positivo, negativo o neutral) de cualquier comentario o texto.",
    theme="soft"
)

if __name__ == "__main__":
    interface.launch()
