import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import 'dotenv/config'
import connectDB from "./configs/db.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import authRoutes from './routes/authRoutes.js';
import generateRoutes from './routes/generateRoutes.js';
import contactRoutes from './routes/contactRoutes.js';


declare module "express-session" {
    interface SessionData {
        iLoggedIn: boolean;
        userId?: string;
    }
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);

        const allowed = [
            'http://localhost:5173',
            'http://localhost:5000',
            process.env.FRONTEND_URL,               // exact Vercel production URL
        ].filter(Boolean);

        // Also allow any Vercel preview URL for this project
        const isVercelPreview = /^https:\/\/ai-thumbnail-generator.*\.vercel\.app$/.test(origin);

        if (allowed.includes(origin) || isVercelPreview) {
            callback(null, true);
        } else {
            callback(new Error(`CORS: origin ${origin} not allowed`));
        }
    },
    credentials: true
}))


const isProd = process.env.NODE_ENV === 'production';
console.log('NODE_ENV:', process.env.NODE_ENV);

// REQUIRED for Render/Heroku/Railway: trust the reverse proxy so secure cookies work
if (isProd) app.set('trust proxy', 1);

app.use(session({
    name: 'thumblify.sid',
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,  // 7 days
        sameSite: isProd ? 'none' : 'lax', // 'none' required for cross-origin (Vercel ↔ Render)
        secure: isProd,                    // HTTPS only in production
        httpOnly: true,
    },
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI as string,
        collectionName: "sessions",
    }),
}))


// Routes
app.get("/", (req, res) => {
  res.send("🚀 Server is running!");
});

app.use('/api/auth', authRoutes);
app.use('/api/generate', generateRoutes);
app.use('/api/contact', contactRoutes);


// Connect to DB then start server
await connectDB();
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});