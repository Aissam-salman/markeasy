import React, { useMemo } from 'react';
import { useEditorStore } from '../../store/editorStore';
import { renderMarkdown } from '../../utils/markdown';
import '../../styles/markdown.css';

interface MarkdownPreviewProps {
  className?: string;
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({
  className = ''
}) => {
  const { content } = useEditorStore();

  const htmlContent = useMemo(() => {
    return renderMarkdown(content);
  }, [content]);

  return (
    <div
      id="markdown-preview-export"
      className={`markdown-preview prose dark:prose-invert max-w-none p-6 overflow-auto ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};
