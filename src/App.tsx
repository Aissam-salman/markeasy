import { useEffect, useState } from 'react';
import { MarkdownEditor } from './components/Editor/MarkdownEditor';
import { MarkdownPreview } from './components/Preview/MarkdownPreview';
import { useEditorStore } from './store/editorStore';
import { useFileSystem } from './hooks/useFileSystem';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { exportToPdf } from './utils/exportPdf';
import {
  FileText,
  FolderOpen,
  Save,
  Eye,
  Code,
  Columns,
  Menu,
  X,
  Minus,
  Square,
  Maximize2,
  Clock,
  Trash2,
  Download
} from 'lucide-react';

function App() {
  const { viewMode, isModified, filePath, vimMode, toggleVimMode, recentFiles, clearRecentFiles } = useEditorStore();
  const { openFile, saveFile, saveFileAs, newFile, openRecentFile } = useFileSystem();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  // Configurer les raccourcis clavier
  useKeyboardShortcuts({
    onNew: newFile,
    onOpen: openFile,
    onSave: saveFile,
    onSaveAs: saveFileAs,
    onToggleView: () => {
      const modes = ['source', 'split', 'preview'] as const;
      const currentIndex = modes.indexOf(viewMode);
      const nextMode = modes[(currentIndex + 1) % modes.length];
      useEditorStore.setState({ viewMode: nextMode });
    },
  });

  // Empêcher la fermeture accidentelle avec des modifications non sauvegardées
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (useEditorStore.getState().isModified) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Fonctions de contrôle de la fenêtre
  const handleMinimize = async () => {
    await getCurrentWindow().minimize();
  };

  const handleMaximize = async () => {
    const window = getCurrentWindow();
    const maximized = await window.isMaximized();
    if (maximized) {
      await window.unmaximize();
      setIsMaximized(false);
    } else {
      await window.maximize();
      setIsMaximized(true);
    }
  };

  const handleClose = async () => {
    await getCurrentWindow().close();
  };

  const handleExportPdf = async () => {
    console.log('Export PDF démarré...');
    console.log('Mode actuel:', viewMode);
    
    // Passer en mode split si on est en mode source pour que le preview existe
    if (viewMode === 'source') {
      console.log('Passage en mode split pour l\'export...');
      useEditorStore.setState({ viewMode: 'split' });
      // Attendre un peu que le DOM se mette à jour
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    try {
      const previewElement = document.getElementById('markdown-preview-export');
      console.log('Preview element:', previewElement);
      if (!previewElement) {
        console.error('Preview element non trouvé après changement de mode');
        return;
      }

      const fileName = filePath
        ? filePath.split('/').pop()?.replace(/\.md$/, '.pdf') || 'document.pdf'
        : 'document.pdf';

      console.log('Nom du fichier:', fileName);
      await exportToPdf(previewElement, fileName);
      console.log('Export PDF terminé avec succès!');
    } catch (error) {
      console.error('Erreur export PDF:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Title bar personnalisée avec drag region */}
      <div
        data-tauri-drag-region
        className="h-10 bg-white border-b border-gray-200 flex items-center justify-between px-4 select-none"
      >
        <div className="flex items-center gap-2 flex-1">
          {filePath ? (
            <span className="text-sm text-gray-600">
              {filePath}
              {isModified && <span className="text-orange-500 ml-2">●</span>}
            </span>
          ) : (
            <span className="text-sm text-gray-400">Sans titre</span>
          )}
        </div>

        {/* Menu hamburger à droite */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded hover:bg-gray-100 transition-colors"
            title="Menu"
          >
            {menuOpen ? (
              <X className="w-4 h-4 text-gray-600" />
            ) : (
              <Menu className="w-4 h-4 text-gray-600" />
            )}
          </button>

          {/* Séparateur */}
          <div className="w-px h-4 bg-gray-300" />

          {/* Boutons de contrôle de fenêtre */}
          <button
            onClick={handleMinimize}
            className="p-1.5 rounded hover:bg-gray-100 transition-colors"
            title="Minimize"
          >
            <Minus className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={handleMaximize}
            className="p-1.5 rounded hover:bg-gray-100 transition-colors"
            title="Maximize"
          >
            {isMaximized ? (
              <Square className="w-3.5 h-3.5 text-gray-600" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5 text-gray-600" />
            )}
          </button>
          <button
            onClick={handleClose}
            className="p-1.5 rounded hover:bg-red-100 transition-colors group"
            title="Close"
          >
            <X className="w-4 h-4 text-gray-600 group-hover:text-red-600" />
          </button>
        </div>
      </div>

      {/* Menu dropdown (style Excalidraw) */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute top-12 right-4 z-50 w-56 bg-white rounded-xl border border-gray-200 shadow-xl py-1">
            <div className="px-3 py-1.5 text-[10px] font-semibold text-gray-500 uppercase">
              Fichier
            </div>
            <button
              onClick={() => { newFile(); setMenuOpen(false); }}
              className="w-full px-3 py-1.5 text-left hover:bg-gray-50 flex items-center gap-2 text-xs text-gray-700"
            >
              <FileText className="w-3.5 h-3.5" />
              Nouveau
              <span className="ml-auto text-[10px] text-gray-400">Alt+N</span>
            </button>
            <button
              onClick={() => { openFile(); setMenuOpen(false); }}
              className="w-full px-3 py-1.5 text-left hover:bg-gray-50 flex items-center gap-2 text-xs text-gray-700"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              Ouvrir
              <span className="ml-auto text-[10px] text-gray-400">Alt+O</span>
            </button>
            <button
              onClick={() => { saveFile(); setMenuOpen(false); }}
              className="w-full px-3 py-1.5 text-left hover:bg-gray-50 flex items-center gap-2 text-xs text-gray-700"
            >
              <Save className="w-3.5 h-3.5" />
              Sauvegarder
              <span className="ml-auto text-[10px] text-gray-400">Alt+S</span>
            </button>
            <button
              onClick={async () => {
                console.log('Bouton cliqué!');
                await handleExportPdf();
                setMenuOpen(false);
              }}
              className="w-full px-3 py-1.5 text-left hover:bg-gray-50 flex items-center gap-2 text-xs text-gray-700"
            >
              <Download className="w-3.5 h-3.5" />
              Export PDF
            </button>

            {/* Fichiers récents */}
            {recentFiles.length > 0 && (
              <>
                <div className="my-1 h-px bg-gray-200" />

                <div className="px-3 py-1.5 flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-gray-500 uppercase">
                    Récents
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearRecentFiles();
                    }}
                    className="p-0.5 hover:bg-gray-100 rounded transition-colors"
                    title="Effacer l'historique"
                  >
                    <Trash2 className="w-2.5 h-2.5 text-gray-400" />
                  </button>
                </div>

                <div className="max-h-48 overflow-y-auto">
                  {recentFiles.map((file) => (
                    <button
                      key={file.path}
                      onClick={() => {
                        openRecentFile(file.path);
                        setMenuOpen(false);
                      }}
                      className="w-full px-3 py-1.5 text-left hover:bg-gray-50 flex items-center gap-2 text-xs text-gray-700 group"
                      title={file.path}
                    >
                      <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate flex-1">{file.name}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="my-1 h-px bg-gray-200" />

            <div className="px-3 py-1.5 text-[10px] font-semibold text-gray-500 uppercase">
              Affichage
            </div>
            <button
              onClick={() => { useEditorStore.setState({ viewMode: 'source' }); setMenuOpen(false); }}
              className={`w-full px-3 py-1.5 text-left hover:bg-gray-50 flex items-center gap-2 text-xs ${
                viewMode === 'source' ? 'text-blue-600 font-medium' : 'text-gray-700'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              Source
            </button>
            <button
              onClick={() => { useEditorStore.setState({ viewMode: 'split' }); setMenuOpen(false); }}
              className={`w-full px-3 py-1.5 text-left hover:bg-gray-50 flex items-center gap-2 text-xs ${
                viewMode === 'split' ? 'text-blue-600 font-medium' : 'text-gray-700'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              Split
            </button>
            <button
              onClick={() => { useEditorStore.setState({ viewMode: 'preview' }); setMenuOpen(false); }}
              className={`w-full px-3 py-1.5 text-left hover:bg-gray-50 flex items-center gap-2 text-xs ${
                viewMode === 'preview' ? 'text-blue-600 font-medium' : 'text-gray-700'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Preview
            </button>

            <div className="my-1 h-px bg-gray-200" />

            <div className="px-3 py-1.5 text-[10px] font-semibold text-gray-500 uppercase">
              Éditeur
            </div>
            <button
              onClick={() => { toggleVimMode(); setMenuOpen(false); }}
              className="w-full px-3 py-1.5 text-left hover:bg-gray-50 flex items-center gap-2 text-xs text-gray-700"
            >
              <Code className="w-3.5 h-3.5" />
              Vim
              <span className={`ml-auto text-[10px] ${vimMode ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
                {vimMode ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>
        </>
      )}

      {/* Zone d'édition principale */}
      <main className="flex-1 overflow-hidden pt-4 pl-8">
        <div className="h-full">
          {viewMode === 'source' && (
            <MarkdownEditor className="h-full" onSave={saveFile} />
          )}

          {viewMode === 'split' && (
            <div className="h-full flex">
              <div className="w-1/2 border-r border-gray-200">
                <MarkdownEditor className="h-full" onSave={saveFile} />
              </div>
              <div className="w-1/2 overflow-auto">
                <MarkdownPreview className="h-full" />
              </div>
            </div>
          )}

          {viewMode === 'preview' && (
            <div className="h-full overflow-auto">
              <MarkdownPreview className="h-full" />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
