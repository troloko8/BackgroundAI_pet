// import multer from "multer";

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// const fileUpload = (req, res, next) => {
//     upload.single('image')(req, res, (err) => {
//         if (err) {
//             return res.status(400).json({ error: 'Error uploading file' });
//         }
//         if (!req.file) {
//             return res.status(400).json({ error: 'No file uploaded' });
//         }
//         next();
//     });
// };

// export default fileUpload;

import multer from "multer";
import sharp from "sharp";

// Multer: сохраняем в память
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // допускаем более, чем 4MB, чтобы потом ужать
});

const compressImage = async (buffer) => {
    // Приводим к одному из поддерживаемых OpenAI размеров и одновременно сжимаем
    return await sharp(buffer)
        .resize(1024, 1024, { fit: "inside" })   // масштабируем, если больше 1024
        .png({ quality: 80 })                   // конвертируем в PNG с качеством 80%
        .toBuffer();
};

const fileUploadAndCompress = (req, res, next) => {
    upload.single("image")(req, res, async (err) => {
        if (err) {
            if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
                return res.status(413).json({ error: "Исходный файл слишком большой." });
            }
                return res.status(400).json({ error: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded." });
        }

        try {
            // Сжимаем изображение
            const compressedBuffer = await compressImage(req.file.buffer);

            // Если после сжатия >4MB, можно дополнительно уменьшить качество
            if (compressedBuffer.length > 4 * 1024 * 1024) {
                req.file.buffer = await sharp(compressedBuffer)
                    .png({ quality: 60 })
                    .toBuffer();
            } else {
                req.file.buffer = compressedBuffer;
            }

            // Переименуем и установим новый mime-type
            req.file.mimetype = "image/png";
            req.file.originalname = req.file.originalname.replace(/\.\w+$/, ".jpg");

            next();
        } catch (e) {
            console.error("Compression error:", e);
            res.status(500).json({ error: "Ошибка при сжатии изображения." });
        }
    });
};

export default fileUploadAndCompress;
