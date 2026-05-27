import requests
import gradio as gr
import os
from dotenv import load_dotenv

# Cargar variables de entorno desde la carpeta superior
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

# Configuración de la API
API_KEY = os.getenv("GOOGLE_API_KEY")
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={API_KEY}"

# Base de datos de productos (Mock Data)
PRODUCTOS = [
    {"nombre": "Sony WH-1000XM5", "categoria": "Headphones", "precio": 350, "specs": "Noise Cancellation, 30h battery"},
    {"nombre": "MacBook Air M2", "categoria": "Laptop", "precio": 1100, "specs": "8GB RAM, 256GB SSD, Liquid Retina"},
    {"nombre": "iPhone 15 Pro", "categoria": "Phone", "precio": 1000, "specs": "A17 Pro chip, Titanium, 48MP camera"},
    {"nombre": "Samsung Galaxy S24 Ultra", "categoria": "Phone", "precio": 1200, "specs": "S Pen, 200MP camera, 5000mAh"},
    {"nombre": "Logitech MX Master 3S", "categoria": "Mouse", "precio": 99, "specs": "Silent clicks, 8K DPI"},
    {"nombre": "iPad Pro M2", "categoria": "Tablet", "precio": 800, "specs": "11-inch, ProMotion, Face ID"},
    {"nombre": "Nintendo Switch OLED", "categoria": "Console", "precio": 350, "specs": "7-inch OLED, 64GB"},
    {"nombre": "GoPro HERO12", "categoria": "Camera", "precio": 400, "specs": "5.3K video, Waterproof"},
    {"nombre": "Dell XPS 13", "categoria": "Laptop", "precio": 950, "specs": "i7-1250U, 16GB RAM, FHD+"},
    {"nombre": "Apple Watch Series 9", "categoria": "Smartwatch", "precio": 400, "specs": "ECG, Blood Oxygen, S9 chip"}
]

def recomendar_productos(necesidad):
    '''
    Recomendador de productos para E-commerce basado en una lista interna
    '''
    if not necesidad.strip():
        return "Por favor, cuéntanos qué estás buscando."
    
    if not API_KEY:
        return "Error: No se encontró la API_KEY."

    # Convertimos la lista de productos a una cadena de texto para el prompt
    lista_str = "\n".join([f"- {p['nombre']} ({p['categoria']}): ${p['precio']}. Specs: {p['specs']}" for p in PRODUCTOS])

    # Prompt instruyendo a Gemini a usar los datos y ordenar si es necesario
    prompt = f"""
    Eres un asistente de ventas experto para una tienda de electrónica. 
    Aquí tienes nuestro catálogo actual:
    {lista_str}
    
    Consulta del cliente: "{necesidad}"
    
    Instrucciones:
    1. Busca en el catálogo los productos que mejor se ajusten a la consulta.
    2. Si el cliente pregunta por una categoría (ej: 'teléfonos'), muestra los productos de esa categoría ordenados por precio (de mayor a menor por defecto, a menos que pidan lo más barato).
    3. Si no tenemos exactamente lo que busca, sugiere lo más parecido de nuestro catálogo.
    4. Responde de forma amable y profesional.
    """

    payload = {
        "contents": [{"parts": [{"text": prompt}]}]
    }

    try:
        response = requests.post(API_URL, json=payload, headers={"Content-Type": "application/json"})
        response.raise_for_status()
        data = response.json()
        return data['candidates'][0]['content']['parts'][0]['text']
    except Exception as e:
        return f"Error: {str(e)}"

# Interfaz de Gradio
interface = gr.Interface(
    fn=recomendar_productos,
    inputs=gr.Textbox(lines=3, placeholder="Ej: ¿Cuáles son los mejores teléfonos? o ¿Qué portátiles tenéis?", label="Tu consulta"),
    outputs=gr.Textbox(lines=15, label="Recomendaciones del Catálogo"),
    title="🛍️ Recomendador de Electrónica Inteligente",
    description="Consulta nuestro catálogo de productos electrónicos y recibe recomendaciones personalizadas.",
    theme="soft"
)

if __name__ == "__main__":
    interface.launch()
