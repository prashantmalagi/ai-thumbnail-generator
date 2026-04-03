import express from "express";
import cors from "cors";
import 'dotenv/config'
import connectDB from "./configs/db.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import authRoutes from './routes/authRoutes.js';
import generateRoutes from './routes/generateRoutes.js';

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
    origin: ['http://localhost:5173','http://localhost:5000'],
    credentials: true
}))

app.use(session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 7},
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

// Connect to DB then start server
await connectDB();
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});