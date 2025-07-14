import axios from 'axios';

const API_URL = 'http://localhost:5050/api'; // Update with your server URL

export const uploadImage = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

export const fetchProcessedImage = async (imageId) => {
    try {
        const response = await axios.get(`${API_URL}/processed/${imageId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching processed image:', error);
        throw error;
    }
};