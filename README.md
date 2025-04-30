# DocuAgent

DocuAgent is an AI-powered document analysis and risk detection platform that automates the review of legal, business, and policy documents. Users can upload files like PDFs or Word docs, and the system automatically summarizes content, extracts metadata, identifies legal/compliance risks, and alerts relevant teams in real-time via Microsoft Teams. It combines Azure OpenAI, FastAPI, NEXT JS to make document workflows faster, safer, and smarter.

## Features

- **Document Upload**: Securely upload documents in various formats (PDF, DOCX, TXT, CSV, Excel).
- **AI-Powered Analysis**:
  - Summarization of document content.
  - Metadata extraction (e.g., title, author, date).
  - Risk assessment for legal, ethical, or compliance issues.
- **Storage and Retrieval**:
  - Store documents in Azure Blob Storage.
  - Retrieve and download documents on demand.
- **Notifications**:
  - Notify teams via Microsoft Teams with document summaries and risk assessments.
- **Dashboard**:
  - View statistics on processed documents, risks, and processing times.
  - Access recent documents and risk reports.

## Project Structure

The project is divided into two main components:

1. **Backend** (`docuagent-backend`):
   - Built with FastAPI.
   - Handles document processing, storage, and notifications.
   - Integrates with Azure services and AI models.

2. **Frontend** (`docuagent-client`):
   - Built with Next.js.
   - Provides a user-friendly interface for uploading documents, viewing reports, and managing settings.

## Setup Instructions

### Prerequisites

- Python 3.10 or later
- Node.js 16 or later
- Docker (optional, for containerized deployment)
- Azure account (for Blob Storage and Cosmos DB)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd docuagent-backend
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   - Create a `.env` file in the `docuagent-backend` directory.
   - Add the following variables:
     ```env
     AZURE_BLOB_CONN=<your-azure-blob-connection-string>
     AZURE_COSMOS_URI=<your-azure-cosmos-uri>
     AZURE_COSMOS_KEY=<your-azure-cosmos-key>
     AZURE_OPENAI_API_KEY=<your-azure-openai-api-key>
     AZURE_OPENAI_API_VERSION=<api-version>
     AZURE_OPENAI_ENDPOINT=<endpoint>
     TEAMS_WEBHOOK_URL=<your-teams-webhook-url>
     ```

4. Run the backend server:
   ```bash
   uvicorn app:app --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd docuagent-client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env.local` file in the `docuagent-client` directory.
   - Add the following variable:
     ```env
     NEXT_PUBLIC_API_URL=http://localhost:8000
     ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open the application in your browser:
   - Navigate to [http://localhost:3000](http://localhost:3000).

## Deployment

### Backend Deployment

1. Build the Docker image:
   ```bash
   docker build -t docuagent-backend .
   ```

2. Run the container:
   ```bash
   docker run -p 8000:8000 --env-file .env docuagent-backend
   ```

### Frontend Deployment

1. Build the production version:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

3. Alternatively, deploy to a platform like Vercel for seamless hosting.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.