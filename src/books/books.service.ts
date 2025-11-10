import sequelize from "../database/db";
import { File, FileField } from "../storage/file.model";
import { storageService } from "../storage/storage.service";
import { CreateBookDto } from "./dto/create-book.dto";
import { Book } from "./models/book.model";

class BooksService {
    async create(currentUserId: number, createBookDto: CreateBookDto, files: Record<string, Express.Multer.File[]>) {
        // зберегти файли в один масив
        const fileRecords = [];
        for (const fieldName of Object.keys(files)) {
            const fieldFiles = files[fieldName];
            if (!fieldFiles) continue;
            fileRecords.push(...fieldFiles);
        }

        const t = await sequelize.transaction();
        try {
            const book = await Book.create({ ...createBookDto, author_id: currentUserId }, { transaction: t });

            const bulkCreateFiles = [];
            for (const f of fileRecords) {
                bulkCreateFiles.push({
                    book_id: book.id,
                    user_id: currentUserId,
                    field: f.fieldname as FileField,
                    originalName: f.originalname,
                    filename: f.filename,
                    mime: f.mimetype,
                    size: f.size,
                    url: f.path
                })
            }

            await File.bulkCreate(bulkCreateFiles, { transaction: t });
            t.commit();
        } catch (error) {
            console.error(error);
            storageService.delete(fileRecords.map(r => r.path));
            t.rollback();
            throw Error(`Upload failed`)
        }
    }
}

export const booksSevice = new BooksService();