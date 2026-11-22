
const { GoogleGenAI } = require("@google/genai");

const analyzeCode = async (req, res) => {
    try {
        const { code, programmingLanguage } = req.body;

        if (!code || !code.trim()) {
            return res.status(400).json({
                message: "Please provide code to analyze."
            });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({
                message: "Gemini API key is missing."
            });
        }

        console.log("Received code analysis request.");

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });

        const prompt = `
Analyze the following ${programmingLanguage || "Python"} code.

Identify:
1. All function names
2. All class names
3. All imported libraries and modules

Return ONLY valid JSON in this exact format:
{
  "functions": ["function1"],
  "classes": ["Class1"],
  "imports": ["library1"]
}

If a category has no results, return an empty array.

CODE:
${code}
`;

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents: prompt
        });

        let resultText = response.text;

        if (!resultText) {
            throw new Error("Gemini returned an empty analysis.");
        }

        resultText = resultText
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        const analysis = JSON.parse(resultText);

        console.log("Code analysis completed successfully.");

        return res.status(200).json({
            message: "Code analysis completed successfully!",
            analysis: {
                functions: analysis.functions || [],
                classes: analysis.classes || [],
                imports: analysis.imports || []
            }
        });

    } catch (error) {
        console.error("Code Analysis Error:", error);

        return res.status(500).json({
            message: "Code analysis failed.",
            error: error.message
        });
    }
};

module.exports = { analyzeCode };
