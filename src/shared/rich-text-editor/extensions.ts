import { generateHTML, JSONContent, mergeAttributes, Node } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
} from '@tiptap/extension-table';
import Placeholder from '@tiptap/extension-placeholder';
import { Markdown } from '@tiptap/markdown';

function renderAsHTML(node: JSONContent) {
  return generateHTML({ type: 'doc', content: [node] }, richTextExtensions());
}

// Existing descriptions contain figures and captions produced by CKEditor.
const Caption = Node.create({
  name: 'figureCaption',
  content: 'inline*',
  parseHTML: () => [{ tag: 'figcaption' }],
  renderHTML: () => ['figcaption', 0],
  renderMarkdown: renderAsHTML,
});

const ImageFigure = Node.create({
  name: 'imageFigure',
  group: 'block',
  content: 'image figureCaption?',
  draggable: true,
  addAttributes: () => ({
    class: { default: 'image' },
    width: {
      default: null,
      parseHTML: element => element.style.width || null,
      renderHTML: attrs =>
        attrs.width ? { style: `width: ${attrs.width}` } : {},
    },
  }),
  parseHTML: () => [{ tag: 'figure.image' }],
  renderHTML: ({ HTMLAttributes }) => ['figure', HTMLAttributes, 0],
  renderMarkdown: renderAsHTML,
});

const MediaFigure = Node.create({
  name: 'mediaFigure',
  group: 'block',
  atom: true,
  addAttributes: () => ({
    url: {
      default: '',
      parseHTML: element =>
        element.getAttribute('url') ||
        element.querySelector('oembed')?.getAttribute('url') ||
        '',
      rendered: false,
    },
  }),
  parseHTML: () => [{ tag: 'figure.media' }, { tag: 'oembed' }],
  renderHTML: ({ node }) => [
    'figure',
    { class: 'media' },
    ['oembed', { url: node.attrs.url }],
  ],
  renderMarkdown: renderAsHTML,
  addNodeView:
    () =>
    ({ node }) => {
      const dom = document.createElement('div');
      dom.className = 'sw-rich-text-media';
      dom.textContent = `Видео: ${node.attrs.url}`;
      return { dom };
    },
});

const CompatibleTable = Table.extend({
  renderMarkdown(node, helpers, context) {
    const complex = node.content?.some(row =>
      row.content?.some(
        cell =>
          Number(cell.attrs?.colspan || 1) > 1 ||
          Number(cell.attrs?.rowspan || 1) > 1 ||
          (cell.content?.length || 0) > 1,
      ),
    );
    return complex ? renderAsHTML(node) : this.parent!(node, helpers, context);
  },
});

export function richTextExtensions() {
  return [
    StarterKit.configure({
      trailingNode: false,
      link: { openOnClick: false, defaultProtocol: 'https' },
    }),
    Image.configure({ allowBase64: true }),
    Caption,
    ImageFigure,
    MediaFigure,
    CompatibleTable.configure({ resizable: false }),
    TableRow,
    TableHeader,
    TableCell,
    Placeholder.configure({
      placeholder: 'Напишите описание карточки, добавьте примеры и пояснения…',
    }),
    Markdown,
  ];
}

export function validEditorURL(value: string, image = false) {
  const url = value.trim();
  if (!url) return false;
  if (url.startsWith('/') && !url.startsWith('//')) return true;
  try {
    const parsed = new URL(url);
    return ['http:', 'https:', ...(image ? [] : ['mailto:', 'tel:'])].includes(
      parsed.protocol,
    );
  } catch {
    return false;
  }
}
