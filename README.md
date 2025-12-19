# 🏥 Hospital Management System – Frontend (UI)

A modern and responsive **Hospital Management System Frontend** built using **React, TypeScript, and Tailwind CSS**.  
This UI consumes APIs from a **Spring Boot Microservices backend** via an API Gateway.

🔗 **Backend Repository:**  
https://github.com/tabrez-tech-09/Hospital-Management

---

## ✨ Features

- 📅 Appointment Booking & Management
- 👤 User & Profile Management
- 🧾 Prescription & Reports View
- 🔽 Dynamic Dropdown Components
- 📱 Fully Responsive UI
- ⚡ Fast & Optimized React App
- 🔗 API Integration via Gateway

---

## 🧩 Project Structure

Hospital-Management-UI
│
├── public/
├── src/
│ ├── components/ # Reusable UI components
│ ├── pages/ # Page-level components
│ ├── services/ # API calls & services
│ ├── utils/ # Helper functions
│ ├── App.tsx
│ └── main.tsx
│
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md

yaml
Copy code

---

## 🛠 Tech Stack

- **Frontend:** React
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Build Tool:** Vite
- **API Communication:** REST APIs
- **Version Control:** Git & GitHub

---

## ⚙️ Setup & Run Locally

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/tabrez-tech-09/Hospital-Management-UI.git
cd Hospital-Management-UI
2️⃣ Install Dependencies
bash
Copy code
npm install
3️⃣ Start Development Server
bash
Copy code
npm run dev
App will run on:

arduino
Copy code
http://localhost:5173
🔗 Backend Integration
Make sure backend services are running:

Eureka Server

API Gateway

UserMS

ProfileMS

Appointment Service

Update API base URL inside services/api.ts (or similar file):

ts
Copy code
export const BASE_URL = "http://localhost:8080";
🧪 Screens & Components
Appointment Page

Dropdown Components

User Profile UI

Responsive Forms

(All components are reusable & modular)

🚀 Future Improvements
🔐 JWT Authentication Integration

🎨 Better UI/UX Animations

📊 Admin Dashboard

🌍 Production Deployment (Vercel / Netlify)

🧪 Unit & Integration Testing

👨‍💻 Author
Tabrez
Java Full Stack Developer
📌 React | Spring Boot | Microservices | DSA
📌 Targeting Product-Based Companies
