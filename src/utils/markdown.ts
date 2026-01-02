import { marked } from 'marked';
import DOMPurify from 'dompurify';

// Configuration de marked avec GFM pour supporter les task lists nativement
marked.setOptions({
  breaks: true,
  gfm: true,
});

/**
 * Convertit le Markdown en HTML sécurisé
 */
export const renderMarkdown = (markdown: string): string => {
  try {
    const rawHtml = marked(markdown) as string;
    const cleanHtml = DOMPurify.sanitize(rawHtml, {
      ALLOWED_TAGS: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'br', 'hr',
        'strong', 'em', 'del', 'code', 'pre',
        'ul', 'ol', 'li',
        'blockquote',
        'a', 'img',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'div', 'span',
        'input',
      ],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'type', 'checked', 'disabled'],
    });
    return cleanHtml;
  } catch (error) {
    console.error('Erreur lors du rendu Markdown:', error);
    return '<p>Erreur lors du rendu du contenu</p>';
  }
};

/**
 * Insère du texte autour de la sélection
 */
export const wrapSelection = (
  textarea: HTMLTextAreaElement,
  before: string,
  after: string
): void => {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = textarea.value.substring(start, end);
  const newText = before + selectedText + after;

  textarea.setRangeText(newText, start, end, 'select');
  textarea.focus();
};

/**
 * Insère du texte Markdown formaté
 */
export const insertMarkdown = {
  bold: (textarea: HTMLTextAreaElement) => wrapSelection(textarea, '**', '**'),
  italic: (textarea: HTMLTextAreaElement) => wrapSelection(textarea, '_', '_'),
  strikethrough: (textarea: HTMLTextAreaElement) => wrapSelection(textarea, '~~', '~~'),
  code: (textarea: HTMLTextAreaElement) => wrapSelection(textarea, '`', '`'),

  link: (textarea: HTMLTextAreaElement) => {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const linkText = selectedText || 'texte du lien';
    const newText = `[${linkText}](url)`;
    textarea.setRangeText(newText, start, end, 'select');
    textarea.focus();
  },

  image: (textarea: HTMLTextAreaElement) => {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const altText = selectedText || 'description';
    const newText = `![${altText}](url-image)`;
    textarea.setRangeText(newText, start, end, 'select');
    textarea.focus();
  },

  heading: (textarea: HTMLTextAreaElement, level: number) => {
    const hashes = '#'.repeat(level);
    wrapSelection(textarea, `${hashes} `, '');
  },
};
