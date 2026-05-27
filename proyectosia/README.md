# 🚀 Portfolio de Inteligencia Artificial (AI Tools)

Este repositorio contiene una colección de herramientas impulsadas por Inteligencia Artificial, diseñadas para resolver tareas cotidianas de procesamiento de lenguaje natural, análisis de datos y automatización. Cada proyecto utiliza **Gradio** para ofrecer una interfaz web intuitiva y moderna.

## 🛠️ Herramientas Incluidas

1.  **Resumidor de Texto**: Condensa textos largos en ideas clave de forma rápida.
2.  **Analizador de Reportes Financieros**: Extrae KPIs, riesgos y tendencias de documentos económicos.
3.  **Filtro de Solicitudes de Empleo**: Compara CVs contra descripciones de puesto con análisis de brechas.
4.  **Resumidor de Artículos de Investigación**: Estructura papers científicos (Metodología, Resultados, Conclusiones).
5.  **Analizador de Feedback de Clientes**: Clasifica sentimientos y detecta problemas recurrentes en reseñas.
6.  **Extractor de Textos de PDF**: Digitaliza y limpia texto de archivos PDF usando IA.
*...y muchos más (NER, ChatBots, Asistentes Legales/Médicos).*

---

## ⚙️ Configuración del Entorno

Para que las aplicaciones funcionen, necesitas configurar tu clave de API de Google Gemini.

### 1. Obtener una API Key
1. Ve a [Google AI Studio](https://aistudio.google.com/).
2. Crea una nueva API Key gratuita para Gemini Flash.

### 2. Crear el archivo `.env`
En la carpeta raíz de este repositorio (`proyectos de IA`), crea un archivo llamado `.env` y añade tu clave:

```env
GOOGLE_API_KEY=tu_clave_aqui_sin_comillas
```

### 3. Instalar Dependencias
Asegúrate de tener Python instalado y ejecuta:

```bash
pip install gradio requests python-dotenv pymupdf
```

---

## 🔒 Privacidad y Control Local con Ollama

Aunque estos proyectos están configurados por defecto para usar la API de Google Gemini (Cloud), pueden adaptarse fácilmente para ejecutarse de forma **100% local** utilizando **Ollama**.

### Ventajas de usar Ollama:
- **Privacidad Total**: Tus datos no salen de tu máquina.
- **Sin Costes de API**: Uso ilimitado de modelos como Llama 3 o Mistral.
- **Control**: Ideal para procesar información sensible (reportes financieros o CVs privados).

### Cómo adaptarlo:
Solo necesitas cambiar la `API_URL` en los scripts de Python por el endpoint local de Ollama (normalmente `http://localhost:11434/api/generate`) y ajustar el formato del payload.

---

## 🚀 Cómo ejecutar
Simplemente navega a la carpeta del proyecto que desees y ejecuta el archivo Python:

```bash
python "11. Analizador de reportes financieros/analizador_financiero.py"
```
La terminal te proporcionará una URL local (ej. `http://127.0.0.1:7860`) para abrir en tu navegador.

---
*Desarrollado con ❤️ para demostrar el poder de la IA Generativa en aplicaciones prácticas.*
