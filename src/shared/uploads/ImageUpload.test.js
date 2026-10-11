import React from 'react';
import { createRoot } from 'react-dom/client';
import { act as legacyAct, Simulate } from 'react-dom/test-utils';
import { ImageUpload } from './ImageUpload';

const act = React.act || legacyAct;
let root, host;
const file = (name = 'photo.png', type = 'image/png') =>
  new File(['image bytes'], name, { type });
const render = onUpload =>
  act(async () =>
    root.render(<ImageUpload imageUrl="/previous.png" onUpload={onUpload} />),
  );
const choose = value =>
  act(async () =>
    Simulate.change(host.querySelector('input[type=file]'), {
      target: { files: [value], value: 'photo.png' },
    }),
  );

beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  host = document.createElement('div');
  document.body.appendChild(host);
  root = createRoot(host);
});
afterEach(() => {
  act(() => root.unmount());
  host.remove();
  delete global.IS_REACT_ACT_ENVIRONMENT;
});

test('file selection reports progress, prevents duplicate uploads and confirms completion', async () => {
  let finish;
  const upload = jest.fn(
    () =>
      new Promise(resolve => {
        finish = resolve;
      }),
  );
  await render(upload);
  const image = file();
  await choose(image);
  expect(upload).toHaveBeenCalledWith(image);
  expect(host.querySelector('[aria-busy=true]')).not.toBeNull();
  expect(host.querySelector('input').disabled).toBe(true);
  await choose(image);
  expect(upload).toHaveBeenCalledTimes(1);
  await act(async () => finish());
  expect(host.textContent).toContain('Изображение загружено.');
  expect(host.querySelector('input').disabled).toBe(false);
});

test('failed upload preserves the preview and retries the same file', async () => {
  const upload = jest
    .fn()
    .mockRejectedValueOnce({ data: { message: 'Сервер недоступен' } })
    .mockResolvedValue(undefined);
  await render(upload);
  const image = file();
  await choose(image);
  expect(host.textContent).toContain('Сервер недоступен');
  expect(host.querySelector('img').getAttribute('src')).toBe('/previous.png');
  await act(async () =>
    [...host.querySelectorAll('button')]
      .find(button => button.textContent === 'Повторить')
      .click(),
  );
  expect(upload).toHaveBeenNthCalledWith(2, image);
  expect(host.textContent).toContain('Изображение загружено.');
});

test('drag and drop uploads images and rejects unsupported, oversized and multiple files', async () => {
  const upload = jest.fn().mockResolvedValue(undefined);
  await render(upload);
  const image = file('photo.webp', 'image/webp');
  const drop = files =>
    act(async () =>
      Simulate.drop(host.querySelector('.sw-image-upload'), {
        dataTransfer: { files },
      }),
    );
  await drop([image]);
  expect(upload).toHaveBeenCalledWith(image);
  upload.mockClear();
  await choose(file('script.svg', 'image/svg+xml'));
  expect(host.textContent).toContain('Выберите изображение PNG');
  const large = file();
  Object.defineProperty(large, 'size', { value: 10 * 1024 * 1024 + 1 });
  await choose(large);
  expect(host.textContent).toContain('10 МБ');
  await drop([file(), file()]);
  expect(host.textContent).toContain('Выберите одно изображение.');
  expect(upload).not.toHaveBeenCalled();
});
