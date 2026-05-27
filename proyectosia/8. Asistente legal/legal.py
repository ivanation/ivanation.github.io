import requests
import gradio as gr
import os
from dotenv import load_dotenv

# Cargar variables de entorno desde la carpeta superior
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

# Configuración de la API
API_KEY = os.getenv("GOOGLE_API_KEY")
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={API_KEY}"

def generar_documento_legal(tipo, sujeto1, sujeto2, duracion, salario):
    '''
    Genera plantillas de documentos legales personalizados usando Gemini
    '''
    if not sujeto1 or not sujeto2:
        return "Por favor, introduce al menos los nombres de ambas partes (Sujeto 1 y Sujeto 2)."
    
    if not API_KEY:
        return "Error: No se encontró la API_KEY."

    disclaimer = "AVISO LEGAL: Este documento es una plantilla generada por IA con fines informativos. No constituye asesoramiento legal profesional y debe ser revisado por un abogado antes de su firma."
    
    # Construcción del prompt detallado
    prompt = f"""
    Actúa como un abogado experto en redacción de contratos. 
    Genera un {tipo} profesional y detallado basado en la siguiente información:
    - Parte 1: {sujeto1}
    - Parte 2: {sujeto2}
    - Duración del contrato: {duracion if duracion else 'No aplica'} años
    - Salario/Compensación: {salario if salario else 'No aplica'} por año
    
    El documento debe tener una estructura formal con cláusulas, espacios para firmas y lenguaje legal apropiado.
    """

    payload = {
        "contents": [{"parts": [{"text": prompt}]}]
    }

    try:
        response = requests.post(API_URL, json=payload, headers={"Content-Type": "application/json"})
        response.raise_for_status()
        data = response.json()
        documento = data['candidates'][0]['content']['parts'][0]['text']
        return f"{documento}\n\n---\n⚠️ {disclaimer}"
    except Exception as e:
        return f"Error en la generación: {str(e)}"

# Interfaz de Gradio con múltiples entradas
with gr.Blocks(theme="soft") as interface:
    gr.Markdown("# ⚖️ Generador de Plantillas Legales")
    gr.Markdown("Rellena los datos para generar un borrador de contrato profesional.")
    
    with gr.Row():
        tipo_doc = gr.Dropdown(
            choices=["Contrato de Alquiler", "Contrato de Empleado", "Sociedad de Negocios", "Acuerdo de Confidencialidad (NDA)"],
            label="Tipo de Documento",
            value="Contrato de Alquiler"
        )
    
    with gr.Row():
        s1 = gr.Textbox(label="Sujeto 1 (Nombre/Empresa)", placeholder="Ej: Juan Pérez o Inmuebles S.A.")
        s2 = gr.Textbox(label="Sujeto 2 (Nombre/Empresa)", placeholder="Ej: María García o Cliente")
    
    with gr.Row():
        dur = gr.Number(label="Duración (años)", value=1, precision=0)
        sal = gr.Textbox(label="Salario/Monto Anual (opcional)", placeholder="Ej: 15,000€")
    
    btn = gr.Button("Generar Documento", variant="primary")
    output = gr.Textbox(label="Documento Generado", lines=20)
    
    btn.click(
        fn=generar_documento_legal,
        inputs=[tipo_doc, s1, s2, dur, sal],
        outputs=output
    )

if __name__ == "__main__":
    interface.launch()
