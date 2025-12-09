import { GoogleGenAI } from "@google/genai";
import { ParamValue, TemplateId, EditTemplate } from "../types";
import { TEMPLATES } from "../constants";

const getTemplateById = (id: TemplateId): EditTemplate | undefined => {
  return TEMPLATES.find(t => t.id === id);
};

// Helper to interpolate the template string with actual values
const constructPrompt = (template: EditTemplate, params: Record<string, ParamValue>): string => {
  let prompt = template.systemPromptTemplate;
  
  // Replace ${key} with value
  Object.entries(params).forEach(([key, value]) => {
    const placeholder = `\${${key}}`;
    prompt = prompt.replace(placeholder, String(value));
  });

  return prompt;
};

export const editImageWithGemini = async (
  base64Image: string,
  templateId: TemplateId,
  params: Record<string, ParamValue>
): Promise<string> => {
  
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please set REACT_APP_GEMINI_API_KEY or allow insecure env access for demo.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const template = getTemplateById(templateId);

  if (!template) {
    throw new Error("Invalid Template ID");
  }

  const promptText = constructPrompt(template, params);
  
  // Clean base64 string if it contains metadata prefix
  const base64Data = base64Image.split(',')[1] || base64Image;

  try {
    // Using gemini-2.5-flash-image for image editing/transformation tasks
    // It accepts an image + text and returns a modified image (if prompted correctly)
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg', // Assuming jpeg for simplicity, or detect from header
              data: base64Data
            }
          },
          {
            text: `${promptText} \n\nOutput only the edited image.`
          }
        ]
      }
    });

    // Extracting the image from the response
    // The response candidates will contain inlineData for the generated image
    const parts = response.candidates?.[0]?.content?.parts;
    
    if (!parts) {
      throw new Error("No content generated.");
    }

    // Find the image part
    const imagePart = parts.find(part => part.inlineData);

    if (imagePart && imagePart.inlineData) {
      return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
    } else {
      // Sometimes it might refuse and return text
      const textPart = parts.find(part => part.text);
      if (textPart) {
         throw new Error(`Model declined to generate image: ${textPart.text}`);
      }
      throw new Error("No image data found in response.");
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};