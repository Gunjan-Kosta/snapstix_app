
import { GoogleGenAI } from "@google/genai";

export const generateSticker = async (base64DataUrl: string, prompt: string, expression: string = "Happy"): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Extract base64 and mime type accurately
    const mimeMatch = base64DataUrl.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
    if (!mimeMatch) {
      throw new Error("Invalid image format. Please upload a valid image file.");
    }
    
    const mimeType = mimeMatch[1];
    const base64Data = mimeMatch[2];

    // Added explicit family-friendly and sticker-specific instructions to lower safety trigger rates
    const fullPrompt = `Task: Create a professional 2D cartoon messaging sticker.
    
    SUBJECT CATEGORY: A family-friendly cartoon version of "${prompt || 'Friendly Character'}"
    REQUIRED EMOTION: ${expression}
    
    ART STYLE SPECS:
    - High-quality digital vector art style.
    - Thick, continuous white die-cut contour border (sticker style).
    - Pure white background (no shadows or gradients on background).
    - Clear, friendly facial features maintaining the subject's identity from the photo.
    - Vibrant, saturated colors with clean cel-shading.
    - Playful, expressive, and simplified character design.
    - Safety: Ensure the result is wholesome, non-violent, and suitable for all ages.
    - NO TEXT, NO REALISTIC TEXTURES, NO BACKGROUND SCENERY.`;

    console.info(`SnapStix: Brewing ${expression} sticker for theme: ${prompt}`);

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
      config: {
        // Use default safety settings which are usually quite strict for images, 
        // hence the prompt engineering above is crucial.
      }
    });

    if (!response || !response.candidates?.[0]?.content?.parts) {
      throw new Error("Empty response from AI model.");
    }

    let imageUrl = '';
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!imageUrl) {
      throw new Error("The model did not return an image part.");
    }

    return imageUrl;
  } catch (error: any) {
    console.error(`Gemini Service Error (${expression}):`, error);
    throw new Error(error.message || "Failed to generate sticker.");
  }
};
