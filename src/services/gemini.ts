import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function refineProjectDescription(description: string, challengeType: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Refine this hackathon project description for the Protocol Labs PL_Genesis Accelerator. 
    Challenge Type: ${challengeType}
    Original Description: ${description}
    
    Make it sound professional, highlight the technical innovation, and explain how it meaningfully integrates Protocol Labs technologies (IPFS, Filecoin, or Libp2p).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          refinedDescription: { type: Type.STRING },
          keyInnovations: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          },
          acceleratorAlignment: { type: Type.STRING }
        },
        required: ["refinedDescription", "keyInnovations", "acceleratorAlignment"]
      }
    }
  });

  return JSON.parse(response.text);
}
