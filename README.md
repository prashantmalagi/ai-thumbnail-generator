🚀 Thumblify – AI Thumbnail Generator

Thumblify is a full-stack web application that allows users to generate high-quality thumbnails using AI. It provides a smooth UI and a powerful backend for image processing, authentication, and storage.

📌 Features
🎨 AI-based thumbnail generation
🔐 User authentication (Login/Register)
🖼️ Image processing using Sharp
⚡ Fast and modern UI with React + Vite
🌐 REST API built with Express & TypeScript
💾 MongoDB database integration
📩 Email support using Nodemailer
🧠 Session management

🏗️ Project Structure
thumblify/
│
├── frontend/reactjs/       # React Frontend (Vite + Tailwind)
│
├── server/                 # Backend (Node.js + TypeScript)
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   └── configs/
│
├── render.yaml             # Deployment config (Render)
├── vercel.json             # Deployment config (Vercel)

🛠️ Tech Stack

Frontend
React 19
Vite
Tailwind CSS
React Router

Backend
Node.js
Express
TypeScript
MongoDB (Mongoose)
Sharp (Image processing)
Nodemailer
Express Session

⚙️ Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/prashantmalagi/ai-thumbnail-generator
cd thumblify
2️⃣ Setup Backend
cd server
npm install

Create a .env file inside server/:

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

🚀 Deployment
Frontend → Vercel
Backend → Render

Configs already included:

vercel.json
render.yaml

How It Works
User logs in / registers
Enters prompt or uploads data
Backend processes image using AI + Sharp
Thumbnail is generated and displayed

📌 Scripts
Backend
npm run server   # start with nodemon
npm start        # production start
npm run build    # compile TypeScript
Frontend
npm run dev      # development
npm run build    # production build
npm run preview  # preview build

🔐 Environment Variables

Make sure to configure:

MongoDB connection
Email credentials
Session secret
📈 Future Improvements
Add AI prompt customization
Download/share thumbnails
Cloud storage (AWS / Cloudinary)
User dashboard

🌐 Live Demo

👉 https://ai-thumbnail-generator-gamma.vercel.app/

👨‍💻 Author

Prashanth Malagi
Aspiring Software Developer
