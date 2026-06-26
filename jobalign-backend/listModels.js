import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';

const apiKey = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

async function listModels() {
    try {
        const response = await axios.get(url);
        console.log('Available Models:');
        response.data.models.forEach(m => console.log(m.name));
    } catch (error) {
        console.error('Error fetching models:', error.response?.status, error.response?.data?.error?.message || error.message);
    }
}

listModels();
