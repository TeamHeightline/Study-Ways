import { setTestUser } from '../../../Shared/Store/UserStore/user-session.test-utils';
jest.mock('../../../App/ReduxStore/RootStore', () => ({
  useAppDispatch: () => require('react-redux').useDispatch(),
  useAppSelector: () => require('react-redux').useSelector(),
  __esModule: true,
  default: {
    dispatch: (...args) => mockStore.dispatch(...args),
    getState: () => mockStore.getState(),
  },
}));
let mockStore;
import React from 'react';
import { act as legacyAct } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { studyWaysApi } from '../../../Shared/ServerLayer/QueryLayer/api';
import axiosClient from '../../../Shared/ServerLayer/QueryLayer/config';
import CheckQuestionByID from './UI/check-question-by-id';
import { useQuestionPreview } from './use-question-preview';
function Preview({ id }) {
  const preview = useQuestionPreview(id);
  return <span>{preview.text}</span>;
}

jest.mock('../../../Shared/ServerLayer/QueryLayer/config', () => ({
  request: jest.fn(),
  post: jest.fn(),
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
beforeEach(async () => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  axiosClient.request.mockImplementation(async ({ url, method }) => ({
    data:
      method === 'POST'
        ? { id: 1 }
        : url.endsWith('/preview')
          ? preview
          : answers,
  }));
  axiosClient.post.mockResolvedValue({});
  store = mockStore = configureStore({
    reducer: { [studyWaysApi.reducerPath]: studyWaysApi.reducer },
    middleware: getDefault => getDefault().concat(studyWaysApi.middleware),
  });
  await setTestUser(store, {
    id: 7,
    username: 'student',
    user_access_level: 'TEACHER',
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
  await render('327', <Preview id={327} />);
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
  expect(axiosClient.request).toHaveBeenCalledWith(
    expect.objectContaining({
      url: '/page/write/answer-reports',
      method: 'POST',
      data: { answer_id: 1, text: 'Проверьте формулировку' },
    }),
  );
  expect(axiosClient.request).toHaveBeenCalledTimes(3);
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
