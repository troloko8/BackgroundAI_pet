import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const fileUpload = (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: 'Error uploading file' });
        }
        next();
    });
};

export default fileUpload;