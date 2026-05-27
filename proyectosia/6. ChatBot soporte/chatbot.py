import requests
import gradio as gr
import os
from dotenv import load_dotenv

# Cargar variables de entorno desde la carpeta superior
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

# Configuración de la API
API_KEY = os.getenv("GOOGLE_API_KEY")
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={API_KEY}"

def chatbot_soporte(mensaje, historial):
    '''
    ChatBot de soporte al cliente usando Gemini
    '''
    if not API_KEY:
        return "Error: No se encontró la API_KEY."

    # Construimos el contexto del sistema para el chatbot con algunas FAQs de ejemplo
    faq_data = """
    Preguntas Frecuentes (FAQs):
    1. Horarios: Lunes a Viernes de 9:00 a 18:00.
    2. Envíos: Tardamos de 2 a 5 días hábiles.
    3. Devoluciones: Tienes 30 días naturales para cambios o devoluciones.
    4. Contacto humano: Puedes pedir hablar con un agente y te derivaremos.
    """
    
    contexto = f"Eres un asistente de soporte al cliente amable y eficiente. Aquí tienes información de nuestra empresa:\n{faq_data}\nResponde siempre basándote en esta información si es relevante."
    
    # Formateamos el historial para Gemini
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

# Interfaz de Chat de Gradio con ejemplos de preguntas
interface = gr.ChatInterface(
    fn=chatbot_soporte,
    title="🎧 ChatBot de Soporte al Cliente",
    description="Asistente virtual de atención al cliente. Prueba con las preguntas frecuentes de abajo.",
    examples=[
        "¿Cuáles son vuestros horarios?",
        "¿Cuánto tardan los envíos?",
        "¿Cómo puedo devolver un producto?",
        "Quiero hablar con un agente humano"
    ]
)

if __name__ == "__main__":
    interface.launch()
