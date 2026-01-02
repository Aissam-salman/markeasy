import React, { useCallback, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { EditorView } from '@codemirror/view';
import { useEditorStore } from '../../store/editorStore';
import { vim, Vim } from '@replit/codemirror-vim';

interface MarkdownEditorProps {
  className?: string;
  onSave?: () => void;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  className = '',
  onSave
}) => {
  const { content, setContent, vimMode } = useEditorStore();

  // Configurer la commande :w pour sauvegarder
  useEffect(() => {
    if (vimMode && onSave) {
      Vim.defineEx('write', 'w', () => {
        onSave();
      });
      Vim.defineEx('wq', 'wq', () => {
        onSave();
      });
    }
  }, [vimMode, onSave]);

  const handleChange = useCallback((value: string) => {
    setContent(value);
  }, [setContent]);

  const extensions = [
    markdown(),
    EditorView.lineWrapping,
    ...(vimMode ? [vim()] : []),
    EditorView.theme({
      '&': {
        outline: 'none !important',
      },
      '&.cm-editor.cm-focused': {
        outline: 'none !important',
        border: 'none !important',
      },
      '.cm-scroller': {
        outline: 'none !important',
      },
      '.cm-content': {
        outline: 'none !important',
      }
    })
  ];

  return (
    <div className={`h-full ${className}`}>
      <CodeMirror
        value={content}
        height="100%"
        theme="light"
        extensions={extensions}
        onChange={handleChange}
        basicSetup={{
          lineNumbers: false,
          highlightActiveLineGutter: false,
          highlightSpecialChars: false,
          foldGutter: false,
          drawSelection: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          bracketMatching: false,
          closeBrackets: true,
          autocompletion: false,
          rectangularSelection: false,
          crosshairCursor: false,
          highlightActiveLine: false,
          highlightSelectionMatches: false,
          closeBracketsKeymap: true,
          searchKeymap: true,
          foldKeymap: false,
          completionKeymap: false,
          lintKeymap: false,
        }}
        style={{
          fontSize: '16px',
          fontFamily: 'Virgil, "Cascadia Code", "Segoe UI Emoji", sans-serif',
        }}
        className="h-full"
      />
    </div>
  );
};
