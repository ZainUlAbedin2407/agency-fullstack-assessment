# CampaignHQ - Agency Fullstack Assessment

## 🚀 Overview
A comprehensive full-stack campaign management dashboard designed for modern advertising agencies. This application features a premium React UI, a robust Node.js/Express server with PostgreSQL integration, an isolated AI content generation microservice, and a real-time notification engine.

## 🏗️ Architecture
This project is structured as a mono-repo containing three distinct layers:

1.  **Frontend (`/client`)**: React 18 / Vite / Tailwind CSS. Implements a **Hybrid Data Strategy**: optimized for local JSON performance (Task 1.1) with a pre-configured bridge for the live Campaign API (Task 2.1).
2.  **Backend Server (`/server`)**: Node.js REST API utilizing **PostgreSQL** for persistent storage, JWT for secure authentication, and **Socket.io** for real-time dashboard events (Task 2.3).
3.  **AI Microservice (`/ai-service`)**: Independent Node.js service (Task 2.2) connecting to Llama-3 via **Groq SDK** for high-speed creative brief generation, completely decoupled and Docker-ready.

---

## 🛠️ Quick Start (Docker Orchestration)
The easiest way to run the entire backend stack seamlessly is utilizing the provided `docker-compose.yml`.

1.  Clone the repository and navigate to the project root.
2.  **Setup Env**: Create `.env` files in both `/server` and `/ai-service` using the provided `.env.example` templates.
3.  **Run Orchestration**:
    ```bash
    docker-compose up --build
    ```
4.  In a separate terminal window, start the React client:
    ```bash
    cd client
    npm install
    npm run dev
    ```

---

## 💻 Manual Setup
If you prefer to boot the architecture manually without Docker:

### 1. Database Configuration
* Ensure a PostgreSQL instance is running.
* Execute the queries in `/server/schema.sql` to initialize the campaign tables.

### 2. Start the API Server (Port 5000)
```bash
cd server
npm install
# Ensure DATABASE_URL and JWT_SECRET are in your .env
node server.js
```

### 3. Start the AI Microservice (Port 5001)
```bash
cd ai-service
npm install
# Ensure GROQ_API_KEY is in your .env
node index.js
```

### 4. Start the Frontend Application (Port 5173)
```bash
cd client
npm install
npm run dev
```

---

## ✨ Features Executed
* **State-Driven Dashboards:** Custom KPIs and interactive date range filtering (7d, 30d, 90d, Custom Range) natively hooked to aggregated memory computations.
* **Dual-Data Compliance:** Successfully fulfills **Task 1.1** (Static JSON) while maintaining a production-ready **PostgreSQL CRUD API** (Task 2.1) in the backend.
* **Microservice Migration:** AI Brief generation logic abstracted securely to Port `5001` with dedicated Docker support for scalability (Task 2.2).
* **Real-time Synchronization:** WebSocket rules engine firing simulated payload events for live metrics updates (Task 2.3).
* **PDF Artifact Pipeline:** Dynamic HTML-to-Canvas ingestion bridging into `jsPDF` for local creative brief downloads (Task 1.2).

---

## 🔑 Environment Variables (.env)
Make sure to configure the following in your respective `.env` files:

**Server:** `PORT=5000`, `DATABASE_URL=your_postgres_url`, `JWT_SECRET=your_secret`

**AI-Service:** `PORT=5001`, `GROQ_API_KEY=your_groq_key`
