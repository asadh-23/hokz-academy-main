import multer from 'multer';
import path from 'path';

// Memory Storage (S3-ലേക്ക് അപ്‌ലോഡ് ചെയ്യാൻ buffer ലഭിക്കാൻ)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    // അനുവദനീയമായ ഫയൽ ഫോർമാറ്റുകൾ
    const allowedTypes = /jpeg|jpg|png|webp/;
    
    // Check extension and mimetype
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        return cb(new Error('Only image files (jpeg, jpg, png, webp) are allowed!'), false);
    }
};

const limits = {
    fileSize: 10 * 1024 * 1024, // 10MB Max Size
};

// Multer Instance create ചെയ്യുന്നു (ഇവിടെ .single() വിളിക്കുന്നില്ല)
const imageUpload = multer({
    storage,
    fileFilter,
    limits
});

export default imageUpload;