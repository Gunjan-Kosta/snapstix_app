
import { GoogleGenAI } from "@google/genai";

// Function to generate a sticker using the Gemini 2.5 Flash Image model
export const generateSticker = async (base64DataUrl: string, prompt: string, expression: string = "Happy"): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const mimeMatch = base64DataUrl.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
    if (!mimeMatch) {
      throw new Error("Invalid image format.");
    }
    
    const mimeType = mimeMatch[1];
    const base64Data = mimeMatch[2];

    const fullPrompt = `Create a high-quality 2D messaging sticker of the person in the image.
    
    THEME/STYLE: ${prompt || 'Professional Cartoon Illustration'}
    EXPRESSION: ${expression}
    
    CRITICAL STICKER SPECIFICATIONS:
    1. SUBJECT: Transform the person from the uploaded photo into a clean, 2D vector-style cartoon character.
    2. BORDER: A thick, solid white continuous die-cut contour border must surround the entire character.
    3. BACKGROUND: Must be perfectly empty/neutral. 
    4. ART STYLE: Use vibrant colors, bold clean outlines, and simple cel-shading.
    5. EXPRESSION: The character must clearly show a ${expression} expression.
    6. NO TEXT: Do not include any words, letters, or symbols.
    7. COMPOSITION: Center the character, full head and shoulders visible.`;

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
      throw new Error("Empty response from AI Studio.");
    }

    let imageUrl = '';
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!imageUrl) {
       const feedback = response.text;
       if (feedback) throw new Error(feedback);
       throw new Error("Sticker image not found in response.");
    }

    return imageUrl;
  } catch (error: any) {
    console.error(`Gemini Service Error Detail:`, error);
    
    // Robust rate limit detection
    const errorMsg = error.message || "";
    const errorStr = JSON.stringify(error);
    const isRateLimit = 
      errorMsg.includes("429") || 
      errorMsg.includes("RESOURCE_EXHAUSTED") || 
      errorStr.includes("429") || 
      errorStr.includes("RESOURCE_EXHAUSTED");

    if (isRateLimit) {
      throw new Error("RATE_LIMIT");
    }
    
    throw error;
  }
};
