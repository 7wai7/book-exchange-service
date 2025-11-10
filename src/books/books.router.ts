import { Router } from "express";
import { validationMiddleware } from "../middlewares/validation.middleware";
import { CreateBookDto } from "./dto/create-book.dto";
import { storageService } from "../storage/storage.service";
import { booksController } from "./books.controller";
import authGuard from "../auth/auth.guard";

const booksRouter = Router();

booksRouter.post("/",
    // authGuard(true), // TODO:
    storageService.upload.fields([{ name: "cover" }, { name: 'book' }]),
    validationMiddleware(CreateBookDto),
    booksController.create
)

export default booksRouter;