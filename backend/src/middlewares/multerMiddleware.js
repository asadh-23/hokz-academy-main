import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Error: Only image files (jpeg, jpg, png, webp) are allowed!'), false);
    }
};


const limits = {
    fileSize: 5 * 1024 * 1024 // 5 MB
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: limits
});


const uploadSingleImage = upload.single('profileImageFile');

export { uploadSingleImage };

