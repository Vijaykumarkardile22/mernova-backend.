
const { GoogleGenAI } = require("@google/genai");

const explainCode = async (req, res) => {
  try {
    const { code, programmingLanguage } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({
        message: "Please provide code to explain."
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        message: "Gemini API key is missing in backend configuration."
      });
    }

    console.log("Received AI explanation request.");

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    const prompt = `
You are CodeExplain AI, an expert programming teacher.

Explain the following ${programmingLanguage || "programming"} code
in simple English for a beginner MCA student.

IMPORTANT FORMATTING RULES:
- Write the explanation in properly formatted Markdown.
- Put every heading on its own separate line.
- Add a blank line before and after every heading.
- Put every bullet point on a separate line.
- Put every numbered point on a separate line.
- Never combine multiple sections into one paragraph.
- Use **bold** for important programming terms.
- Use Markdown code blocks for code examples.
- Use horizontal separators only on their own separate lines.
- Do not write the entire explanation as one continuous paragraph.
- Do not put Markdown headings or bullet points on the same line as other text.
- Keep the explanation clear, organized, and beginner-friendly.

Follow this exact structure:

# 1. Purpose of the Code

Explain what the code does.

# 2. Line-by-Line Explanation

Explain the important lines of code in order.

# 3. Functions and Classes

Explain each important function and class.

# 4. Libraries and Imports

Explain the libraries and imported modules.

# 5. Step-by-Step Working

Explain how the program executes from beginning to end.

# 6. Example Output

Show a suitable example output in a code block.
If the output depends on input, clearly mention that.

# 7. Important Concepts Learned

List the important programming concepts used in this code.

CODE TO EXPLAIN:

\`\`\`
${code}
\`\`\`

Remember: Return only the formatted Markdown explanation.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt
    });

    const explanation = response.text;

    if (!explanation) {
      throw new Error("Gemini returned an empty explanation.");
    }

    console.log("AI explanation generated successfully.");

    return res.status(200).json({
      message: "AI explanation generated successfully!",
      explanation
    });

  } catch (error) {
    console.error("Gemini AI Error:", error);

    return res.status(500).json({
      message: "Failed to generate AI explanation.",
      error: error.message
    });
  }
};

module.exports = { explainCode };
