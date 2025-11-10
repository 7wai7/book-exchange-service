import express from "express";
import { Request, Response } from 'express';
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT ?? 3000;



app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("The server is working");
})

app.use((err: any, req: Request, res: Response, next: any) => {
    console.error(err.message);
    res.status(err.status || 500).json({ message: err.message });
});

function start() {
    try {
        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    } catch (err) {
        console.error('Failed to start app', err);
    }
}

start();