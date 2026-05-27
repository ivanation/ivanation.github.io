import requests
import gradio as gr
import os
from dotenv import load_dotenv

# Cargar variables de entorno desde la carpeta superior
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

# Configuración de la API
API_KEY = os.getenv("GOOGLE_API_KEY")
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={API_KEY}"

def extraer_entidades(text):
    '''
    Usa la API de Google Gemini para extraer Entidades Nombradas (NER)
    '''
    if not text.strip():
        return "Por favor, introduce un texto para analizar."
    
    if not API_KEY:
        return "Error: No se encontró la API_KEY en el archivo .env"

    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": f"Analiza el siguiente texto y extrae las entidades nombradas (Personas, Lugares, Organizaciones, Fechas, etc.). Presenta los resultados en una lista organizada por categorías:\n\n{text}"
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
        return f"Error en el análisis NER: {str(e)}"

# Interfaz de Gradio
interface = gr.Interface(
    fn=extraer_entidades,
    inputs=gr.Textbox(lines=10, placeholder="Pega una noticia o texto largo aquí...", label="Texto a analizar"),
    outputs=gr.Textbox(lines=15, label="Entidades Detectadas"),
    title="🔍 Extractor de Entidades (NER)",
    description="Identifica automáticamente nombres de personas, lugares, fechas y organizaciones en cualquier texto.",
    theme="soft"
)

if __name__ == "__main__":
    interface.launch()
