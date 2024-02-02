import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDirectory = path.join(__dirname, '../public/images');
        if (!fs.existsSync(uploadDirectory)) {
            fs.mkdirSync(uploadDirectory, { recursive: true });
        }
        cb(null, uploadDirectory);
    },
    filename: (req, file, cb) => {
        cb(
            null,
            file.fieldname + '_' + Date.now() + path.extname(file.originalname)
        );
    },
});
const imageFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (!file.mimetype.startsWith('image/')) {
        cb(new Error('File is not an image'));
    } else {
        cb(null, true);
    }
};

export const ImageUpload = multer({
    storage: storage,
    fileFilter: imageFilter,
});
