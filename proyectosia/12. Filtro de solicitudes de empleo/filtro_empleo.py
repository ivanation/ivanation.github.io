import requests
import gradio as gr
import os
from dotenv import load_dotenv

# Cargar variables de entorno desde la carpeta superior
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

# Configuración de la API
API_KEY = os.getenv("GOOGLE_API_KEY")
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={API_KEY}"

def filtrar_solicitud(job_desc, resume_text):
    '''
    Compara un CV con una descripción de puesto usando Gemini
    '''
    if not job_desc.strip() or not resume_text.strip():
        return "Por favor, proporciona tanto la descripción del puesto como el CV."
    
    if not API_KEY:
        return "Error: No se encontró la API_KEY en el archivo .env"

    prompt = (
        "Actúa como un reclutador experto. Compara la siguiente descripción de puesto con el CV del candidato.\n"
        "Proporciona:\n"
        "1. Porcentaje de coincidencia (0-100%).\n"
        "2. Fortalezas: Puntos donde el candidato encaja perfectamente.\n"
        "3. Debilidades/Brechas: Habilidades o experiencia que faltan.\n"
        "4. Veredicto: ¿Debería pasar a la entrevista? (Sí/No/Quizás y por qué).\n\n"
        f"--- DESCRIPCIÓN DEL PUESTO ---\n{job_desc}\n\n"
        f"--- CV DEL CANDIDATO ---\n{resume_text}"
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
    fn=filtrar_solicitud,
    inputs=[
        gr.Textbox(lines=10, placeholder="Pega la descripción del puesto aquí...", label="Descripción del Puesto"),
        gr.Textbox(lines=15, placeholder="Pega el CV del candidato aquí...", label="CV del Candidato")
    ],
    outputs=gr.Markdown(label="Evaluación del Candidato"),
    title="🔍 Filtro Inteligente de Solicitudes de Empleo",
    description="Analiza instantáneamente la compatibilidad entre un candidato y una vacante.",
    theme="soft"
)

if __name__ == "__main__":
    interface.launch()
