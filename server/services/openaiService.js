import axios from 'axios';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();


const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/images/generations';

async function generateBackground(imagePath) {
    try {
        const image = fs.readFileSync(imagePath);
        const response = await axios.post(OPENAI_API_URL, {
            prompt: "Add a beautiful background to this image.",
            n: 1,
            size: "1024x1024",
            image: image.toString('base64')
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data.data[0].url; // Assuming the response contains the URL of the generated image
    } catch (error) {
        console.error('Error generating background:', error);
        throw error;
    }
}

// module.exports = {
//     generateBackground
// };
export default {
    generateBackground
}