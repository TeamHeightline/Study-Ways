import React from 'react';
import { act as legacyAct } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { Editor } from '@tiptap/core';
import RichTextEditor from './RichTextEditor';
import { richTextExtensions, validEditorURL } from './extensions';

const act = React.act || legacyAct;
const descriptions = [
  '<h2>Физика</h2><p><strong>Сила</strong> и <em>ускорение</em>: <a href="https://example.com">лекция</a></p><ul><li><p>Первый закон</p></li></ul>',
  '<figure class="image" style="width: 70%"><img src="https://example.com/diagram.png" alt="График"><figcaption>График <strong>скорости</strong></figcaption></figure>',
  '<figure class="table"><table><tbody><tr><th>Величина</th><th>Единица</th></tr><tr><td>Сила</td><td>Н</td></tr></tbody></table></figure>',
  '<table><tbody><tr><td colspan="2"><p>Общая ячейка</p><p>Пояснение</p></td></tr><tr><td>А</td><td>Б</td></tr></tbody></table>',
  '<figure class="media"><oembed url="https://www.youtube.com/watch?v=abc123"></oembed></figure>',
];

test.each(descriptions)(
  'existing description survives HTML → Markdown → HTML: %s',
  html => {
    const editor = new Editor({
      extensions: richTextExtensions(),
      content: html,
    });
    const before = editor.getJSON();
    const markdown = editor.getMarkdown();
    expect(markdown.length).toBeGreaterThan(0);
    editor.commands.setContent(markdown, {
      contentType: 'markdown',
      emitUpdate: false,
    });
    expect(editor.getJSON()).toEqual(before);
    editor.destroy();
  },
);

test('Markdown supports headings, emphasis, links, images and tables', () => {
  const editor = new Editor({
    extensions: richTextExtensions(),
    content:
      '# Оптика\n\n**Свет** и [лекция](https://example.com)\n\n![Призма](https://example.com/prism.png)\n\n| Величина | Значение |\n| --- | --- |\n| n | 1.5 |',
    contentType: 'markdown',
  });
  const html = editor.getHTML();
  expect(html).toContain('<h1>Оптика</h1>');
  expect(html).toContain('<strong>Свет</strong>');
  expect(html).toContain('href="https://example.com"');
  expect(html).toContain('src="https://example.com/prism.png"');
  expect(html).toContain('<table');
  editor.destroy();
});

test('inserted links reject executable protocols', () => {
  expect(validEditorURL('javascript:alert(1)')).toBe(false);
  expect(validEditorURL('data:text/html,hi')).toBe(false);
  expect(validEditorURL('mailto:teacher@example.com')).toBe(true);
  expect(validEditorURL('mailto:teacher@example.com', true)).toBe(false);
  expect(validEditorURL('/files/diagram.png', true)).toBe(true);
});

let container, root;
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  delete global.IS_REACT_ACT_ENVIRONMENT;
});
const clickMode = mode =>
  act(async () => container.querySelector(`button[value="${mode}"]`).click());
const typeSource = value =>
  act(async () => {
    const field = container.querySelector('textarea');
    Object.getOwnPropertyDescriptor(
      HTMLTextAreaElement.prototype,
      'value',
    ).set.call(field, value);
    field.dispatchEvent(new Event('input', { bubbles: true }));
  });

test('opening and switching modes does not autosave or normalize existing HTML', async () => {
  const onChange = jest.fn();
  const html = '<p class="legacy">Описание <b>карточки</b></p>';
  await act(async () =>
    root.render(<RichTextEditor value={html} onChange={onChange} />),
  );
  await clickMode('markdown');
  expect(container.querySelector('textarea').value).toContain('**карточки**');
  await clickMode('html');
  expect(container.querySelector('textarea').value).toBe(html);
  await clickMode('visual');
  expect(onChange).not.toHaveBeenCalled();
});

test('Markdown changes save HTML, keep the typed source, and appear in the visual editor', async () => {
  const onChange = jest.fn();
  function Controlled() {
    const [value, setValue] = React.useState('<p>До</p>');
    return (
      <RichTextEditor
        value={value}
        onChange={html => {
          onChange(html);
          setValue(html);
        }}
      />
    );
  }
  await act(async () => root.render(<Controlled />));
  await clickMode('markdown');
  await typeSource('## Оптика\n\n**Свет**\n\n');
  expect(onChange).toHaveBeenLastCalledWith(
    expect.stringContaining('<h2>Оптика</h2><p><strong>Свет</strong></p>'),
  );
  expect(container.querySelector('textarea').value).toBe(
    '## Оптика\n\n**Свет**\n\n',
  );
  await clickMode('visual');
  expect(container.querySelector('.sw-rich-text-document h2').textContent).toBe(
    'Оптика',
  );
  await clickMode('html');
  await typeSource('<p>Новый <em>HTML</em></p>');
  expect(onChange).toHaveBeenLastCalledWith('<p>Новый <em>HTML</em></p>');
  await clickMode('visual');
  expect(container.querySelector('.sw-rich-text-document em').textContent).toBe(
    'HTML',
  );
});

test('external reload replaces the editor content without saving it back', async () => {
  const onChange = jest.fn();
  await act(async () =>
    root.render(
      <RichTextEditor value="<p>Первая карточка</p>" onChange={onChange} />,
    ),
  );
  await clickMode('html');
  await act(async () =>
    root.render(
      <RichTextEditor value="<p>Другая карточка</p>" onChange={onChange} />,
    ),
  );
  expect(container.querySelector('textarea').value).toBe(
    '<p>Другая карточка</p>',
  );
  expect(container.querySelector('.sw-rich-text-document').textContent).toBe(
    'Другая карточка',
  );
  expect(onChange).not.toHaveBeenCalled();
});

test('HTML source keeps typed markup while saving only supported safe HTML', async () => {
  const onChange = jest.fn();
  await act(async () =>
    root.render(<RichTextEditor value="<p>До</p>" onChange={onChange} />),
  );
  await clickMode('html');
  const raw =
    '<p onclick="alert(1)">Текст <a href="javascript:alert(1)">ссылка</a></p>';
  await typeSource(raw);
  expect(container.querySelector('textarea').value).toBe(raw);
  const saved = onChange.mock.calls.at(-1)[0];
  expect(saved).toContain('Текст');
  expect(saved).toContain('ссылка');
  expect(saved).not.toContain('onclick');
  expect(saved).not.toContain('javascript:');
});
