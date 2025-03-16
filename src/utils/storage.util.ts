import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/uploads'); // Save files locally before uploading
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Keep original filename
    }
});

export const upload = multer({ storage });
