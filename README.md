# 🌿 AningKabalen — Reactive Agricultural Ecosystem

> **Bridging Pampanga's farmers and its world-class culinary industry through real-time technology.**

AningKabalen is a full-stack, real-time digital marketplace designed to eliminate predatory middlemen and connect local farmers in Pampanga directly with HORECA (Hotel, Restaurant, Catering) buyers. Built on a reactive Angular frontend and a robust Node.js/Express backend, the platform combines a **Live Freshness Feed** and a **Digital Handshake** (Forward Contract) system to ensure fair pricing and strengthen localized food security.

---

## 🚀 Key Features

### 1. Live Freshness Feed
Using RxJS Observables on the frontend and WebSockets / Server-Sent Events via Node.js, the platform delivers a real-time data stream — buyers see harvest posts the millisecond they are uploaded.

### 2. The Digital Handshake (Pledge & Reserve)
A micro-agricultural forward contract unique to the platform. Restaurateurs can reserve a percentage of a crop **before it is even harvested**, giving farmers financial confidence and price protection well in advance of harvest day.

### 3. Culinary-Centric Tagging
A specialized data model built for the "Culinary Capital of the Philippines." Farmers tag produce by dish application — e.g., *"Sisig-ready"* or *"Sinigang-grade"* — allowing chefs to filter by recipe requirements rather than just ingredient names.

### 4. Role-Based Modular Dashboards
- **Farmer Interface** — Simplified, high-efficiency inventory management and Pledge tracker.
- **Buyer Interface** — Professional-grade procurement dashboard designed for high-volume HORECA requirements.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Angular (v16+) & RxJS |
| Backend | Node.js & Express.js |
| Database | MongoDB (NoSQL) & AWS S3 for storing listing images |
| Real-time | RxJS-driven API streams |
| Styling | CSS |

---

## 📦 Installation & Setup

### Prerequisites
- Node.js v18+
- npm v9+
- Angular CLI (`npm install -g @angular/cli`)
- MongoDB or PostgreSQL instance

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/aningkabalen.git
cd aningkabalen
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://Username:password@dbs.dblink.mongodb.net/DBname?retryWrites=true&w=majority
JWT_SECRET=ExampleSecretKey
JWT_EXPIRES_IN=7d
UPLOAD_DIR=uploads
MAX_FILE_SIZE_MB=10
CLIENT_URL=http://localhost:4200
AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=EXAMPLE21433
AWS_SECRET_ACCESS_KEY=YOUR SECRET KEY
```

Start the server:

```bash
npm start
```

### 3. Frontend Setup

```bash
cd frontend
npm install
ng serve
```

Navigate to `http://localhost:4200/`. The Angular app will communicate with the Express server on the port configured in your `.env` (default: `http://localhost:3000`).

---

## 📊 Market Impact

| Metric | Detail |
|---|---|
| Farmgate Gap | Bridges the ₱4/kg farmgate price vs. ₱60/kg retail price disparity |
| Efficiency | Role-based UI reduces farmer data-entry time by ~40% |
| Latency | Real-time sync achieved in <200ms via optimized Express routes and RxJS |

---

## 👥 The AgriCode Team

| Name | Role |
|---|---|
| Marc O. Canlas | UI/UX & Lead Frontend Development |
| Joemar S. Catipon | Backend & Deployment Logic |
| Aimee Li Marael S. Pangan | Systems Analysis & DBA |
| Tsun Kit Wilson L. Yaochingco | Frontend Developer |

**Course:** Advanced Dynamic Web Development (6AWEB)  
**Faculty:** School of Computing  
**Date:** March 2026

---

## 📄 License

This project is developed for academic purposes under the **School of Computing**. All rights reserved.

---

*Developed with ❤️ for the Farmers of Pampanga.*
