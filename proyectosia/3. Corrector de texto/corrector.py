import requests
import gradio as gr
import os
from dotenv import load_dotenv

# Cargar variables de entorno desde la carpeta superior
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

# Configuración de la API
API_KEY = os.getenv("GOOGLE_API_KEY")
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={API_KEY}"

def corregir_texto(text):
    '''
    Usa la API de Google Gemini para corregir gramática y ortografía
    '''
    if not text.strip():
        return "Por favor, introduce el texto que deseas corregir."
    
    if not API_KEY:
        return "Error: No se encontró la API_KEY en el archivo .env"

    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": f"Actúa como un editor experto. Por favor, corrige la gramática y ortografía del siguiente texto, manteniendo su estilo original pero haciéndolo impecable. Si el texto ya es correcto, devuélvelo tal cual:\n\n{text}"
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
        return f"Error en la corrección: {str(e)}"

# Interfaz de Gradio
interface = gr.Interface(
    fn=corregir_texto,
    inputs=gr.Textbox(lines=10, placeholder="Escribe o pega aquí tu texto con errores...", label="Texto original"),
    outputs=gr.Textbox(lines=10, label="Texto Corregido"),
    title="✍️ Corrector Gramatical y Ortográfico",
    description="Mejora tu escritura instantáneamente usando Inteligencia Artificial.",
    theme="soft"
)

if __name__ == "__main__":
    interface.launch()
