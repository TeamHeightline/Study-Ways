import questionEditor from '../../pages/question/editor/question-editor/store/QuestionEditorStorage';
import aiSearch from '../../pages/cards/page/ai-search/store/AISearch';
import aiCourse from '../../pages/ai-course/model/store';
import statisticView from '../../pages/detail-statistic/store/DetailStatisticStoreByID';
import courseNavigation from '../../pages/course/course-micro-view/v2/store/CourseMicroStoreByID';
import reviewReport from '../../pages/check-question/check-question-by-id/check-answer-by-id/store/check-answer-by-id-store';
import theme from '../../shared/theme/theme-store';
import questionPlayer from '../../pages/question/question-by-id/store/QuestionPlayerStore';
import cardSelector from '../../pages/cards/selector/store/CardSelectorStore';
import cardView from '../../pages/cards/card-by-id/store/CardByIDStore';
import answerEditorReducer from '../../pages/question/editor/answers-editor/edit-answer-by-id/model/answer-editor-slice';
import cardEditorReducer from '../../pages/cards/editor/editor-by-id-v2/model/card-editor-slice';
import { resetSession } from '../../shared/store/user-store/session-lifecycle';
import ExamPlayerReducer from '../../pages/exam/exam-by-uid/redux-store/ExamPlayerSlice';
import { examEditorPageReducer } from '../../pages/exam/editor-page/page/redux-store/reducer';
import examResultsByIDReducer from '../../pages/exam/exam-results-by-id/redux-store/reducer';
import { AnyAction, combineReducers } from '@reduxjs/toolkit';
import StatusEditorSlice from '../../pages/status-editor/redux-store/StatusEditorSlice';
import NotificationSlice from '../shared-components/navbar/notification/redux-store/NotificationSlice';
import coursePageSlice from '../../pages/course/page/redux-store/course-page-slice';
import examEditorSlice from '../../pages/exam/editor-page/exam-by-id/redux-store/examEditorSlice';
import questionEditorPageSlice from '../../pages/question/editor/page/redux-store/QuestionEditorPageSlice';
import recentCardSlice from '../../pages/recent-cards/store/recent-card-slice';
import cardBookmarksSlice from '../../pages/card-bookmarks/store/card-bookmarks-slice';
import profileSlice from '../../pages/profile/redux-store';
import { studyWaysApi } from '../../shared/server-layer/query-layer/api';

const appReducer = combineReducers({
  [studyWaysApi.reducerPath]: studyWaysApi.reducer,
  examEditorPageReducer,
  examResultsByIDReducer,
  examPlayer: ExamPlayerReducer,
  examEditor: examEditorSlice,
  statusEditor: StatusEditorSlice,
  notification: NotificationSlice,
  coursePage: coursePageSlice,
  questionEditorPage: questionEditorPageSlice,
  recentCards: recentCardSlice,
  cardBookmarks: cardBookmarksSlice,
  profile: profileSlice,
  cardEditor: cardEditorReducer,
  answerEditor: answerEditorReducer,
  cardSelector,
  cardView,
  questionPlayer,
  theme,
  statisticView,
  courseNavigation,
  reviewReport,
  aiSearch,
  aiCourse,
  questionEditor,
});

// Local drafts and legacy Redux page data must not survive a change of account.
export const RootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: AnyAction,
) => {
  if (resetSession.match(action)) {
    const cleared = appReducer(undefined, action);
    return { ...cleared, theme: state?.theme || cleared.theme };
  }
  return appReducer(state, action);
};
