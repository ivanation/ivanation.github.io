import requests
import gradio as gr
import os
from dotenv import load_dotenv

# Cargar variables de entorno desde la carpeta superior
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

# Configuración de la API
API_KEY = os.getenv("GOOGLE_API_KEY")
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={API_KEY}"

def resumir_investigacion(text):
    '''
    Usa la API de Google Gemini para resumir artículos científicos
    '''
    if not text.strip():
        return "Por favor, introduce el texto del artículo de investigación."
    
    if not API_KEY:
        return "Error: No se encontró la API_KEY en el archivo .env"

    prompt = (
        "Eres un asistente de investigación de IA. Resume el siguiente artículo científico de manera estructurada:\n"
        "- **Objetivo/Hipótesis**: ¿Qué intenta demostrar el estudio?\n"
        "- **Metodología**: ¿Cómo se llevó a cabo la investigación?\n"
        "- **Resultados Clave**: ¿Cuáles fueron los hallazgos más importantes?\n"
        "- **Conclusiones y Aplicaciones**: ¿Qué significan estos resultados y cómo pueden aplicarse?\n"
        "- **Limitaciones**: ¿Qué debilidades menciona el autor o identificas tú?\n\n"
        f"Contenido del artículo:\n{text}"
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
    fn=resumir_investigacion,
    inputs=gr.Textbox(lines=20, placeholder="Pega el texto del paper aquí...", label="Artículo de Investigación"),
    outputs=gr.Markdown(label="Resumen Estructurado"),
    title="🎓 Resumidor de Artículos de Investigación (AI Research)",
    description="Acelera tu flujo de trabajo de lectura con resúmenes estructurados de alta calidad.",
    theme="base"
)

if __name__ == "__main__":
    interface.launch()
