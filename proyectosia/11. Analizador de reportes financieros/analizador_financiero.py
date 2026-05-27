import requests
import gradio as gr
import os
from dotenv import load_dotenv

# Cargar variables de entorno desde la carpeta superior
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

# Configuración de la API
API_KEY = os.getenv("GOOGLE_API_KEY")
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={API_KEY}"

def analizar_reporte(text):
    '''
    Usa la API de Google Gemini para analizar reportes financieros
    '''
    if not text.strip():
        return "Por favor, introduce el texto del reporte financiero."
    
    if not API_KEY:
        return "Error: No se encontró la API_KEY en el archivo .env"

    prompt = (
        "Actúa como un analista financiero experto. Analiza el siguiente reporte y proporciona:\n"
        "1. Resumen ejecutivo (3-5 líneas).\n"
        "2. KPIs y métricas clave (ingresos, márgenes, etc.).\n"
        "3. Principales riesgos identificados.\n"
        "4. Oportunidades y perspectivas futuras.\n\n"
        f"Texto del reporte:\n{text}"
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
    fn=analizar_reporte,
    inputs=gr.Textbox(lines=15, placeholder="Pega aquí el reporte financiero...", label="Reporte Financiero"),
    outputs=gr.Markdown(label="Análisis Detallado"),
    title="📊 Analizador de Reportes Financieros con IA",
    description="Obtén insights clave, riesgos y oportunidades de cualquier reporte financiero en segundos.",
    theme="glass"
)

if __name__ == "__main__":
    interface.launch()
