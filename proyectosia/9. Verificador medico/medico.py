import requests
import gradio as gr
import os
from dotenv import load_dotenv

# Cargar variables de entorno desde la carpeta superior
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

# Configuración de la API
API_KEY = os.getenv("GOOGLE_API_KEY")
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={API_KEY}"

def verificar_sintomas(sintomas):
    '''
    Verificador de síntomas médicos (Informativo)
    '''
    if not sintomas.strip():
        return "Por favor, describe los síntomas que experimentas."
    
    if not API_KEY:
        return "Error: No se encontró la API_KEY."

    disclaimer = "IMPORTANTE: Esta herramienta NO proporciona diagnósticos médicos. Es solo para fines informativos. Si tienes una emergencia o dudas sobre tu salud, consulta inmediatamente a un médico o acude a urgencias."
    
    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": f"Actúa como un asistente informativo de salud. Analiza los siguientes síntomas: '{sintomas}'. Explica posibles causas comunes de manera cautelosa y siempre recomienda la visita a un profesional médico. No des recetas ni tratamientos específicos. Menciona señales de alerta por las que se debería acudir a urgencias."
                    }
                ]
            }
        ]
    }

    try:
        response = requests.post(API_URL, json=payload, headers={"Content-Type": "application/json"})
        response.raise_for_status()
        data = response.json()
        respuesta = data['candidates'][0]['content']['parts'][0]['text']
        return f"{respuesta}\n\n---\n🚨 {disclaimer}"
    except Exception as e:
        return f"Error: {str(e)}"

interface = gr.Interface(
    fn=verificar_sintomas,
    inputs=gr.Textbox(lines=5, placeholder="Ej: Me duele la cabeza y tengo fiebre desde hace dos días...", label="Descripción de Síntomas"),
    outputs=gr.Textbox(lines=10, label="Información de Salud"),
    title="🏥 Verificador de Síntomas (Informativo)",
    description="Consulta información general sobre síntomas. ESTO NO ES UN DIAGNÓSTICO MÉDICO.",
    theme="soft"
)

if __name__ == "__main__":
    interface.launch()
