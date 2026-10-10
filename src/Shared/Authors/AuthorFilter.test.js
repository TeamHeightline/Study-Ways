import React, { useState } from 'react';
import { act as legacyAct } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { authorsApi } from './api';
import { AuthorFilter } from './AuthorFilter';
import axiosClient from '../ServerLayer/QueryLayer/config';

jest.mock('../ServerLayer/QueryLayer/config', () => ({ request: jest.fn() }));
const act = React.act || legacyAct;
const authors = [
  {
    id: 7,
    username: 'physics',
    users_userprofile: {
      firstname: 'Анна',
      lastname: null,
      avatar_src: 'https://example.test/avatar.png',
    },
  },
  { id: 8, username: 'no-profile', users_userprofile: null },
  {
    id: 9,
    username: null,
    first_name: null,
    last_name: null,
    users_userprofile: { firstname: null, lastname: null },
  },
  {
    id: 7,
    username: 'physics',
    users_userprofile: { firstname: 'Анна', lastname: null },
  },
];
let container, root, store;
function Filter({ scope = 'cards', initialValue = null }) {
  const [value, setValue] = useState(initialValue);
  return (
    <>
      <AuthorFilter scope={scope} value={value} onChange={setValue} />
      <output>{value || 'all'}</output>
    </>
  );
}
const render = content =>
  act(async () => root.render(<Provider store={store}>{content}</Provider>));
const click = node => act(async () => node.click());
const open = () =>
  click(container.querySelector('[aria-label="Выбрать автора"]'));
const options = () => [...document.querySelectorAll('[role="option"]')];

beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  axiosClient.request.mockReset().mockResolvedValue({ data: authors });
  jest
    .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
    .mockReturnValue({
      width: 300,
      height: 44,
      top: 100,
      bottom: 144,
      left: 100,
      right: 400,
      x: 100,
      y: 100,
      toJSON: () => {},
    });
  store = configureStore({
    reducer: { [authorsApi.reducerPath]: authorsApi.reducer },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat(authorsApi.middleware),
  });
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => {
    root.unmount();
    store.dispatch(authorsApi.util.resetApiState());
  });
  container.remove();
  jest.restoreAllMocks();
  delete global.IS_REACT_ACT_ENVIRONMENT;
});

test('the list updates when the request finishes and handles incomplete author profiles', async () => {
  let finish;
  axiosClient.request.mockImplementation(
    () =>
      new Promise(resolve => {
        finish = resolve;
      }),
  );
  await render(<Filter />);
  await open();
  expect(document.body.textContent).toContain('Загружаем авторов');
  await act(async () => finish({ data: authors }));
  expect(options()).toHaveLength(3);
  expect(
    options()
      .map(node => node.textContent)
      .join(' '),
  ).toContain('no-profile');
  expect(
    options()
      .map(node => node.textContent)
      .join(' '),
  ).toContain('Автор №9');
  expect(document.body.textContent).not.toContain('undefined');
  expect(document.body.textContent).not.toContain('null');
  await click(options().find(node => node.textContent.includes('Анна')));
  expect(container.querySelector('output').textContent).toBe('7');
  await click(container.querySelector('[aria-label="Сбросить автора"]'));
  expect(container.querySelector('output').textContent).toBe('all');
});

test('search finds an author by username, with their name shown in the option', async () => {
  await render(<Filter />);
  await act(async () => {
    const input = container.querySelector('input');
    input.focus();
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value',
    ).set.call(input, 'physics');
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  expect(options()).toHaveLength(1);
  expect(options()[0].textContent).toContain('Анна');
});

test('multiple filters share one cached list; question authors have their own query', async () => {
  await render(
    <>
      <Filter />
      <Filter />
      <Filter scope="questions" />
    </>,
  );
  expect(axiosClient.request).toHaveBeenCalledTimes(2);
  expect(axiosClient.request.mock.calls.map(([args]) => args.url)).toEqual(
    expect.arrayContaining([
      '/page/card-page/authors',
      '/page/question-editor-page/authors',
    ]),
  );
  await render(null);
  await render(<Filter initialValue="7" />);
  expect(container.querySelector('input').value).toBe('Анна');
  expect(axiosClient.request).toHaveBeenCalledTimes(2);
});

test('a failed list shows a retry action that populates the selector', async () => {
  axiosClient.request.mockRejectedValueOnce(new Error('Offline'));
  await render(<Filter />);
  expect(container.textContent).toContain('Не удалось загрузить авторов');
  await click(
    [...container.querySelectorAll('button')].find(
      node => node.textContent === 'Повторить',
    ),
  );
  await open();
  expect(options()).toHaveLength(3);
  expect(axiosClient.request).toHaveBeenCalledTimes(2);
});
