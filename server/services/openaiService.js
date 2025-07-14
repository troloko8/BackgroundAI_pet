import axios from 'axios';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
// curly one with drug background generation
const prompt1 = `
Please take the provided PNG image and transform it into a new JPEG image that features a vibrant and engaging background designed to accentuate the subject within the image. This new composition is specifically aimed at a marketplace setting, where visual appeal is crucial for attracting potential buyers.

Contextual Guidelines:

Background Design: Create a colorful background that is not only visually striking but also aligns with neuromarketing principles. The background should complement and enhance the subject, using colors and patterns that evoke positive emotional responses and draw the viewer's attention effectively.

Subject Focus: Ensure that the subject of the PNG image remains the focal point of the new JPEG. The background should be designed in such a way that it highlights and elevates the presence of the subject without detracting from it.

Quality Standards: The output JPEG must be of the highest quality possible, with a significant file size (in MB). This is essential to maintain clarity and detail when the image is displayed in a marketplace context, where quality can impact buyer perception.

Minor Enhancements: While the primary focus should be on the background, feel free to make cosmetic adjustments to the subject itself, such as refining shadows, improving contrast, or adjusting lighting. However, these enhancements should be subtle and not alter the overall appearance of the subject significantly.

Final Output: The final JPEG should be a polished and professional representation of the subject against a carefully curated background, ready for marketplace display.
`

const prompt2 = `
I would like you to take the provided PNG image and create a new JPEG version of it. The primary subject in the image should remain unchanged, with only minor cosmetic adjustments to enhance its appearance. These adjustments should include refining the shadows, improving contrast, and optimizing the lighting to ensure that the subject stands out more effectively.

In addition to these enhancements, I would like you to design a new background for the image. The background should be simple and visually appealing, consisting of either a solid color, a monotone look, or a smooth gradient. It is important that the background aligns with neuromarketing principles, as it should subtly enhance the focus on the subject and draw the viewer's attention without being distracting.

The final product will be used on a marketplace platform, so the JPEG image must be of high quality and high resolution. Please ensure that it is visually compelling and adheres to any maximum file size requirements, if applicable. Your attention to detail in both the subject and background design will be crucial for creating an attractive and effective image suitable for a commercial setting. Thank you!
`
// FIXME promp3 from kacefet picture
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_API_URL = 'https://api.openai.com/v1/images/generations';
// Для редактирования или вариаций исходного 
// PNG — POST https://api.openai.com/v1/images/edits или …/variations

if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not defined in environment variables');
}

async function generateBackground(imagePath) {
    try {
        const image = fs.readFileSync(imagePath);
        const response = await axios.post(OPENAI_API_URL, {
            prompt: prompt2,
            n: 1,
            size: "1024x1024",
            image: image.toString('base64'),
            quality: "low",
            format: "jpeg",
            background: "opaque",
            mask: null,
            response_format: 'b64_json'
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