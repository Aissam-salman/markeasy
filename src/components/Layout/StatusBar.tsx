import React from 'react';
import { useEditorStore } from '../../store/editorStore';

export const StatusBar: React.FC = () => {
  const { lineCount, wordCount, charCount } = useEditorStore();

  return (
    <footer className="h-8 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 text-xs text-gray-600 dark:text-gray-400">
      <div className="flex items-center gap-4">
        <span>Lignes: {lineCount}</span>
        <span>Mots: {wordCount}</span>
        <span>Caractères: {charCount}</span>
      </div>

      <div className="flex items-center gap-2">
        <span>Markdown</span>
        <span>UTF-8</span>
      </div>
    </footer>
  );
};
