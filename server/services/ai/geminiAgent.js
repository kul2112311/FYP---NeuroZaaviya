const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `
ROLE:
You are an Executive Function Coach for neurodivergent students.
Your goal is to break complex assignments into concrete, manageable steps (15-45 mins each).
If the user provides a letter or gibberish in the prompt only pay attention to the file, read it thoroughly and extract the key requirements, then break those down into actionable 6 tasks as a default limit.

OUTPUT FORMAT:
You must return a raw JSON object. Do not wrap it in markdown blocks.
Structure:
{
  "parent_title": "A short, smart, 3-to-5 word title for the overall assignment based on the prompt/file.",
  "tasks": [
    { 
      "title": "Actionable Title", 
      "duration_minutes": integer, 
      "ai_detail": "Specific micro-strategy on HOW to do this step." 
    }
  ]
}

RULES:
1. 'ai_detail' must offer a strategy, not just an instruction.
2. If accommodations are listed in context, reference them.
3. If a rubric or document is attached, read it carefully and align the tasks specifically to its grading criteria and instructions.
`;

// ✨ FIXED: Bulletproof Fallback System for Presentations
exports.generateBreakdown = async (userPrompt, filePart, studentContextString) => {
  // If one model is busy, it instantly tries the next one in the list!
  const fallbackModels = [
    "gemini-2.5-flash",
    "gemini-2.5-pro",
    "gemini-2.0-flash",
    "gemini-2.0-flash-001",
    "gemini-2.0-flash-lite-001",
    "gemini-2.0-flash-lite",
    "gemini-2.5-flash-preview-tts",
    "gemini-2.5-pro-preview-tts",
    "gemma-3-1b-it",
    "gemma-3-4b-it",
    "gemma-3-12b-it",
    "gemma-3-27b-it",
    "gemma-3n-e4b-it",
    "gemma-3n-e2b-it",
    "gemma-4-26b-a4b-it",
    "gemma-4-31b-it",
    "gemini-flash-latest",
    "gemini-flash-lite-latest",
    "gemini-pro-latest",
    "gemini-2.5-flash-lite",
    "gemini-2.5-flash-image",
    "gemini-3-pro-preview",
    "gemini-3-flash-preview",
    "gemini-3.1-pro-preview",
    "gemini-3.1-pro-preview-customtools",
    "gemini-3.1-flash-lite-preview",
    "gemini-3-pro-image-preview",
    "nano-banana-pro-preview",
    "gemini-3.1-flash-image-preview",
    "lyria-3-clip-preview",
    "lyria-3-pro-preview",
    "gemini-3.1-flash-tts-preview",
    "gemini-robotics-er-1.5-preview",
    "gemini-robotics-er-1.6-preview",
    "gemini-2.5-computer-use-preview-10-2025",
    "deep-research-max-preview-04-2026",
    "deep-research-preview-04-2026",
    "deep-research-pro-preview-12-2025"
  ];

  const textPrompt = `
    ${SYSTEM_PROMPT}

    ${studentContextString}

    ASSIGNMENT INFO:
    User Goal: "${userPrompt}"
    
    Generate the breakdown JSON now.
  `;

  const promptArray = [textPrompt];
  if (filePart) {
    promptArray.push(filePart);
  }

  let lastError = null;

  // Try each model one by one
  for (const modelName of fallbackModels) {
    try {
      console.log(`✨ Trying model: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });

      const result = await model.generateContent(promptArray);
      const response = await result.response;
      const text = response.text();

      console.log(`✅ Success with ${modelName}!`);

      // Bulletproof JSON parsing
      let jsonString = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      const start = jsonString.indexOf('{');
      const end = jsonString.lastIndexOf('}');
      
      if (start !== -1 && end !== -1) {
          jsonString = jsonString.substring(start, end + 1);
      }
      
      return JSON.parse(jsonString);

    } catch (error) {
      console.warn(`⚠️ Model ${modelName} failed (${error.statusText}). Automatically trying next model...`);
      lastError = error;
      // The loop automatically continues to the next model!
    }
  }

  // If literally all 3 models are completely down (very rare)
  console.error("❌ ALL FALLBACK MODELS FAILED:", lastError);
  throw new Error("The AI servers are exceptionally busy right now. Please try again in a few seconds.");
};