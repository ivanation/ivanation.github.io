import requests
import gradio as gr
import os
import fitz  # PyMuPDF
from dotenv import load_dotenv

# Cargar variables de entorno desde la carpeta superior
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

# Configuración de la API
API_KEY = os.getenv("GOOGLE_API_KEY")
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={API_KEY}"

def extraer_y_limpiar_pdf(pdf_file):
    '''
    Extrae texto de un PDF y usa Gemini para limpiarlo y estructurarlo
    '''
    if pdf_file is None:
        return "Por favor, sube un archivo PDF."
    
    try:
        # Extraer texto del PDF
        doc = fitz.open(pdf_file.name)
        text = ""
        for page in doc:
            text += page.get_text()
        doc.close()

        if not text.strip():
            return "No se pudo extraer texto del PDF. ¿Es un PDF escaneado (imagen)?"

        # Limitar el texto a enviar a la API (por límites de tokens o longitud de prompt)
        # Gemini Flash tiene una ventana grande, pero por seguridad truncamos si es excesivo
        max_chars = 15000 
        text_to_process = text[:max_chars]

        if not API_KEY:
            return f"--- TEXTO EXTRAÍDO (Sin limpieza por falta de API_KEY) ---\n\n{text}"

        prompt = (
            "He extraído el siguiente texto de un PDF. Por favor, límpialo de errores de extracción "
            "(como saltos de línea extraños, números de página, encabezados repetidos) y preséntalo "
            "de forma estructurada y legible, manteniendo la información esencial.\n\n"
            f"Texto extraído:\n{text_to_process}"
        )

        payload = {
            "contents": [{"parts": [{"text": prompt}]}]
        }

        headers = {"Content-Type": "application/json"}

        response = requests.post(API_URL, json=payload, headers=headers)
        response.raise_for_status()
        data = response.json()
        
        limpio = data['candidates'][0]['content']['parts'][0]['text']
        
        if len(text) > max_chars:
            limpio += "\n\n*(Nota: El texto original era muy largo y solo se procesó la primera parte)*"
            
        return limpio

    except Exception as e:
        return f"Error procesando el PDF: {str(e)}"

# Interfaz de Gradio
interface = gr.Interface(
    fn=extraer_y_limpiar_pdf,
    inputs=gr.File(label="Subir Archivo PDF", file_types=[".pdf"]),
    outputs=gr.Markdown(label="Texto Extraído y Estructurado"),
    title="📄 Extractor y Limpiador de PDF con IA",
    description="Sube un PDF para extraer su texto y recibir una versión limpia y organizada por la IA.",
    theme="soft"
)

if __name__ == "__main__":
    interface.launch()
