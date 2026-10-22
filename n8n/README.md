
# 🔗 n8n — Workflows del Sistema RAG

Esta carpeta contiene la configuración de **n8n** para ejecutar:

- Chunking de PDFs
- Generación de embeddings
- Upsert en Qdrant
- Query + Prompting + LLM
- Logging del pipeline

---

### 🚀 Workflows esperados

| Workflow | Ruta Webhook | Función |
|----------|--------------|---------|
| `rag_chat` | `/webhook/chat` | Responder consultas desde Flask |
| `ingest_pdf` | `/webhook/ingest` | Cargar y vectorizar documentos |

---

### 📌 Requisitos

| Herramienta | Requisito |
|-------------|----------|
| Node.js | >= 18 (si modo local) |
| Docker | Recomendado |
| Qdrant local |
| Groq | API Key |

---

### ▶ Ejecución con Docker
1. Levanta el stack de n8n (+ Qdrant):
   ```bash
   docker-compose up -d
   ```
2. Ollama corre en un stack separado (`docker-compose.ollama.yml` en la raíz).
   Asegurate de tenerlo corriendo y accesible antes de usar los workflows:
   ```bash
   # Desde la raíz del repo
   docker compose -f docker-compose.ollama.yml up -d
   ```
   En n8n, actualizá la credencial "Ollama account" para apuntar a la URL
   configurada en tu `.env` (ej: `http://host.docker.internal:11434`).

3. Por defecto se instala el modelo llama3.2:latest para inferencia y nomic-embed-text:latest para Embedding

## 🔌 Configuración de n8n
Entra a n8n en: http://localhost:5678

Importar Workflows:

Ve a la carpeta /workflows de este repo.

En n8n, crea un nuevo workflow y selecciona Import from File. Importa tanto el de Ingesta como el del Chatbot.

Credenciales:

Deberás configurar tus propias API Keys de Groq en el nodo correspondiente.

Para Qdrant, asegúrate de que la URL apunte a http://qdrant:6333.

📂 Cómo cargar documentos (Ingesta)
Abre el workflow de RAG Ingestion Process.

Ejecútalo y sube el PDF de la cátedra que quieras que el bot aprenda.

Verifica que los datos se hayan cargado en el dashboard de Qdrant: http://localhost:6333/dashboard.

Luego abrir: 
http://localhost:5678

### Estructura 
n8n/
│ docker-compose.yml
│ workflows/
│ credentials/