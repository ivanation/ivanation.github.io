import requests
import gradio as gr
import os
from dotenv import load_dotenv

# Cargar variables de entorno desde la carpeta superior
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

# Configuración de la API
API_KEY = os.getenv("GOOGLE_API_KEY")
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={API_KEY}"

def analizar_feedback(text):
    '''
    Usa la API de Google Gemini para analizar el feedback de clientes
    '''
    if not text.strip():
        return "Por favor, introduce el feedback de los clientes."
    
    if not API_KEY:
        return "Error: No se encontró la API_KEY en el archivo .env"

    prompt = (
        "Analiza el siguiente feedback de clientes y proporciona un informe detallado:\n"
        "1. **Análisis de Sentimiento**: Clasifica el sentimiento general (Muy Positivo, Positivo, Neutral, Negativo, Muy Negativo).\n"
        "2. **Temas Recurrentes**: ¿De qué hablan más los clientes?\n"
        "3. **Principales Quejas**: Identifica los problemas más críticos.\n"
        "4. **Sugerencias de Mejora**: Basado en el feedback, ¿qué debería cambiar la empresa?\n"
        "5. **Acciones Inmediatas Recomendadas**: 3 pasos rápidos a seguir.\n\n"
        f"Feedback del cliente:\n{text}"
    )

    payload = {
        "contents": [{"parts": [{"text": prompt}]}]
    }

    headers = {"Content-Type": "application/json"}

    try:
        response = requests.post(API_URL, json=payload, headers=headers)
        response.raise_for_status()
        data = response.json()
        return data['candidates'][0]['content']['parts'][0]['text']
    except Exception as e:
        return f"Error en la petición: {str(e)}"

# Interfaz de Gradio
interface = gr.Interface(
    fn=analizar_feedback,
    inputs=gr.Textbox(lines=15, placeholder="Pega aquí los comentarios o reseñas de los clientes...", label="Feedback de Clientes"),
    outputs=gr.Markdown(label="Análisis de Experiencia del Cliente"),
    title="💬 Analizador de Feedback de Clientes",
    description="Convierte comentarios sueltos en una estrategia clara de mejora del cliente.",
    theme="monochrome"
)

if __name__ == "__main__":
    interface.launch()
