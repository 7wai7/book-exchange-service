import multer from "multer";
import path from "path";
import fs from "fs";
import { randomUUID } from 'crypto';

class StorageService {
    storage: multer.StorageEngine;
    upload: multer.Multer;
    uploadDir: string;

    constructor() {
        this.uploadDir = path.resolve(process.cwd(), "uploads");

        // Якщо папки немає — створити
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
            console.log(`Created upload directory at: ${this.uploadDir}`);
        }

        const storage = multer.diskStorage({
            destination: (req, file, cb) => cb(null, 'uploads/'),
            filename: (req, file, cb) => {
                const ext = path.extname(file.originalname);
                cb(null, `${Date.now()}-${randomUUID()}${ext}`);
            }
        });


        this.storage = storage;
        this.upload = multer({ storage });
    }

    async delete(urls: string[]) {
        for (const url of urls) {
            try {
                if (fs.existsSync(url)) {
                    fs.unlinkSync(url);
                    console.log(`Deleted file: ${url}`);
                } else {
                    console.warn(`File not found: ${url}`);
                }
            } catch (err) {
                console.error(`Failed to delete file ${url}:`, err);
            }
        }
    }
}

export const storageService = new StorageService();