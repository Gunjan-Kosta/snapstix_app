
import { GoogleGenAI } from "@google/genai";

export const generateSticker = async (base64DataUrl: string, prompt: string, expression: string = "Happy"): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const mimeMatch = base64DataUrl.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
    if (!mimeMatch) {
      throw new Error("Invalid image format.");
    }
    
    const mimeType = mimeMatch[1];
    const base64Data = mimeMatch[2];

    const fullPrompt = `Create a professional 2D messaging sticker.
    
    SUBJECT: ${prompt || 'Friendly Character'}
    EXPRESSION: ${expression}
    
    SPECIFICATIONS:
    - Transparent background (critical for stickers).
    - Thick, continuous white die-cut contour border.
    - 2D vector-style illustration with bold, clean lines.
    - Highly expressive features that work well at small sizes.
    - Vibrant colors with clean cel-shading.
    - No text, no realistic textures, no shadows on the background.
    - Safety: Wholesome and suitable for global messaging apps.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          { text: fullPrompt },
        ],
      },
    });

    if (!response || !response.candidates?.[0]?.content?.parts) {
      throw new Error("AI could not generate the sticker.");
    }

    let imageUrl = '';
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!imageUrl) throw new Error("No image part returned.");

    return imageUrl;
  } catch (error: any) {
    console.error(`Gemini Service Error:`, error);
    throw new Error(error.message || "Failed to generate sticker.");
  }
};
