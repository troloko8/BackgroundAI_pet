import express from 'express';
import imageController from '../controllers/imageController.js';
import fileUploadAndCompress from '../middleware/fileUpload.js';

const router = express.Router();

// Route for uploading an image
router.post('/upload', fileUploadAndCompress, imageController.uploadImage);

// Route for processing the uploaded image
router.post('/process',
    fileUploadAndCompress,
    imageController.processImage)
// router.get('/process', fileUploadAndCompress, imageController.processImage);

export default router