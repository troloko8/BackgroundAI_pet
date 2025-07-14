import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

const fileUpload = (req, res, next) => {
    console.log('File upload middleware called');
    
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.error('Error uploading file:', err);
            return res.status(400).json({ error: 'Error uploading file' });
        }
        
        console.log('Uploaded file:', req.file);
        
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        
        next();
    });
};

export default fileUpload;