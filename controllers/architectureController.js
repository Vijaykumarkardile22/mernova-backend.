
const { GoogleGenAI } = require("@google/genai");

const visualizeArchitecture = async (req, res) => {
    try {
        const { code, programmingLanguage } = req.body;

        if (!code || !code.trim()) {
            return res.status(400).json({
                message: "Please provide code to visualize."
            });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({
                message: "Gemini API key is missing."
            });
        }

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });

        const prompt = `
Analyze the following ${programmingLanguage || "Python"} code
and create an architecture diagram structure.

Identify:
1. Imported libraries
2. Functions
3. Classes
4. Relationships between functions and classes
5. The main execution flow

Return ONLY valid JSON in this exact format:
{
  "nodes": [
    {
      "id": "node1",
      "label": "Function or Class name",
      "type": "function",
      "description": "What this component does"
    }
  ],
  "edges": [
    {
      "source": "node1",
      "target": "node2",
      "label": "calls"
    }
  ],
  "summary": "Short architecture explanation"
}

Allowed node types: function, class, import, main.

Only include real components and relationships found in the code.
Use unique node IDs. Return empty arrays when necessary.

CODE:
${code}
`;

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents: prompt
        });

        let resultText = response.text;

        if (!resultText) {
            throw new Error("Gemini returned an empty architecture.");
        }

        resultText = resultText
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        const architecture = JSON.parse(resultText);

        return res.status(200).json({
            message: "Architecture generated successfully!",
            architecture: {
                nodes: architecture.nodes || [],
                edges: architecture.edges || [],
                summary: architecture.summary || ""
            }
        });

    } catch (error) {
        console.error("Architecture Visualization Error:", error);

        return res.status(500).json({
            message: "Architecture visualization failed.",
            error: error.message
        });
    }
};

module.exports = { visualizeArchitecture };
