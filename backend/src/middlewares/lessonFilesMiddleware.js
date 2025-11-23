import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const type = req.body.type;

    if (!type) {
        return cb(new Error("Missing file type"), false);
    }

    if (type === "video") {
        if (!file.mimetype.startsWith("video/")) {
            return cb(new Error("Only video files are allowed"), false);
        }
    }

    if (type === "thumbnail") {
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Only image files are allowed"), false);
        }
    }

    if (type === "pdfNotes") {
        if (file.mimetype !== "application/pdf") {
            return cb(new Error("Only PDF files are allowed"), false);
        }
    }

    cb(null, true);
};

const limits = {
    fileSize: 1024 * 1024 * 500, // 500MB max for video
};

export const lessonFilesMiddleware = multer({
    storage,
    fileFilter,
    limits,
}).single("file");
