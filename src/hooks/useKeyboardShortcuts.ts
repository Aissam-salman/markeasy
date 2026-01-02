import { useEffect } from 'react';

interface KeyboardShortcuts {
  onNew?: () => void;
  onOpen?: () => void;
  onSave?: () => void;
  onSaveAs?: () => void;
  onToggleView?: () => void;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcuts) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt+N - Nouveau fichier
      if (e.altKey && e.key === 'n') {
        e.preventDefault();
        shortcuts.onNew?.();
      }

      // Alt+O - Ouvrir
      if (e.altKey && e.key === 'o') {
        e.preventDefault();
        shortcuts.onOpen?.();
      }

      // Alt+S - Sauvegarder
      if (e.altKey && e.key === 's') {
        e.preventDefault();
        shortcuts.onSave?.();
      }

      // Alt+Shift+S - Sauvegarder sous
      if (e.altKey && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        shortcuts.onSaveAs?.();
      }

      // Alt+/ - Toggle view mode
      if (e.altKey && e.key === '/') {
        e.preventDefault();
        shortcuts.onToggleView?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);
};
