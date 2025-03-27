const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = "AIzaSyDzGfnmfG-w8pWyGtmXZlt-0_QCy1Q-PYI";

async function textGenTextOnlyPromptStreaming(prompt) {
    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // const prompt = "Can you give me code for Fibonacci with DP";

        const result = await model.generateContentStream(prompt);

        let fullResponse = "";

        for await (const chunk of result.stream) {
            fullResponse += chunk.text();
        }

        return fullResponse; // Return the final response
    } catch (error) {
        console.error("Error generating content:", error);
        throw error; // Rethrow error for handling in calling function
    }
}

// Export the function
module.exports = { textGenTextOnlyPromptStreaming };
