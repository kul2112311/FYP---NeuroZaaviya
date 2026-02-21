const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');
const fs = require('fs');

// --- DEBUG LOGGING START ---
const envPath = path.join(__dirname, '.env');
console.log("--- .ENV FILE DEBUG ---");
console.log("Checking for .env file at:", envPath);

if (fs.existsSync(envPath)) {
    console.log("✅ SUCCESS: .env file found on disk.");
    const content = fs.readFileSync(envPath, 'utf8');
    if (content.includes('GEMINI_API_KEY')) {
        console.log("✅ SUCCESS: GEMINI_API_KEY key-name found inside the file.");
    } else {
        console.log("❌ ERROR: GEMINI_API_KEY not found inside the .env file text.");
    }
} else {
    console.log("❌ ERROR: .env file NOT FOUND at this path.");
    console.log("Files currently in this folder:", fs.readdirSync(__dirname));
}

// Load the environment variables
require('dotenv').config({ path: envPath });

const apiKey = process.env.GEMINI_API_KEY;
console.log("Loaded API Key preview:", apiKey ? `${apiKey.substring(0, 8)}...` : "UNDEFINED/NONE");
console.log("------------------------\n");
// --- DEBUG LOGGING END ---

const genAI = new GoogleGenerativeAI(apiKey || "");

async function listModels() {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    
    console.log("--- YOUR AVAILABLE MODELS ---");
    if (data.models) {
      data.models.forEach(m => {
        if (m.supportedGenerationMethods.includes('generateContent')) {
            console.log(`✅ ${m.name.replace('models/', '')}`);
        }
      });
      console.log("\nIf you see models above, your key is valid!");
    } else {
      console.log("❌ GOOGLE API REJECTED THE KEY:");
      console.log(JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error("Connection Error:", error.message);
  }
}

if (apiKey) {
    listModels();
} else {
    console.log("Aborting model check: No API Key available to test.");
}