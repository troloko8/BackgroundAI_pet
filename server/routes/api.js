import express from 'express';
import imageController from '../controllers/imageController.js';
import fileUpload from '../middleware/fileUpload.js';

const router = express.Router();

// Route for uploading an image
router.post('/upload', fileUpload, imageController.uploadImage);

// Route for processing the uploaded image
router.post('/process',
    fileUpload,
    imageController.processImage)
// router.get('/process', fileUpload, imageController.processImage);

export default router