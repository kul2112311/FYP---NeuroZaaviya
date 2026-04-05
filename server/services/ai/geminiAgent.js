// const { GoogleGenerativeAI } = require("@google/generative-ai");
// require('dotenv').config();

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// const SYSTEM_PROMPT = `
// ROLE:
// You are an Executive Function Coach for neurodivergent students.
// Your goal is to break complex assignments into concrete, manageable steps (15-45 mins each).

// OUTPUT FORMAT:
// You must return a raw JSON object. Do not wrap it in markdown blocks.
// Structure:
// {
//   "tasks": [
//     { 
//       "title": "Actionable Title", 
//       "duration_minutes": integer, 
//       "ai_detail": "Specific micro-strategy on HOW to do this step." 
//     }
//   ]
// }

// RULES:
// 1. 'ai_detail' must offer a strategy, not just an instruction.
// 2. If accommodations are listed in context, reference them.
// 3. If a rubric or document is attached, align the tasks specifically to its grading criteria and instructions.
// `;

// exports.generateBreakdown = async (userPrompt, fileData, studentContextString) => {
//   try {
//     // Using gemini-2.5-flash which supports native PDF reading
//     const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

//     const textPrompt = `
//       ${SYSTEM_PROMPT}

//       ${studentContextString}

//       ASSIGNMENT INFO:
//       User Goal: "${userPrompt}"

//       Generate the breakdown JSON now.
//     `;

//     // 1. Package the text prompt
//     const promptParts = [textPrompt];

//     // 2. If a file was uploaded, convert the raw buffer to base64 and attach it
//     if (fileData && fileData.buffer) {
//       console.log(`📎 Attaching raw file to Gemini prompt: ${fileData.mimeType}`);
//       promptParts.push({
//         inlineData: {
//           data: fileData.buffer.toString("base64"),
//           mimeType: fileData.mimeType
//         }
//       });
//     }

//     // 3. Send the combined prompt (Text + File) to Gemini
//     const result = await model.generateContent(promptParts);
//     const response = await result.response;
//     const text = response.text();

//     // Clean up potential markdown formatting from Gemini
//     const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
//     return JSON.parse(jsonString);

//   } catch (error) {
//     console.error("Gemini API Error:", error);
//     throw new Error("Failed to generate breakdown with Gemini.");
//   }
// };

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

// ✅ FIXED: Accepts the raw filePart and passes it directly to Gemini
exports.generateBreakdown = async (userPrompt, filePart, studentContextString) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const textPrompt = `
      ${SYSTEM_PROMPT}

      ${studentContextString}

      ASSIGNMENT INFO:
      User Goal: "${userPrompt}"
      
      Generate the breakdown JSON now.
    `;

    // Package the text prompt and the file (if one exists) into an array
    const promptArray = [textPrompt];
    if (filePart) {
      promptArray.push(filePart);
    }

    const result = await model.generateContent(promptArray);
    const response = await result.response;
    const text = response.text();

    console.log("Raw Gemini Output received.");

    // Bulletproof JSON parsing
    let jsonString = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const start = jsonString.indexOf('{');
    const end = jsonString.lastIndexOf('}');
    
    if (start !== -1 && end !== -1) {
        jsonString = jsonString.substring(start, end + 1);
    }
    
    return JSON.parse(jsonString);

  } catch (error) {
    console.error("❌ Gemini API Detailed Error:", error);
    throw new Error("Failed to generate breakdown with Gemini.");
  }
};