export enum Category {
  CODING = 'Coding',
  WRITING = 'Writing',
  IMAGE = 'Image Generation',
  VIDEO = 'Video Generation',
  STUDIES = 'Studies & Research',
  MARKETING = 'Marketing',
  PRODUCTIVITY = 'Productivity'
}

export enum Platform {
  GEMINI = 'Gemini',
  OPENAI = 'OpenAI',
  ANTHROPIC = 'Anthropic',
  MIDJOURNEY = 'Midjourney',
  VEO = 'Veo',
  LEONARDO = 'Leonardo.ai'
}

export enum DeviceType {
  LAPTOP = 'Laptop',
  DESKTOP = 'Desktop',
  MOBILE = 'Mobile',
  OTHER = 'Other'
}

export interface RtcrosStructure {
  role: string;
  task: string;
  context: string;
  restrictions: string;
  output: string;
  style: string;
}

export interface PromptParameters {
  negativePrompt?: string;
  aspectRatio?: string;
  model?: string;
  temperature?: number;
  guidanceScale?: number;
  topP?: number;
  maxTokens?: number;
}

export interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string; // The full assembled prompt
  rtcros?: RtcrosStructure; // Optional breakdown
  category: Category;
  tags: Platform[];
  likes: number;
  parameters?: PromptParameters; // Optional model-specific parameters
}

export interface Secret {
  id: string;
  name: string;
  value: string;
  service: string;
  dateAdded: string;
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  category: string;
  note?: string;
  dateAdded: string;
}

export interface Project {
  id: string;
  name: string;
  backendUrl?: string; // e.g. Supabase
  repoUrl?: string;
  dockerInfo?: string; // Image or file location
  aiPlatform: Platform | string;
  device: DeviceType;
  otherDeviceName?: string;
  lastUpdated: string;
  isPushedToGit: boolean;
  isDeployed: boolean;
  notes?: string;
}