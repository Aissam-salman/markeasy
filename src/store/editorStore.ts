import { create } from 'zustand';

export type ViewMode = 'source' | 'split' | 'preview';
export type Theme = 'light' | 'dark';

interface RecentFile {
  path: string;
  name: string;
  lastOpened: number;
}

interface EditorState {
  // Contenu et fichier
  content: string;
  filePath: string | null;
  isModified: boolean;
  recentFiles: RecentFile[];

  // Modes d'affichage
  viewMode: ViewMode;
  theme: Theme;
  vimMode: boolean;

  // Stats
  lineCount: number;
  wordCount: number;
  charCount: number;

  // Actions
  setContent: (content: string) => void;
  setFilePath: (path: string | null) => void;
  setIsModified: (modified: boolean) => void;
  setViewMode: (mode: ViewMode) => void;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  toggleVimMode: () => void;
  updateStats: (content: string) => void;
  resetEditor: () => void;
  addRecentFile: (path: string) => void;
  clearRecentFiles: () => void;
}

const calculateStats = (content: string) => {
  const lines = content.split('\n').length;
  const words = content.trim() ? content.trim().split(/\s+/).length : 0;
  const chars = content.length;

  return { lineCount: lines, wordCount: words, charCount: chars };
};

// Charger les fichiers récents depuis localStorage
const loadRecentFiles = (): RecentFile[] => {
  try {
    const stored = localStorage.getItem('markeasy-recent-files');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Sauvegarder les fichiers récents dans localStorage
const saveRecentFiles = (files: RecentFile[]) => {
  try {
    localStorage.setItem('markeasy-recent-files', JSON.stringify(files));
  } catch (e) {
    console.error('Erreur lors de la sauvegarde des fichiers récents:', e);
  }
};

export const useEditorStore = create<EditorState>((set) => ({
  // État initial
  content: '',
  filePath: null,
  isModified: false,
  recentFiles: loadRecentFiles(),
  viewMode: 'source',
  theme: 'light',
  vimMode: false,
  lineCount: 0,
  wordCount: 0,
  charCount: 0,

  // Actions
  setContent: (content) => {
    const stats = calculateStats(content);
    set({ content, isModified: true, ...stats });
  },

  setFilePath: (path) => set({ filePath: path }),

  setIsModified: (modified) => set({ isModified: modified }),

  setViewMode: (mode) => set({ viewMode: mode }),

  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    // Mettre à jour la classe sur le document
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { theme: newTheme };
  }),

  setTheme: (theme) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ theme });
  },

  toggleVimMode: () => set((state) => ({ vimMode: !state.vimMode })),

  updateStats: (content) => {
    const stats = calculateStats(content);
    set(stats);
  },

  resetEditor: () => set({
    content: '',
    filePath: null,
    isModified: false,
    lineCount: 0,
    wordCount: 0,
    charCount: 0,
  }),

  addRecentFile: (path: string) => set((state) => {
    const name = path.split('/').pop() || path;
    const newFile: RecentFile = {
      path,
      name,
      lastOpened: Date.now(),
    };

    // Filtrer les doublons et ajouter le nouveau fichier en premier
    const filtered = state.recentFiles.filter(f => f.path !== path);
    const updated = [newFile, ...filtered].slice(0, 10); // Garder max 10 fichiers

    saveRecentFiles(updated);
    return { recentFiles: updated };
  }),

  clearRecentFiles: () => {
    saveRecentFiles([]);
    set({ recentFiles: [] });
  },
}));
