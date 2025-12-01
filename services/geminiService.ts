import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
// IMPORTANT: API Key is strictly from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash-image';

/**
 * Generates a single wallpaper based on the prompt.
 * We will call this multiple times in parallel to get variations.
 */
async function generateSingleWallpaper(prompt: string, referenceImage?: string): Promise<string | null> {
  try {
    const parts: any[] = [];
    
    // If remixing, add the reference image first
    if (referenceImage) {
      // Remove data URL prefix if present to get raw base64
      const base64Data = referenceImage.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
      
      parts.push({
        inlineData: {
          data: base64Data,
          mimeType: 'image/png', 
        },
      });
      
      parts.push({
        text: `Remix this image to match the style: ${prompt}. Maintain the horizontal 16:9 composition suitable for a landscape wallpaper.`
      });
    } else {
      parts.push({
        text: `Create a high-quality, aesthetic wallpaper (horizontal 16:9 ratio) based on this description: "${prompt}". The style should be polished, artistic, and suitable for a background.`
      });
    }

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: parts,
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9", // Horizontal for landscape/scrollable mobile wallpaper
        },
      },
    });

    // Extract image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64EncodeString = part.inlineData.data;
        return `data:image/png;base64,${base64EncodeString}`;
      }
    }
    
    return null;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
}

/**
 * Orchestrates the generation of 4 wallpapers.
 */
export const generateWallpapers = async (prompt: string, count: number = 4): Promise<string[]> => {
  const promises = Array(count).fill(null).map(() => generateSingleWallpaper(prompt));
  
  const results = await Promise.allSettled(promises);
  
  const images: string[] = [];
  results.forEach((result) => {
    if (result.status === 'fulfilled' && result.value) {
      images.push(result.value);
    }
  });

  if (images.length === 0) {
    throw new Error("이미지를 생성하지 못했습니다. 다시 시도해주세요.");
  }

  return images;
};

/**
 * Remixes a specific wallpaper.
 * Returns 1 remixed version (can be called multiple times if needed, but UI usually does 1 or 4).
 * For this app, we will generate a batch of 4 remixes.
 */
export const remixWallpaperBatch = async (originalImage: string, prompt: string, count: number = 4): Promise<string[]> => {
   const promises = Array(count).fill(null).map(() => generateSingleWallpaper(prompt, originalImage));
  
  const results = await Promise.allSettled(promises);
  
  const images: string[] = [];
  results.forEach((result) => {
    if (result.status === 'fulfilled' && result.value) {
      images.push(result.value);
    }
  });
  
   if (images.length === 0) {
    throw new Error("리믹스에 실패했습니다.");
  }

  return images;
}