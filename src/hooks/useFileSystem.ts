import { useCallback } from 'react';
import { open, save } from '@tauri-apps/plugin-dialog';
import { readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';
import { useEditorStore } from '../store/editorStore';

export const useFileSystem = () => {
  const {
    content,
    setContent,
    setFilePath,
    setIsModified,
    resetEditor,
    filePath,
    addRecentFile
  } = useEditorStore();

  const openFile = useCallback(async () => {
    try {
      const selectedPath = await open({
        filters: [{
          name: 'Markdown',
          extensions: ['md', 'markdown', 'txt']
        }]
      });

      if (selectedPath && typeof selectedPath === 'string') {
        const fileContent = await readTextFile(selectedPath);
        setContent(fileContent);
        setFilePath(selectedPath);
        setIsModified(false);
        addRecentFile(selectedPath);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ouverture du fichier:', error);
    }
  }, [setContent, setFilePath, setIsModified]);

  const saveFile = useCallback(async () => {
    try {
      if (filePath) {
        await writeTextFile(filePath, content);
        setIsModified(false);
        return true;
      } else {
        return await saveFileAs();
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      return false;
    }
  }, [content, filePath, setIsModified]);

  const saveFileAs = useCallback(async () => {
    try {
      const selectedPath = await save({
        filters: [{
          name: 'Markdown',
          extensions: ['md']
        }],
        defaultPath: 'document.md'
      });

      if (selectedPath) {
        await writeTextFile(selectedPath, content);
        setFilePath(selectedPath);
        setIsModified(false);
        addRecentFile(selectedPath);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      return false;
    }
  }, [content, setFilePath, setIsModified, addRecentFile]);

  const openRecentFile = useCallback(async (path: string) => {
    try {
      const fileContent = await readTextFile(path);
      setContent(fileContent);
      setFilePath(path);
      setIsModified(false);
      addRecentFile(path);
    } catch (error) {
      console.error('Erreur lors de l\'ouverture du fichier récent:', error);
    }
  }, [setContent, setFilePath, setIsModified, addRecentFile]);

  const newFile = useCallback(() => {
    if (useEditorStore.getState().isModified) {
      const confirmed = window.confirm(
        'Vous avez des modifications non sauvegardées. Voulez-vous continuer ?'
      );
      if (!confirmed) return;
    }
    resetEditor();
  }, [resetEditor]);

  return {
    openFile,
    saveFile,
    saveFileAs,
    newFile,
    openRecentFile
  };
};
