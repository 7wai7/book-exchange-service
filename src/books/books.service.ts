import { Op } from "sequelize";
import sequelize from "../database/db";
import { File, FileField } from "../storage/file.model";
import { storageService } from "../storage/storage.service";
import { CreateBookDto } from "./dto/create-book.dto";
import { Book } from "./models/book.model";
import { User } from "../user/models/user.model";

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
            await t.commit();
        } catch (error) {
            console.error(error);
            storageService.delete(fileRecords.map(r => r.path));
            await t.rollback();
            throw Error(`Upload failed`)
        }
    }

    async findOne({
        id,
        name
    }: {
        id?: number,
        name?: string
    }) {
        if (!id && !name) throw new Error("Either the book id or the book name is required")

        const where: any = {};
        if (id) where.id = id;
        if (name) where.name = { [Op.iLike]: `%${name}%` };

        return await Book.findOne({
            where,
            include: [
                {
                    model: File,
                    as: 'files'
                }
            ]
        })
    }

    async findMany({
        author_id,
        authorName,
        bookName
    }: {
        author_id?: number,
        authorName?: string,
        bookName?: string
    }) {
        if (!author_id && !authorName && !bookName) throw new Error("Either the author id, the author name or the book name is required")

        const where: any = {};
        if (author_id) where.author_id = author_id;
        if (bookName) where.name = { [Op.iLike]: `%${bookName}%` };

        return await Book.findAll({
            where,
            include: [
                {
                    model: File,
                    as: 'files'
                },
                {
                    model: User,
                    as: 'author',
                    required: !!authorName,
                    where: { username: { [Op.iLike]: `%${authorName}%` } },
                    attributes: ['id', 'username']
                }
            ],
            order: [['name', 'ASC']],
        });
    }

    async delete(currentUserId: number, book_id: number) {
        const t = await sequelize.transaction();
        try {
            const book = await Book.findOne({
                where: {
                    id: book_id,
                    author_id: currentUserId
                },
                include: [
                    {
                        model: File,
                        as: "files"
                    }
                ],
                transaction: t
            });

            if (!book) {
                await t.rollback();
                throw new Error("Book not found");
            }

            const plainBook = book.get({ plain: true });
            const files = (plainBook.files ?? []) as File[];
            const urls = files.map(f => f.url)
            if (urls.length) await storageService.delete(urls);

            await book.destroy({ transaction: t });

            await t.commit();
        } catch (err) {
            console.error(err);

            try {
                await t.rollback();
            } catch (rollbackErr) {
                console.error(rollbackErr);
            }

            const message = err instanceof Error ? err.message : String(err);
            throw new Error(message);
        }
    }
}

export const booksService = new BooksService();