import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const getBudGuideResponse = async (prompt: string, context: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are the Island Vibes AI Bud Guide, an expert in legal cannabis in the USVI. 
      Help the user find the right products based on their needs. 
      Context: ${context}
      User Query: ${prompt}`,
      config: {
        systemInstruction: "Be professional, helpful, and focus on legal USVI cannabis products. Always remind users to consume responsibly and verify their age. Use search results to provide accurate information about local dispensaries and regulations. If you use search results, mention that you are using real-time information.",
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => ({
      title: chunk.web?.title || 'Source',
      url: chunk.web?.uri || '#'
    })).filter(s => s.url !== '#') || [];

    return { text, sources };
  } catch (error) {
    console.error("AI Bud Guide Error:", error);
    return { 
      text: "I'm sorry, I'm having trouble connecting to my knowledge base. Please try again later.",
      sources: []
    };
  }
};
