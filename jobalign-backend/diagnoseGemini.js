import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';

const apiKey = process.env.GEMINI_API_KEY;
const models = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];
const versions = ['v1', 'v1beta'];

async function test() {
    for (const version of versions) {
        for (const model of models) {
            const url = `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${apiKey}`;
            console.log(`Testing ${version} with ${model}...`);
            try {
                const response = await axios.post(url, {
                    contents: [{ parts: [{ text: "hi" }] }]
                }, {
                    headers: { 'Content-Type': 'application/json' }
                });
                console.log(`✅ Success for ${version}/${model}! Status: ${response.status}`);
                return url; // Return the first working URL
            } catch (error) {
                console.log(`❌ Failed for ${version}/${model}: ${error.response?.status} ${error.response?.data?.error?.message || error.message}`);
            }
        }
    }
    return null;
}

test().then(url => {
    if (url) {
        console.log(`\nRecommended GEMINI_API_URL: ${url.split('?')[0]}`);
    } else {
        console.log('\nNo working URL found.');
    }
});
