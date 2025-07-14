import generateBackground from "../services/openaiService.js";

class ImageController {
    async uploadImage(req, res) {
        try {
            // Handle image upload logic here
            const file = req.file;
            if (!file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }
            // Proceed to process the image
            return res.status(200).json({ message: 'Image uploaded successfully', file });
        } catch (error) {
            return res.status(500).json({ message: 'Error uploading image', error });
        }
    }

async processImage(req, res) {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        // Здесь работайте с req.file.buffer или req.file.path (если diskStorage)
        // Например, передайте req.file.buffer в openaiService
        // const result = await openaiService.generateBackground(req.file.buffer);
        const result = await generateBackground(req.file?.buffer);

        return res.status(200).json({ message: 'Image processed successfully', result });
    } catch (error) {
        return res.status(500).json({ message: 'Error processing image', error });
    }
}
}

export default new ImageController();