# 🚀 AI Thumbnail Generator (Thumblify)

AI Thumbnail Generator is a full-stack web application that allows users to create high-quality thumbnails using AI. It provides a smooth user experience with a modern UI and powerful backend processing.

---

## 🌐 Live Demo

🚀 **Experience the application live:**  
👉 https://ai-thumbnail-generator-gamma.vercel.app/

---

## 📌 Features

- 🎨 AI-powered thumbnail generation  
- 🔐 User authentication (Login / Register)  
- 🖼️ Image processing and optimization  
- ⚡ Fast and responsive UI  
- 🌐 REST API integration  
- 💾 Database support (MongoDB)  
- 📩 Email functionality (Nodemailer)  

---

## 🏗️ Project Structure


thumblify/
│
├── frontend/reactjs/ # React Frontend (Vite + Tailwind)
│
├── server/ # Backend (Node.js + TypeScript)
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middlewares/
│ └── configs/
│
├── vercel.json # Frontend deployment config
├── render.yaml # Backend deployment config


---

## 🛠️ Tech Stack

### Frontend
- React  
- Vite  
- Tailwind CSS  
- React Router  

### Backend
- Node.js  
- Express  
- TypeScript  
- MongoDB (Mongoose)  
- Sharp  
- Nodemailer  
- Express Session  

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/prashantmalagi/ai-thumbnail-generator
cd ai-thumbnail-generator

2️⃣ Setup Backend
cd server
npm install

Create .env file:

PORT=5000
MONGO_URI=your_mongodb_connection
SESSION_SECRET=your_secret
EMAIL_USER=your_email
EMAIL_PASS=your_password

Run backend:

npm run server

3️⃣ Setup Frontend
cd frontend/reactjs
npm install
npm run dev

🚀 How It Works
User logs in or registers
Enters input or request for thumbnail
Backend processes data using AI & image tools
Generated thumbnail is displayed instantly

📌 Scripts
Backend
npm run server
npm run build
npm start
Frontend
npm run dev
npm run build
npm run preview

🔐 Environment Variables
Make sure to configure:

MongoDB connection
Email credentials
Session secret
📈 Future Improvements
AI prompt customization
Download & share thumbnails
Cloud storage integration (AWS / Cloudinary)
User dashboard

👨‍💻 Author

Prashant Malagi
Aspiring Software Developer
