
export interface Sticker {
  id: string;
  originalImage?: string; // Optional because we strip this in persistent storage to save space
  stickerImage: string;
  prompt: string;
  createdAt: number;
}

export interface AppState {
  stickers: Sticker[];
  isGenerating: boolean;
  currentSticker: Sticker | null;
  error: string | null;
}

export enum View {
  HOME = 'home',
  CREATE = 'create',
  GALLERY = 'gallery',
  PROFILE = 'profile'
}
