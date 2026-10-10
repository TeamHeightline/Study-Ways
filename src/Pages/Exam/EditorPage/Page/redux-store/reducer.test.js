import { examEditorPageReducer } from './reducer';
import {
  changeExamNameForCreate,
  changeExamQSIDForCreate,
  changeIsOpenCreateExamDialog,
  closeDialogAndClearCreateData,
  createExamPending,
  createExamSuccess,
  createExamError,
  loadMyExamsSuccess,
  loadMyExamsError,
  loadQSDataSuccess,
} from './actions';

test('exam creation actions update and reset the dialog without mutating state', () => {
  const initial = examEditorPageReducer(undefined, { type: '@@INIT' });
  let state = examEditorPageReducer(
    initial,
    changeIsOpenCreateExamDialog(true),
  );
  state = examEditorPageReducer(state, changeExamNameForCreate('New exam'));
  state = examEditorPageReducer(state, changeExamQSIDForCreate(42));
  state = examEditorPageReducer(state, createExamPending());
  expect(state.create_exam_pending).toBe(true);
  expect(state.exam_name_for_create).toBe('New exam');
  expect(state.exam_qs_id_for_create).toBe(42);

  state = examEditorPageReducer(state, createExamSuccess(123));
  expect(state.create_exam_pending).toBe(false);
  state = examEditorPageReducer(state, closeDialogAndClearCreateData());
  expect(state.is_open_create_exam_dialog).toBe(false);
  expect(state.exam_name_for_create).toBe('');
  expect(state.exam_qs_id_for_create).toBeNull();
  expect(initial.is_open_create_exam_dialog).toBe(false);
  expect(initial.exam_name_for_create).toBeNull();
});

test('exam loading retains payload data and errors', () => {
  const exams = [{ id: 1, name: 'Exam' }];
  const initial = examEditorPageReducer(undefined, { type: '@@INIT' });
  let state = examEditorPageReducer(initial, loadMyExamsSuccess(exams));
  expect(state.exams).toEqual(exams);
  expect(state.loading_exams).toBe(false);
  state = examEditorPageReducer(
    state,
    loadMyExamsError({ error: 'Unavailable' }),
  );
  expect(state.exams_load_error).toBe('Unavailable');
});

test('question sequence payload and exam creation errors remain supported', () => {
  const sequence = { id: '42', sequence_data: { sequence: [1, 2] } };
  const initial = examEditorPageReducer(undefined, { type: '@@INIT' });
  let state = examEditorPageReducer(initial, loadQSDataSuccess(sequence));
  expect(state.selected_qs_data).toEqual(sequence);
  state = examEditorPageReducer(state, createExamPending());
  state = examEditorPageReducer(state, createExamError());
  expect(state.create_exam_pending).toBe(false);
});
