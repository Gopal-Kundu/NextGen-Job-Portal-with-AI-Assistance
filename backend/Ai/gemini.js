const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv");
dotenv.config();

const key = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ key });

async function gemini(promt) {
    const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: promt,
    });
    return response.text;
}

module.exports = { gemini };