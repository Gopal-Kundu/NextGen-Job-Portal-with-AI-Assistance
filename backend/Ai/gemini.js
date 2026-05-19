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

async function generateEmbedding(contents) {
    try {
        const response = await ai.models.embedContent({
            model: "gemini-embedding-001",
            contents: contents,
            config: {
                outputDimensionality: 368,
            },
        });
        
        return response.embeddings.map(item => item.values);
    } catch (err) {
        console.error("Gemini Embedding Error:", err.message);
        throw err;
    }
}

module.exports = { gemini, generateEmbedding };