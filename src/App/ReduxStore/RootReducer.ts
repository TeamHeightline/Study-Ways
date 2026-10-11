import cardEditorReducer from '../../Pages/Cards/Editor/EditorByIDV2/model/card-editor-slice';
import { resetSession } from '../../Shared/Store/UserStore/session-lifecycle';
import ExamPlayerReducer from '../../Pages/Exam/ExamByUid/redux-store/ExamPlayerSlice';
import { examEditorPageReducer } from '../../Pages/Exam/EditorPage/Page/redux-store/reducer';
import examResultsByIDReducer from '../../Pages/Exam/ExamResultsByID/redux-store/reducer';
import { AnyAction, combineReducers } from '@reduxjs/toolkit';
import StatusEditorSlice from '../../Pages/StatusEditor/redux-store/StatusEditorSlice';
import NotificationSlice from '../SharedComponents/Navbar/Notification/redux-store/NotificationSlice';
import coursePageSlice from '../../Pages/Course/Page/redux-store/course-page-slice';
import examEditorSlice from '../../Pages/Exam/EditorPage/ExamByID/redux-store/examEditorSlice';
import questionEditorPageSlice from '../../Pages/Question/Editor/Page/redux-store/QuestionEditorPageSlice';
import recentCardSlice from '../../Pages/RecentCards/Store/recent-card-slice';
import cardBookmarksSlice from '../../Pages/CardBookmarks/Store/card-bookmarks-slice';
import profileSlice from '../../Pages/Profile/redux-store';
import { studyWaysApi } from '../../Shared/ServerLayer/QueryLayer/api';

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
});

// Local drafts and legacy Redux page data must not survive a change of account.
export const RootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: AnyAction,
) => appReducer(resetSession.match(action) ? undefined : state, action);
