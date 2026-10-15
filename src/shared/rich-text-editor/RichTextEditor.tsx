import React, { useEffect, useId, useRef, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from '@mui/material';
import FormatBold from '@mui/icons-material/FormatBold';
import FormatItalic from '@mui/icons-material/FormatItalic';
import FormatUnderlined from '@mui/icons-material/FormatUnderlined';
import FormatListBulleted from '@mui/icons-material/FormatListBulleted';
import FormatListNumbered from '@mui/icons-material/FormatListNumbered';
import FormatQuote from '@mui/icons-material/FormatQuote';
import Code from '@mui/icons-material/Code';
import LinkIcon from '@mui/icons-material/Link';
import ImageOutlined from '@mui/icons-material/ImageOutlined';
import TableChartOutlined from '@mui/icons-material/TableChartOutlined';
import Undo from '@mui/icons-material/Undo';
import Redo from '@mui/icons-material/Redo';
import { richTextExtensions, validEditorURL } from './extensions';
import './rich-text-editor.css';

type Mode = 'visual' | 'markdown' | 'html';
type Props = {
  value: string;
  onChange: (html: string) => void;
  visualOnly?: boolean;
};

export default function RichTextEditor({
  value,
  onChange,
  visualOnly = false,
}: Props) {
  const id = useId();
  const [selectedMode, setMode] = useState<Mode>('visual');
  const mode = visualOnly ? 'visual' : selectedMode;
  const [source, setSource] = useState('');
  const [dialog, setDialog] = useState<'link' | 'image' | null>(null);
  const [url, setURL] = useState('');
  const [alt, setAlt] = useState('');
  const [invalidURL, setInvalidURL] = useState(false);
  const lastValue = useRef(value);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const editor = useEditor({
    extensions: richTextExtensions(),
    content: value,
    shouldRerenderOnTransaction: true,
    editorProps: {
      attributes: {
        class: 'sw-rich-text-document',
        role: 'textbox',
        'aria-label': 'Описание карточки',
        'aria-multiline': 'true',
      },
    },
    onUpdate: ({ editor: current }) => {
      const html = current.isEmpty ? '' : current.getHTML();
      lastValue.current = html;
      onChangeRef.current(html);
    },
  });

  useEffect(() => {
    if (!editor || value === lastValue.current) return;
    lastValue.current = value;
    editor.commands.setContent(value, { emitUpdate: false });
    setSource(mode === 'markdown' ? editor.getMarkdown() : value);
  }, [editor, value, mode]);

  function changeMode(next: Mode | null) {
    if (visualOnly || !next || !editor || next === mode) return;
    // Viewing another representation never rewrites the saved HTML.
    setSource(next === 'markdown' ? editor.getMarkdown() : lastValue.current);
    setMode(next);
  }

  function changeSource(next: string) {
    if (!editor) return;
    setSource(next);
    editor.commands.setContent(next, {
      contentType: mode === 'markdown' ? 'markdown' : 'html',
      emitUpdate: false,
    });
    const html = editor.isEmpty ? '' : editor.getHTML();
    lastValue.current = html;
    onChangeRef.current(html);
  }

  function openInsert(kind: 'link' | 'image') {
    setURL(kind === 'link' ? editor?.getAttributes('link').href || '' : '');
    setAlt('');
    setInvalidURL(false);
    setDialog(kind);
  }

  function insertURL(event: React.FormEvent) {
    event.preventDefault();
    if (!editor) return;
    if (dialog === 'link' && !url.trim()) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      if (!validEditorURL(url, dialog === 'image')) {
        setInvalidURL(true);
        return;
      }
      if (dialog === 'image')
        editor.chain().focus().setImage({ src: url.trim(), alt }).run();
      else if (editor.state.selection.empty && !editor.isActive('link')) {
        editor
          .chain()
          .focus()
          .insertContent({
            type: 'text',
            text: url.trim(),
            marks: [{ type: 'link', attrs: { href: url.trim() } }],
          })
          .run();
      } else
        editor
          .chain()
          .focus()
          .extendMarkRange('link')
          .setLink({ href: url.trim() })
          .run();
    }
    setDialog(null);
  }

  function tool(
    label: string,
    icon: React.ReactNode,
    action: () => void,
    active = false,
    disabled = false,
  ) {
    return (
      <Tooltip title={label} key={label}>
        <span>
          <IconButton
            aria-label={label}
            aria-pressed={active}
            size="small"
            disabled={!editor || disabled}
            onMouseDown={event => event.preventDefault()}
            onClick={action}
          >
            {icon}
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  return (
    <div className="sw-rich-text">
      <div className="sw-rich-text-frame">
        {!visualOnly && (
          <div className="sw-rich-text-modes">
            <ToggleButtonGroup
              size="small"
              exclusive
              value={mode}
              onChange={(_, next) => changeMode(next)}
              aria-label="Режим редактора"
            >
              <ToggleButton value="visual">Визуальный</ToggleButton>
              <ToggleButton value="markdown">Markdown</ToggleButton>
              <ToggleButton value="html">HTML</ToggleButton>
            </ToggleButtonGroup>
          </div>
        )}
        <div hidden={mode !== 'visual'}>
          <div
            className="sw-rich-text-toolbar"
            role="toolbar"
            aria-label="Форматирование текста"
          >
            <Select
              size="small"
              value={
                editor?.isActive('heading')
                  ? editor.getAttributes('heading').level
                  : 0
              }
              inputProps={{ 'aria-label': 'Стиль текста' }}
              disabled={!editor}
              onChange={event => {
                const level = Number(event.target.value);
                if (level)
                  editor
                    ?.chain()
                    .focus()
                    .setHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 })
                    .run();
                else editor?.chain().focus().setParagraph().run();
              }}
            >
              <MenuItem value={0}>Обычный текст</MenuItem>
              <MenuItem value={1}>Заголовок 1</MenuItem>
              <MenuItem value={2}>Заголовок 2</MenuItem>
              <MenuItem value={3}>Заголовок 3</MenuItem>
              <MenuItem value={4}>Заголовок 4</MenuItem>
              <MenuItem value={5}>Заголовок 5</MenuItem>
              <MenuItem value={6}>Заголовок 6</MenuItem>
            </Select>
            {tool(
              'Жирный',
              <FormatBold />,
              () => editor?.chain().focus().toggleBold().run(),
              editor?.isActive('bold'),
            )}
            {tool(
              'Курсив',
              <FormatItalic />,
              () => editor?.chain().focus().toggleItalic().run(),
              editor?.isActive('italic'),
            )}
            {tool(
              'Подчёркнутый',
              <FormatUnderlined />,
              () => editor?.chain().focus().toggleUnderline().run(),
              editor?.isActive('underline'),
            )}
            {tool(
              'Маркированный список',
              <FormatListBulleted />,
              () => editor?.chain().focus().toggleBulletList().run(),
              editor?.isActive('bulletList'),
            )}
            {tool(
              'Нумерованный список',
              <FormatListNumbered />,
              () => editor?.chain().focus().toggleOrderedList().run(),
              editor?.isActive('orderedList'),
            )}
            {tool(
              'Цитата',
              <FormatQuote />,
              () => editor?.chain().focus().toggleBlockquote().run(),
              editor?.isActive('blockquote'),
            )}
            {tool(
              'Блок кода',
              <Code />,
              () => editor?.chain().focus().toggleCodeBlock().run(),
              editor?.isActive('codeBlock'),
            )}
            {tool(
              'Ссылка',
              <LinkIcon />,
              () => openInsert('link'),
              editor?.isActive('link'),
            )}
            {tool('Изображение по ссылке', <ImageOutlined />, () =>
              openInsert('image'),
            )}
            {tool('Вставить таблицу', <TableChartOutlined />, () =>
              editor
                ?.chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run(),
            )}
            {tool(
              'Отменить',
              <Undo />,
              () => editor?.chain().focus().undo().run(),
              false,
              !editor?.can().undo(),
            )}
            {tool(
              'Повторить',
              <Redo />,
              () => editor?.chain().focus().redo().run(),
              false,
              !editor?.can().redo(),
            )}
            {editor?.isActive('table') && (
              <div className="sw-rich-text-table-actions">
                <Button
                  size="small"
                  onClick={() => editor.chain().focus().addRowAfter().run()}
                >
                  + Строка
                </Button>
                <Button
                  size="small"
                  onClick={() => editor.chain().focus().addColumnAfter().run()}
                >
                  + Столбец
                </Button>
                <Button
                  size="small"
                  onClick={() => editor.chain().focus().deleteRow().run()}
                >
                  Удалить строку
                </Button>
                <Button
                  size="small"
                  onClick={() => editor.chain().focus().deleteColumn().run()}
                >
                  Удалить столбец
                </Button>
                <Button
                  size="small"
                  onClick={() => editor.chain().focus().deleteTable().run()}
                >
                  Удалить таблицу
                </Button>
              </div>
            )}
          </div>
          <EditorContent editor={editor} />
        </div>
        {mode !== 'visual' && (
          <div className="sw-rich-text-source">
            <label htmlFor={id}>
              {mode === 'markdown'
                ? 'Исходный текст Markdown'
                : 'Исходный код HTML'}
            </label>
            <textarea
              id={id}
              value={source}
              onChange={event => changeSource(event.target.value)}
              spellCheck={false}
            />
          </div>
        )}
      </div>
      {!visualOnly && (
        <p className="sw-cedit-field-note">
          {mode === 'visual'
            ? 'Вставить текст без исходного оформления: Ctrl + Shift + V.'
            : mode === 'markdown'
              ? 'Поддерживаются заголовки, списки, ссылки, изображения и таблицы. Сложные блоки сохраняются как HTML.'
              : 'Поддерживаются стандартные элементы текста, ссылки, изображения и таблицы.'}
        </p>
      )}
      <Dialog
        open={dialog !== null}
        onClose={() => setDialog(null)}
        fullWidth
        maxWidth="sm"
      >
        <form onSubmit={insertURL}>
          <DialogTitle>
            {dialog === 'image' ? 'Добавить изображение' : 'Настроить ссылку'}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              fullWidth
              margin="normal"
              label={dialog === 'image' ? 'Адрес изображения' : 'Адрес ссылки'}
              value={url}
              onChange={event => {
                setURL(event.target.value);
                setInvalidURL(false);
              }}
              error={invalidURL}
              helperText={
                invalidURL
                  ? 'Введите корректный адрес.'
                  : dialog === 'link'
                    ? 'Очистите адрес, чтобы убрать ссылку.'
                    : 'Вставьте ссылку на изображение.'
              }
            />
            {dialog === 'image' && (
              <TextField
                fullWidth
                margin="normal"
                label="Описание изображения"
                value={alt}
                onChange={event => setAlt(event.target.value)}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialog(null)}>Отмена</Button>
            <Button type="submit" variant="contained">
              Применить
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
