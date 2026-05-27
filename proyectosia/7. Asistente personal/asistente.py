import requests
import gradio as gr
import os
from dotenv import load_dotenv

# Cargar variables de entorno desde la carpeta superior
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

# Configuración de la API
API_KEY = os.getenv("GOOGLE_API_KEY")
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={API_KEY}"

def asistente_personal(mensaje, historial):
    '''
    Asistente personal inteligente
    '''
    if not API_KEY:
        return "Error: No se encontró la API_KEY."

    contexto = "Eres un asistente personal altamente organizado y servicial. Ayudas con tareas, planificación, redacción y consejos generales."
    instruccion = f"{contexto}\n\nUsuario: {mensaje}\nAsistente:"

    payload = {
        "contents": [{"parts": [{"text": instruccion}]}]
    }

    try:
        response = requests.post(API_URL, json=payload, headers={"Content-Type": "application/json"})
        response.raise_for_status()
        data = response.json()
        return data['candidates'][0]['content']['parts'][0]['text']
    except Exception as e:
        return f"Error: {str(e)}"

interface = gr.ChatInterface(
    fn=asistente_personal,
    title="🤖 Asistente Personal IA",
    description="Tu compañero inteligente para organizar tu día y resolver dudas rápidamente."
)

if __name__ == "__main__":
    interface.launch()
