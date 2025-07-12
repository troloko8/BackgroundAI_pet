import express from 'express';
import imageController from '../controllers/imageController.js';

const router = express.Router();

// Route for uploading an image
router.post('/upload', imageController.uploadImage);

// Route for processing the uploaded image
router.post('/process', imageController.processImage);

export default router