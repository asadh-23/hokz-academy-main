import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
        return cb(new Error("Only image files are allowed"), false);
    }
    cb(null, true);
};

const limits = {
    fileSize: 10 * 1024 * 1024, // 10MB
};

export const courseThumbnailMiddleware = multer({
    storage,
    fileFilter,
    limits,
}).single("file");
