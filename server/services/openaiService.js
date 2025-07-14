import axios from 'axios';
import dotenv from 'dotenv';
import FormData from 'form-data';

// import OpenAI from "openai";
// import stream from "stream";


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
const prompt2Less1000 = `Please convert the provided PNG into a high-quality JPEG, keeping the main subject unchanged. Apply only minor cosmetic enhancements—refine shadows, boost contrast, and optimize lighting—to make the subject stand out more effectively. Then create a simple, visually appealing background (solid color, monotone palette, or smooth gradient) guided by neuromarketing principles so it subtly directs attention without distraction. Ensure the final JPEG is high resolution, visually compelling for a marketplace platform, and compliant with any file-size limits. Attention to both subject refinements and background design is crucial for a polished, commercial-ready result.`
// FIXME promp3 from kacefet picture
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_API_URL = 'https://api.openai.com/v1/images/edits';


if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not defined in environment variables');
}

async function generateBackground(imageBuffer) {
    try {
        const formData = new FormData();
        formData.append('image', imageBuffer, {
            filename: 'image.png',
            contentType: 'image/png'
        });
        formData.append('prompt', prompt2Less1000); // <-- обязательно!
        formData.append('n', 1);
        formData.append('size', '1024x1024');
        formData.append('response_format', 'b64_json');

        const response = await axios.post(OPENAI_API_URL, formData, {
            headers: {
                ...formData.getHeaders(),
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            }
        });

        return response.data.data?.[0].b64_json;
    } catch (error) {
        console.error('Error generating background:', error?.response?.data || error.message);
        throw error;
    }
}

export default generateBackground

// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
// });

// async function generateBackground(imageBuffer) {
//     if (!imageBuffer) {
//         throw new Error('Image buffer is required');
//     }

//     try {
//         // Преобразуем Buffer в ReadableStream для OpenAI SDK
//         const bufferStream = new stream.PassThrough();
//         bufferStream.end(imageBuffer);

//         const response = await openai.images.edits({
//             image: bufferStream,
//             prompt: prompt2Less1000,
//             model: "gpt-image-1",
//             n: 1,
//             size: "1024x1024",
//             quality: "low",
//             background: "auto",
//             moderation: "auto",
//             response_format: "b64_json"
//         });

//         // Вернёт base64 PNG
//         return response.data[0].b64_json;
//     } catch (error) {
//         console.error('Error generating background:', error?.response?.data || error.message, error);
//         throw error;
//     }
// }

// export default generateBackground;
