
const https = require('https');
const path = require('path');
const fs = require('fs');

// Simple dotenv parser to avoid dependencies if possible, or just use dotenv
require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("No API key found in .env.local");
    process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log(`Querying: ${url.replace(apiKey, 'HIDDEN_KEY')}`);

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.error) {
                console.error("API Error:", JSON.stringify(json.error, null, 2));
            } else {
                console.log("Available Models:");
                if (json.models) {
                    json.models.forEach(m => {
                        console.log(`- ${m.name} (${m.supportedGenerationMethods.join(', ')})`);
                    });
                } else {
                    console.log("No models found?", json);
                }
            }
        } catch (e) {
            console.error("Parse Error:", e.message);
            console.log("Raw Data:", data);
        }
    });
}).on('error', (e) => {
    console.error("Request Error:", e.message);
});
