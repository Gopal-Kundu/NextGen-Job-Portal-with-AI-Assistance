const { gemini } = require("../Ai/gemini");

function parseGeminiJSON(text) {
  // remove ```json and ``` and extra spaces
  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  // convert to JSON
  return JSON.parse(cleaned);
}

async function aiApi(prompt) {
  try {
    const result = await gemini(prompt);
    return result;
  } catch (err) {
    console.error("AI Error:", err.message);
    throw new Error("AI API failed");
  }
}

module.exports = { aiApi, parseGeminiJSON };