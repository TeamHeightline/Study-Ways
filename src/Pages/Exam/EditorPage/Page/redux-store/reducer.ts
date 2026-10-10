import { initialState } from './initial-state';
import produce from 'immer';
import {
  CHANGE_EXAM_NAME_FOR_CREATE,
  CHANGE_EXAM_QS_ID_FOR_CREATE,
  CHANGE_IS_OPEN_CREATE_EXAM_DIALOG,
  CLOSE_DIALOG_AND_CLEAR_CREATE_DATA,
  CREATE_EXAM_ERROR,
  CREATE_EXAM_PENDING,
  CREATE_EXAM_SUCCESS,
  LOAD_MY_EXAMS_ERROR,
  LOAD_MY_EXAMS_SUCCESS,
  LOAD_QS_DATA_SUCCESS,
  LOAD_QS_DATA_ERROR,
  START_LOADING_MY_EXAMS,
  START_LOADING_QS_DATA,
} from './action-types';
import * as Actions from './actions';

export type IActionsType = ReturnType<(typeof Actions)[keyof typeof Actions]>;

export const examEditorPageReducer = (
  previousState: typeof initialState = initialState,
  action: IActionsType,
): typeof initialState =>
  produce(previousState, state => {
    switch (action.type) {
      case START_LOADING_MY_EXAMS:
        state.loading_exams = true;
        state.exams_load_error = null;
        break;

      case LOAD_MY_EXAMS_SUCCESS:
        state.loading_exams = false;
        state.exams = action.payload.exams;
        state.exams_load_error = null;
        break;

      case LOAD_MY_EXAMS_ERROR:
        state.loading_exams = false;
        state.exams_load_error = action.payload.error;
        break;

      case CHANGE_EXAM_NAME_FOR_CREATE:
        state.exam_name_for_create = action.payload;
        state.create_exam_error = false;
        break;

      case CHANGE_EXAM_QS_ID_FOR_CREATE:
        state.exam_qs_id_for_create = action.payload;
        state.selected_qs_data = null;
        state.selected_qs_data_error = null;
        state.create_exam_error = false;
        break;

      case CHANGE_IS_OPEN_CREATE_EXAM_DIALOG:
        state.is_open_create_exam_dialog = action.payload;
        state.create_exam_error = false;
        break;

      case START_LOADING_QS_DATA:
        state.selected_qs_data_loading = true;
        state.selected_qs_data_error = null;
        break;

      case LOAD_QS_DATA_SUCCESS:
        state.selected_qs_data = action.payload;
        state.selected_qs_data_loading = false;
        state.selected_qs_data_error = null;
        break;

      case LOAD_QS_DATA_ERROR:
        state.selected_qs_data_loading = false;
        state.selected_qs_data_error = String(action.payload);
        break;

      case CREATE_EXAM_PENDING:
        state.create_exam_pending = true;
        state.create_exam_error = false;
        break;

      case CREATE_EXAM_SUCCESS:
        state.create_exam_pending = false;
        state.create_exam_error = false;
        if (action.exam) {
          state.exams = [
            action.exam,
            ...state.exams.filter(
              exam => String(exam.id) !== String(action.exam?.id),
            ),
          ];
        }
        break;

      case CREATE_EXAM_ERROR:
        state.create_exam_pending = false;
        state.create_exam_error = true;
        break;

      case CLOSE_DIALOG_AND_CLEAR_CREATE_DATA:
        if (state.create_exam_pending) break;
        state.is_open_create_exam_dialog = false;
        state.exam_name_for_create = '';
        state.exam_qs_id_for_create = null;
        state.selected_qs_data = null;
        state.selected_qs_data_loading = false;
        state.selected_qs_data_error = null;
        state.create_exam_error = false;
        break;

      default:
        return state;
    }
  });
