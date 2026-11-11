import React from 'react';
import { act as legacyAct, Simulate } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import reducer from '../../redux-store/ExamPlayerSlice';
import { initialState } from '../../redux-store/InitialState';
import UIAnswers from './ui-answers';
import UIQuestion from './ui-question';
import RegularAnswers from '../../../../question/question-by-id/ui/ui-answers';
import RegularQuestion from '../../../../question/question-by-id/ui/ui-question-data';

jest.mock('../../../../../app/redux-store/RootStore', () => ({
  __esModule: true,
  useAppSelector: require('react-redux').useSelector,
  default: { dispatch: jest.fn(), getState: jest.fn() },
}));
let mockMobile = false;
jest.mock('../../../../../shared/custom-hooks/isMobileHook', () => ({
  isMobileHook: () => mockMobile,
}));
const act = React.act || legacyAct;
const text =
  'Первый абзац.\n\n' +
  'Длинное объяснение ответа. '.repeat(100) +
  '\n' +
  'ДлиннаяСтрока'.repeat(60) +
  '\nПоследняя строка ответа.';
let root, host;
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  host = document.createElement('div');
  document.body.append(host);
  root = createRoot(host);
});
afterEach(() => {
  act(() => root.unmount());
  host.remove();
  delete global.IS_REACT_ACT_ENVIRONMENT;
});

test.each([false, true])(
  'the full answer survives selection with and without an illustration (mobile=%s)',
  async mobile => {
    mockMobile = mobile;
    const answers = [
      {
        id: 21,
        text,
        is_image_deleted: false,
        usertests_answerimage: { image: 'answer.png' },
      },
      {
        id: 22,
        text: 'Короткий ответ',
        is_image_deleted: true,
        usertests_answerimage: { image: 'deleted.png' },
      },
    ];
    const store = configureStore({
      reducer: { examPlayer: reducer },
      preloadedState: {
        examPlayer: {
          ...initialState,
          selected_answers_id: [],
          selected_question_data: { usertests_answer: answers },
        },
      },
    });
    await act(async () =>
      root.render(
        <Provider store={store}>
          <UIAnswers />
        </Provider>,
      ),
    );
    expect(host.querySelectorAll('.MuiCardMedia-root')).toHaveLength(1);
    const button = host.querySelector('button');
    expect(button.querySelector('p').textContent).toBe(text);
    await act(async () => Simulate.click(button));
    expect(store.getState().examPlayer.selected_answers_id).toEqual([21]);
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(button.querySelector('p').textContent).toBe(text);
    await act(async () => Simulate.click(button));
    expect(store.getState().examPlayer.selected_answers_id).toEqual([]);
  },
);

test.each([false, true])(
  'exam reuses the common question and answer UI without answer report controls (mobile=%s)',
  async mobile => {
    mockMobile = mobile;
    const store = configureStore({
      reducer: { examPlayer: reducer },
      preloadedState: {
        examPlayer: {
          ...initialState,
          exam_data: { is_enable_max_question_attempts: true },
          selected_question_data: {
            text: 'Полный текст вопроса',
            usertests_questionimage: { image: 'question.png' },
            usertests_answer: [
              {
                id: 21,
                text,
                is_image_deleted: true,
                is_true: false,
                check_queue: 1,
              },
            ],
          },
        },
      },
    });
    await act(async () =>
      root.render(
        <Provider store={store}>
          <UIQuestion />
          <UIAnswers />
        </Provider>,
      ),
    );
    expect(host.querySelector('.sw-question-panel')).not.toBeNull();
    expect(host.querySelector('.sw-question-copy-text').textContent).toBe(
      'Полный текст вопроса',
    );
    expect(host.querySelector('.sw-answer-card')).not.toBeNull();
    expect(host.textContent).toContain('Осталось попыток: 100');
    expect(host.textContent).not.toContain('Пожаловаться');
    const giveUp = [...host.querySelectorAll('button')].find(
      node => node.textContent === 'Сдаться',
    );
    await act(async () => Simulate.click(giveUp));
    expect(document.querySelector('[role=dialog]').textContent).toContain(
      'Вы уже не сможете вернуться к этому вопросу позже.',
    );
    const cancel = [...document.querySelectorAll('[role=dialog] button')].find(
      node => node.textContent === 'Отмена',
    );
    await act(async () => Simulate.click(cancel));
    expect(store.getState().examPlayer.statistic).toBeNull();
    const check = [...host.querySelectorAll('button')].find(
      node => node.textContent === 'Проверить',
    );
    await act(async () => Simulate.click(check));
    expect(store.getState().examPlayer.statistic.numberOfPasses).toBe(1);
  },
);

test('ordinary answers use the shared list and keep report actions outside the selectable card', async () => {
  const selectAnswerHandleChange = jest.fn();
  const onReportAnswerButtonClick = jest.fn();
  const questionStore = {
    answersArray: [
      { id: 21, answerText: text, answerImageUrl: '', isImageDeleted: true },
    ],
    selectedAnswers: new Set([21]),
    selectAnswerHandleChange,
    onReportAnswerButtonClick,
  };
  await act(async () =>
    root.render(<RegularAnswers questionStore={questionStore} />),
  );
  expect(host.querySelector('.sw-player-answers')).not.toBeNull();
  const choice = host.querySelector('.sw-answer-card-action');
  expect(choice.querySelector('.sw-answer-text').textContent).toBe(text);
  expect(choice.getAttribute('aria-pressed')).toBe('true');
  await act(async () => Simulate.click(choice));
  expect(selectAnswerHandleChange).toHaveBeenCalledWith(21);
  const report = host.querySelector('.sw-answer-report-button');
  expect(report.closest('.sw-answer-card')).toBeNull();
  await act(async () => Simulate.click(report));
  expect(onReportAnswerButtonClick).toHaveBeenCalledWith(0);
  expect(selectAnswerHandleChange).toHaveBeenCalledTimes(1);
});

test('ordinary question uses shared controls but keeps its own surrender confirmation', async () => {
  const onCheck = jest.fn(),
    onAcceptDefeat = jest.fn();
  await act(async () =>
    root.render(
      <RegularQuestion
        questionText="Текст обычного вопроса"
        onClick1={onCheck}
        onAcceptDefeat={onAcceptDefeat}
      />,
    ),
  );
  expect(host.querySelector('.sw-question-copy-text').textContent).toBe(
    'Текст обычного вопроса',
  );
  const giveUp = [...host.querySelectorAll('button')].find(
    node => node.textContent === 'Сдаться',
  );
  await act(async () => Simulate.click(giveUp));
  const dialog = document.querySelector('[role=dialog]');
  expect(dialog.textContent).toContain(
    'Если этот вопрос является частью серии вопросов',
  );
  expect(onAcceptDefeat).not.toHaveBeenCalled();
  const confirm = [...dialog.querySelectorAll('button')].find(
    node => node.textContent === 'Сдаться',
  );
  await act(async () => Simulate.click(confirm));
  expect(onAcceptDefeat).toHaveBeenCalledTimes(1);
  expect(onCheck).not.toHaveBeenCalled();
});
