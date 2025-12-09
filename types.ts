export enum TemplateId {
  BACKGROUND_CHANGE = 'background_change_marketing',
  PORTRAIT_RETOUCH = 'portrait_smile_retouch',
  MAKEUP_FILTER = 'makeup_filter_social',
  ARTISTIC_STYLE = 'stylize_artistic',
  OBJECT_REMOVE = 'remove_object_fill',
  ADD_STICKER = 'add_smiley_sticker',
  CUSTOM = 'custom_edit',
  
  // New Background Scenarios
  BG_SHIP = 'bg_ship_luxury',
  BG_BEACH = 'bg_beach_tropical',
  BG_STADIUM = 'bg_stadium_sports',
  BG_NEON = 'bg_neon_city',
  BG_FOREST = 'bg_forest_nature',
}

export type ParamValue = string | number | boolean;

export interface TemplateParam {
  id: string;
  label: string;
  type: 'color' | 'slider' | 'select' | 'text' | 'textarea';
  defaultValue: ParamValue;
  options?: { label: string; value: string }[]; // For select inputs
  min?: number;
  max?: number;
  step?: number;
}

export interface EditTemplate {
  id: TemplateId;
  name: string;
  description: string;
  iconName: string;
  params: TemplateParam[];
  systemPromptTemplate: string; // The base instruction for the AI
}

export interface LibraryItem {
  id: string;
  type: 'draft' | 'saved';
  imageData: string; // Base64
  timestamp: number;
}

export interface AppState {
  originalImage: string | null; // Base64 (Current working image)
  generatedImage: string | null; // Base64 (Preview of most recent edit)
  selectedTemplateId: TemplateId;
  paramValues: Record<string, ParamValue>;
  isProcessing: boolean;
  error: string | null;
  history: string[]; // History of "originalImage" states
  historyIndex: number; // Current position in history
  
  // Library State
  library: LibraryItem[];
  viewMode: 'editor' | 'library';
}