
const https = require('https');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.GOOGLE_AI_API_KEY;
const model = 'imagen-4.0-fast-generate-001';

const postData = JSON.stringify({
    instances: [
        { prompt: "A futuristic city skyline with flying cars, digital art style" }
    ],
    parameters: {
        sampleCount: 1,
        aspectRatio: "1:1" // or "16:9"
    }
});

const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models/${model}:predict?key=${apiKey}`,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
};

console.log(`Requesting Image from ${model}...`);

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.predictions && json.predictions[0] && json.predictions[0].bytesBase64Encoded) {
                console.log("✅ Image generated successfully!");
                const buffer = Buffer.from(json.predictions[0].bytesBase64Encoded, 'base64');
                fs.writeFileSync('test-imagen.png', buffer);
                console.log("Saved to test-imagen.png");
            } else {
                console.error("❌ Failed/Unexpected response:", JSON.stringify(json, null, 2));
                // If 404/400, strictly check permissions.
            }
        } catch (e) {
            console.error("Parse Error:", e.message);
            console.log("Raw:", data);
        }
    });
});

req.on('error', (e) => {
    console.error("Request Error:", e.message);
});

req.write(postData);
req.end();
