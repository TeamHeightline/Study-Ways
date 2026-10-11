import React from 'react';
import { act as legacyAct } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { studyWaysApi } from '../../../Shared/ServerLayer/QueryLayer/api';
import axiosClient from '../../../Shared/ServerLayer/QueryLayer/config';
import CheckQuestionByID from './UI/check-question-by-id';
import QuestionNanoViewByID from '../../Question/QuestionNanoViewByID/UI/question-nano-view-by-id';

jest.mock('../../../Shared/ServerLayer/QueryLayer/config', () => ({
  request: jest.fn(),
  post: jest.fn(),
}));
jest.mock('../../../Shared/Store/UserStore/UserStore', () => ({
  UserStorage: { user_data: { id: 7 }, userAccessLevel: 'TEACHER' },
}));
const act = React.act || legacyAct;
let container, root, store;
const preview = {
  id: '327',
  text: 'Проверяем законы физики',
  ownerUsername: 'teacher@example.com',
  questionImage: 'question/327.png',
};
const answers = Array.from({ length: 12 }, (_, index) => ({
  id: String(index + 1),
  text: `Ответ ${index + 1}`,
  isTrue: index === 0,
  isImageDeleted: false,
  image: index === 0 ? 'answer/1.png' : null,
  helpTextv1: 'Лёгкая подсказка',
  helpTextv2: 'Средняя подсказка',
  helpTextv3: 'Сложная подсказка',
}));
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  axiosClient.request.mockImplementation(async ({ url }) => ({
    data: url.endsWith('/preview') ? preview : answers,
  }));
  axiosClient.post.mockResolvedValue({});
  store = configureStore({
    reducer: { [studyWaysApi.reducerPath]: studyWaysApi.reducer },
    middleware: getDefault => getDefault().concat(studyWaysApi.middleware),
  });
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => {
    root.unmount();
    store.dispatch(studyWaysApi.util.resetApiState());
  });
  container.remove();
  delete global.IS_REACT_ACT_ENVIRONMENT;
});
const render = (id = '327', extra = null) =>
  act(async () =>
    root.render(
      <Provider store={store}>
        <MemoryRouter>
          <CheckQuestionByID question_id={id} />
          {extra}
        </MemoryRouter>
      </Provider>,
    ),
  );
const button = (text, scope = document) =>
  [...scope.querySelectorAll('button')].find(node => node.textContent === text);

test('review and question previews share one question read and all answers, hints and images arrive in one batch', async () => {
  await render('327', <QuestionNanoViewByID question_id={327} />);
  expect(axiosClient.request).toHaveBeenCalledTimes(2);
  expect(axiosClient.request.mock.calls.map(([args]) => args.url)).toEqual(
    expect.arrayContaining([
      '/page/question-read/327/preview',
      '/page/question-read/327/review-answers',
    ]),
  );
  expect(container.querySelectorAll('.sw-review-answer')).toHaveLength(12);
  expect(container.textContent).toContain('Проверяем законы физики');
  expect(container.textContent).toContain('teacher@example.com');
  expect(container.textContent).toContain('Верный ответ');
  expect(container.textContent).toContain('Средняя подсказка');
  expect(container.querySelectorAll('.sw-review-hint')).toHaveLength(36);
  expect(
    container
      .querySelector('.sw-review-answer-content img')
      .getAttribute('src'),
  ).toContain('/answer/1.png');
  await act(async () => button('Сообщить об ошибке').click());
  const input = document.querySelector('textarea');
  await act(async () => {
    Object.getOwnPropertyDescriptor(
      HTMLTextAreaElement.prototype,
      'value',
    ).set.call(input, 'Проверьте формулировку');
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await act(async () => button('Отправить замечание').click());
  expect(axiosClient.post).toHaveBeenCalledWith(
    '/page/question-page/create-answer-report',
    { report_data: { answer_id: 1, text: 'Проверьте формулировку' } },
  );
  expect(axiosClient.request).toHaveBeenCalledTimes(2);
});

test('a failed answer batch can be retried and does not get stuck in loading', async () => {
  axiosClient.request.mockImplementation(async ({ url }) => {
    if (url.endsWith('/review-answers')) throw new Error('Unavailable');
    return { data: preview };
  });
  await render();
  expect(container.textContent).toContain('Не удалось загрузить ответы.');
  axiosClient.request.mockResolvedValue({ data: answers });
  await act(async () => button('Повторить', container).click());
  expect(container.querySelectorAll('.sw-review-answer')).toHaveLength(12);
});

test('changing the question ignores late data from the previous question', async () => {
  let finishOld;
  axiosClient.request.mockImplementation(({ url }) =>
    url === '/page/question-read/327/preview'
      ? new Promise(resolve => {
          finishOld = resolve;
        })
      : Promise.resolve({
          data: url.endsWith('/preview')
            ? { ...preview, id: '328', text: 'Новый вопрос' }
            : [],
        }),
  );
  await render();
  await render('328');
  expect(container.textContent).toContain('Новый вопрос');
  await act(async () => finishOld({ data: preview }));
  expect(container.textContent).not.toContain(preview.text);
  expect(container.textContent).toContain('Новый вопрос');
});
