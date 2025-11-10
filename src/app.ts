import express from "express";
import { Request, Response } from 'express';
import dotenv from "dotenv";
import authRouter from "./auth/auth.router";
import { connectDB } from "./database/db";
import booksRouter from "./books/books.router";
dotenv.config();

const app = express();
const port = process.env.PORT ?? 3000;



app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/books", booksRouter);

app.use((err: any, req: Request, res: Response, next: any) => {
    if(process.env.NODE_ENV === 'development') console.error(err);
    res.status(err.status || 500).json({ message: err.message });
});

async function start() {
    try {
        await connectDB();

        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    } catch (err) {
        console.error('Failed to start app', err);
    }
}

start();