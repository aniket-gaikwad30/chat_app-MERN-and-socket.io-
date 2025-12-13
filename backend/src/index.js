// console.log("Starting backend server...");

import express from 'express';
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import{app,server} from './lib/socket.js';
dotenv.config();
import {connectDb} from './lib/db.js';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import path from 'path';

const port = process.env.PORT || 5001;
const __dirname = path.resolve();



// FIX: Increase body size limit for JSON and URL Encoded data
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));


app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes)

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));  
    app.get('*', (req, res) => {

        res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'));
    }
    );
}


server.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
 connectDb();
});

