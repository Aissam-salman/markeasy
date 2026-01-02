import React from 'react';
import {
  FileText,
  FolderOpen,
  Save,
  Sun,
  Moon,
  Eye,
  Code,
  Columns
} from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';

interface HeaderProps {
  onNew: () => void;
  onOpen: () => void;
  onSave: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNew, onOpen, onSave }) => {
  const { theme, toggleTheme, viewMode, setViewMode, filePath, isModified } = useEditorStore();

  return (
    <header className="h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <span className="font-semibold text-lg text-gray-800 dark:text-gray-100">
          MarkEasy
        </span>
        {filePath && (
          <span className="text-sm text-gray-600 dark:text-gray-400 ml-4">
            {filePath.split('/').pop()}
            {isModified && <span className="text-orange-500 ml-1">●</span>}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Boutons de fichier */}
        <button
          onClick={onNew}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Nouveau fichier (Ctrl+N)"
        >
          <FileText className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        <button
          onClick={onOpen}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Ouvrir (Ctrl+O)"
        >
          <FolderOpen className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        <button
          onClick={onSave}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Sauvegarder (Ctrl+S)"
        >
          <Save className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />

        {/* Mode d'affichage */}
        <div className="flex gap-1">
          <button
            onClick={() => setViewMode('source')}
            className={`p-2 rounded transition-colors ${
              viewMode === 'source'
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
            title="Mode Source"
          >
            <Code className="w-5 h-5" />
          </button>

          <button
            onClick={() => setViewMode('split')}
            className={`p-2 rounded transition-colors ${
              viewMode === 'split'
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
            title="Mode Hybride"
          >
            <Columns className="w-5 h-5" />
          </button>

          <button
            onClick={() => setViewMode('preview')}
            className={`p-2 rounded transition-colors ${
              viewMode === 'preview'
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
            title="Mode Prévisualisation"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />

        {/* Toggle thème */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Changer le thème"
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          ) : (
            <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          )}
        </button>
      </div>
    </header>
  );
};
