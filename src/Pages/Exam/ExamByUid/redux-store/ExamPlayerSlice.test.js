import reducer, {
  changeSelectedAnswersId,
  changeSelectedQuestionId,
  checkAnswers,
  resetExam,
} from './ExamPlayerSlice';

jest.mock('../../../../App/ReduxStore/RootStore', () => ({
  __esModule: true,
  default: { dispatch: jest.fn() },
}));

test('answer selection toggles unique IDs without mutating previous state', () => {
  const initial = reducer(undefined, { type: '@@INIT' });
  const selected = reducer(initial, changeSelectedAnswersId(11));
  const twoSelected = reducer(selected, changeSelectedAnswersId(22));
  const deselected = reducer(twoSelected, changeSelectedAnswersId(11));
  expect(initial.selected_answers_id).toEqual([]);
  expect(selected.selected_answers_id).toEqual([11]);
  expect(twoSelected.selected_answers_id).toEqual([11, 22]);
  expect(deselected.selected_answers_id).toEqual([22]);
  expect(JSON.parse(JSON.stringify(twoSelected)).selected_answers_id).toEqual([
    11, 22,
  ]);
});

test('changing a question and resetting the exam clear selected answers', () => {
  const selected = reducer(undefined, changeSelectedAnswersId(11));
  const questionChanged = reducer(selected, changeSelectedQuestionId(42));
  expect(questionChanged.selected_answers_id).toEqual([]);
  expect(questionChanged.selected_question_id).toBe(42);
  const reset = reducer(selected, resetExam());
  expect(reset.selected_answers_id).toEqual([]);
  expect(reset.selected_question_id).toBeNull();
  expect(selected.selected_answers_id).toEqual([11]);
});

test('checking answers scores selected true and unselected false answers correctly', () => {
  const initial = reducer(undefined, { type: '@@INIT' });
  const state = {
    ...initial,
    selected_question_data: {
      usertests_answer: [
        {
          id: 11,
          is_true: true,
          hard_level_of_answer: 'MEDIUM',
          check_queue: 1,
          help_textV1: 'Select the true answer',
        },
        {
          id: 22,
          is_true: false,
          hard_level_of_answer: 'EASY',
          check_queue: 2,
          help_textV1: 'Leave the false answer unchecked',
        },
      ],
    },
    exam_data: { is_enable_help_text: true, help_text_level: 0 },
    remaining_attempts: 3,
  };
  const correct = reducer(
    reducer(state, changeSelectedAnswersId(11)),
    checkAnswers(),
  );
  expect(correct.is_question_completed).toBe(true);
  expect(
    correct.statistic.ArrayForShowWrongAnswers[0].numberOfWrongAnswers,
  ).toEqual([]);
  expect(correct.statistic.ArrayForShowAnswerPoints[0].answerPoints).toBe(15);
  expect(correct.remaining_attempts).toBe(2);

  const incorrect = reducer(
    reducer(state, changeSelectedAnswersId(22)),
    checkAnswers(),
  );
  expect(incorrect.is_question_completed).toBe(false);
  expect(
    incorrect.statistic.ArrayForShowWrongAnswers[0].numberOfWrongAnswers,
  ).toEqual([11, 22]);
  expect(incorrect.statistic.ArrayForShowAnswerPoints[0].answerPoints).toBe(
    -25,
  );
  expect(incorrect.help_text).toBe('Select the true answer');
});
