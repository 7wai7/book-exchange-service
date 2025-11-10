import { Request, Response } from "express";
import { booksSevice } from "./books.service";

class BooksController {
    async create(req: Request, res: Response) {
        const files = req.files as Record<string, Express.Multer.File[]>;
        await booksSevice.create(2, req.body, files); // TODO: add quard
        res.end();
    }
}

export const booksController = new BooksController();