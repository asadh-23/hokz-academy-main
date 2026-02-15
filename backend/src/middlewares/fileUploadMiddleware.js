import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const type = req.body.type;

    if (!type) {
        return cb(new Error("Missing file type"), false);
    }

    // -------------------------------------------
    // 1. LESSON LOGIC (Strict Checking)
    // -------------------------------------------
    if (type === "video") {
        if (!file.mimetype.startsWith("video/")) {
            return cb(new Error("Only video files are allowed"), false);
        }
    } else if (type === "thumbnail") {
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Only image files are allowed"), false);
        }
    } else if (type === "pdfNotes") {
        if (file.mimetype !== "application/pdf") {
            return cb(new Error("Only PDF files are allowed"), false);
        }
    } 
    
    // -------------------------------------------
    // 2. CHAT LOGIC (Flexible Checking) 🔥
    // -------------------------------------------
    else if (type === "chat") {
        const isImage = file.mimetype.startsWith("image/");
        const isVideo = file.mimetype.startsWith("video/");
        const isPDF = file.mimetype === "application/pdf";

        if (!isImage && !isVideo && !isPDF) {
            return cb(new Error("Unsupported file type! Only Images, Videos, and PDFs are allowed."), false);
        }
    } 
    
    // Invalid Type passed
    else {
        return cb(new Error("Invalid upload type specified"), false);
    }

    cb(null, true);
};

const limits = {
    fileSize: 1024 * 1024 * 500, 
};

export const uploadMiddleware = multer({
    storage,
    fileFilter,
    limits,
}).single("file");