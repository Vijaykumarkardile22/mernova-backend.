const { GoogleGenAI } = require("@google/genai");

const analyzeCodeImpact = async (req, res) => {
  try {
    const { code, programmingLanguage } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({
        message: "Please provide code to analyze."
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        message: "Gemini API key is missing in backend configuration."
      });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    const prompt = `
You are CodeExplain AI, an expert software impact analyst.

Analyze the following ${programmingLanguage || "programming"} code.

Explain:
1. What parts of the application may be affected.
2. Which functions or modules depend on this code.
3. What could break if this code is changed.
4. Possible performance and security impacts.
5. Recommended testing before making changes.

Use clear, beginner-friendly English.
Format your response using properly structured Markdown.

CODE:
\`\`\`
${code}
\`\`\`
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt
    });

    const impact = response.text;

    if (!impact) {
      throw new Error("Gemini returned an empty impact analysis.");
    }

    return res.status(200).json({
      message: "Code impact analysis generated successfully!",
      impact
    });

  } catch (error) {
    console.error("Impact Analysis Error:", error);

    return res.status(500).json({
      message: "Failed to analyze code impact.",
      error: error.message
    });
  }
};

module.exports = { analyzeCodeImpact };
