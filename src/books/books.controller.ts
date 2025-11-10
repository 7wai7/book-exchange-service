import { Request, Response } from "express";
import { booksService } from "./books.service";

class BooksController {
    async create(req: Request, res: Response) {
        const files = req.files as Record<string, Express.Multer.File[]>;
        await booksService.create(2, req.body, files); // TODO: add quard
        res.end();
    }

    async findOne(req: Request, res: Response) {
        const id = req.query.id as string;
        const name = req.query.name as string;
        const book = await booksService.findOne({ id: +id, name });
        res.json(book);
    }

    async myBooks(req: Request, res: Response) {
        const books = await booksService.findMany({
            author_id: 2  // req.user.id
        });
        res.json(books);
    }

    async findMany(req: Request, res: Response) {
        const author_id = req.query.author_id as string;
        const author_name = req.query.author_id as string;
        const book_name = req.query.author_id as string;

        const books = await booksService.findMany({
            author_id: +author_id,
            authorName: author_name,
            bookName: book_name
        });
        res.json(books);
    }

    async delete(req: Request, res: Response) {
        if (!req.params.id) throw Error("Id is required");
        await booksService.delete(2, +req.params.id); // req.user.id
        res.end();
    }
}

export const booksController = new BooksController();