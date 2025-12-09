import { EditTemplate, TemplateId } from './types';
import { 
  Palette, 
  Smile, 
  Sparkles, 
  Paintbrush, 
  Eraser, 
  Sticker,
  PenTool,
  Anchor,
  Sun,
  Trophy,
  Zap,
  Mountain
} from 'lucide-react';

export const TEMPLATES: EditTemplate[] = [
  // New Scenarios
  {
    id: TemplateId.BG_SHIP,
    name: 'Luxury Cruise',
    description: 'Inside a luxury ship with ocean views.',
    iconName: 'Anchor',
    params: [
      { id: 'lighting', label: 'Lighting', type: 'select', defaultValue: 'golden hour', options: [
        { label: 'Golden Hour', value: 'warm golden hour' },
        { label: 'Bright Noon', value: 'bright daylight' },
        { label: 'Sunset', value: 'dramatic sunset' },
        { label: 'Night', value: 'ambient night' }
      ]}
    ],
    systemPromptTemplate: "Replace the background with the interior of a luxury cruise ship with large windows looking out at the ocean. Lighting condition: ${lighting}. Ensure the perspective matches the subject."
  },
  {
    id: TemplateId.BG_BEACH,
    name: 'Tropical Beach',
    description: 'Sunny beach with turquoise water.',
    iconName: 'Sun',
    params: [
      { id: 'vibe', label: 'Vibe', type: 'select', defaultValue: 'relaxing', options: [
        { label: 'Relaxing', value: 'calm and relaxing' },
        { label: 'Party', value: 'vibrant beach party' },
        { label: 'Wild', value: 'wild tropical nature' }
      ]}
    ],
    systemPromptTemplate: "Replace the background with a beautiful tropical beach with turquoise water and white sand. Vibe: ${vibe}. Seamlessly blend the subject into the environment."
  },
  {
    id: TemplateId.BG_STADIUM,
    name: 'Sports Stadium',
    description: 'Crowded stadium with bright lights.',
    iconName: 'Trophy',
    params: [
      { id: 'crowd', label: 'Crowd Level', type: 'select', defaultValue: 'full', options: [
        { label: 'Packed Full', value: 'packed with cheering fans' },
        { label: 'Empty', value: 'completely empty grandstands' },
        { label: 'Blurry', value: 'bokeh blurred crowd' }
      ]}
    ],
    systemPromptTemplate: "Replace the background with a massive sports stadium. Crowd condition: ${crowd}. Use bright stadium floodlights for illumination."
  },
  {
    id: TemplateId.BG_NEON,
    name: 'Neon City',
    description: 'Futuristic cyberpunk city street.',
    iconName: 'Zap',
    params: [
      { id: 'color_theme', label: 'Color Theme', type: 'select', defaultValue: 'pink_blue', options: [
        { label: 'Pink & Blue', value: 'pink and blue neon lights' },
        { label: 'Green & Gold', value: 'matrix green and gold lights' },
        { label: 'Red & Black', value: 'intense red and black' }
      ]}
    ],
    systemPromptTemplate: "Replace the background with a futuristic cyberpunk city street at night. Color theme: ${color_theme}. Add reflections and glow to match the subject."
  },
  {
    id: TemplateId.BG_FOREST,
    name: 'Mystic Forest',
    description: 'Enchanted forest with soft light.',
    iconName: 'Mountain',
    params: [
      { id: 'season', label: 'Season', type: 'select', defaultValue: 'summer', options: [
        { label: 'Summer', value: 'green lush summer' },
        { label: 'Autumn', value: 'orange autumn leaves' },
        { label: 'Winter', value: 'snowy winter' },
        { label: 'Fantasy', value: 'glowing fantasy bio-luminescence' }
      ]}
    ],
    systemPromptTemplate: "Replace the background with a deep, mystic forest. Season/Style: ${season}. Add soft rays of light filtering through the trees."
  },
  
  // Existing Templates
  {
    id: TemplateId.CUSTOM,
    name: 'Custom Prompt',
    description: 'Describe any edit you want with a text instruction.',
    iconName: 'PenTool',
    params: [
      { id: 'custom_instruction', label: 'Instruction', type: 'textarea', defaultValue: 'Make the person hold a banana' }
    ],
    systemPromptTemplate: "Follow this image editing instruction exactly: ${custom_instruction}"
  },
  {
    id: TemplateId.BACKGROUND_CHANGE,
    name: 'Studio Background',
    description: 'Solid colors, background removal, or watermarks.',
    iconName: 'Palette',
    params: [
      { id: 'bg_action', label: 'Background Action', type: 'select', defaultValue: 'replace_color', options: [
        { label: 'Replace with Color', value: 'replace_color' },
        { label: 'Keep Original', value: 'keep_original' }
      ]},
      { id: 'color', label: 'Background Color', type: 'color', defaultValue: '#ffffff' },
      { id: 'use_watermark', label: 'Add Watermark?', type: 'select', defaultValue: 'no', options: [
        { label: 'No', value: 'no' },
        { label: 'Yes', value: 'yes' }
      ]},
      { id: 'watermark_text', label: 'Watermark Text', type: 'text', defaultValue: 'TuLu Studio' },
      { id: 'watermark_type', label: 'Watermark Style', type: 'select', defaultValue: 'brand', options: [
        { label: 'Brand Watermark', value: 'brand logo' },
        { label: 'Text Watermark', value: 'simple text' },
        { label: 'Pattern', value: 'repeated tiled pattern' },
        { label: 'Stamp', value: 'official stamp' }
      ]},
      { id: 'position', label: 'Position', type: 'select', defaultValue: 'bottom-right', options: [
        { label: 'Bottom Right', value: 'bottom-right' },
        { label: 'Bottom Left', value: 'bottom-left' },
        { label: 'Top Right', value: 'top-right' },
        { label: 'Top Left', value: 'top-left' },
        { label: 'Center', value: 'center' }
      ]},
      { id: 'opacity', label: 'Opacity', type: 'slider', defaultValue: 0.5, min: 0.1, max: 1, step: 0.1 }
    ],
    systemPromptTemplate: "Perform a background edit on the image. Background Mode: ${bg_action}. If mode is 'replace_color', remove the background and replace it with hex color ${color}. If mode is 'keep_original', do not change the background. Watermark: ${use_watermark}. If Watermark is 'yes', overlay a '${watermark_type}' with text '${watermark_text}' at ${position} with ${opacity} opacity. Ensure professional quality."
  },
  {
    id: TemplateId.PORTRAIT_RETOUCH,
    name: 'Portrait Retouch',
    description: 'Enhance smiles and smooth skin naturally.',
    iconName: 'Smile',
    params: [
      { id: 'smile_intensity', label: 'Smile Intensity', type: 'slider', defaultValue: 0.4, min: 0, max: 1, step: 0.1 },
      { id: 'smoothing', label: 'Skin Smoothing', type: 'slider', defaultValue: 0.3, min: 0, max: 1, step: 0.1 }
    ],
    systemPromptTemplate: "Detect the primary face. Apply a subtle smile with intensity ${smile_intensity} (0-1). Apply skin smoothing of ${smoothing} (0-1). STRICTLY preserve the person's identity and facial structure."
  },
  {
    id: TemplateId.MAKEUP_FILTER,
    name: 'Pro Makeup',
    description: 'Apply digital makeup foundation and lip tint.',
    iconName: 'Sparkles',
    params: [
      { id: 'foundation_strength', label: 'Foundation', type: 'slider', defaultValue: 0.3, min: 0, max: 1, step: 0.1 },
      { id: 'lip_tint', label: 'Lip Tint Color', type: 'color', defaultValue: '#C45A7A' },
      { id: 'lashes_boost', label: 'Lashes Boost', type: 'slider', defaultValue: 0.2, min: 0, max: 1, step: 0.1 }
    ],
    systemPromptTemplate: "Apply natural digital makeup. Foundation strength: ${foundation_strength}. Lip tint color: ${lip_tint}. Eyelash boost: ${lashes_boost}. Keep the look realistic."
  },
  {
    id: TemplateId.ARTISTIC_STYLE,
    name: 'Artistic Stylize',
    description: 'Transform image into different art styles.',
    iconName: 'Paintbrush',
    params: [
      { id: 'style', label: 'Art Style', type: 'select', defaultValue: 'watercolor', options: [
        { label: 'Watercolor', value: 'watercolor' },
        { label: 'Cyberpunk', value: 'cyberpunk' },
        { label: 'Oil Painting', value: 'oil painting' },
        { label: 'Sketch', value: 'pencil sketch' },
        { label: 'Vaporwave', value: 'vaporwave' }
      ]}
    ],
    systemPromptTemplate: "Stylize this image in a ${style} art style. Keep the main subject recognizable but transform the texture and lighting to match the style."
  },
  {
    id: TemplateId.OBJECT_REMOVE,
    name: 'Object Removal',
    description: 'Remove objects described by text.',
    iconName: 'Eraser',
    params: [
      { id: 'object_desc', label: 'What to remove?', type: 'text', defaultValue: 'sunglasses' },
      { id: 'fill_mode', label: 'Fill Mode', type: 'select', defaultValue: 'texture', options: [
        { label: 'Texture Aware', value: 'texture' },
        { label: 'Blur', value: 'blur' }
      ]}
    ],
    systemPromptTemplate: "Remove the ${object_desc} from the image. Inpaint the area using a ${fill_mode}-aware fill to match the surrounding background seamlessly."
  },
  {
    id: TemplateId.ADD_STICKER,
    name: 'Add Sticker',
    description: 'Place a graphical sticker on the image.',
    iconName: 'Sticker',
    params: [
      { id: 'sticker_type', label: 'Sticker Type', type: 'text', defaultValue: 'yellow smiley face' },
      { id: 'position', label: 'Position', type: 'select', defaultValue: 'top-left', options: [
        { label: 'Top Left', value: 'top-left' },
        { label: 'Top Right', value: 'top-right' },
        { label: 'Bottom Left', value: 'bottom-left' },
        { label: 'Bottom Right', value: 'bottom-right' }
      ]},
      { id: 'scale', label: 'Scale (%)', type: 'slider', defaultValue: 20, min: 5, max: 50, step: 5 }
    ],
    systemPromptTemplate: "Add a ${sticker_type} sticker at the ${position} of the image. Scale it to ${scale}% of the image size. Blend edges slightly and add a subtle drop shadow."
  }
];