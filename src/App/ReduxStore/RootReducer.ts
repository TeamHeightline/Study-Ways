import ExamPlayerReducer from "../../Pages/Exam/ExamByUid/redux-store/ExamPlayerSlice";
import { enableMapSet } from "immer";
import { examEditorPageReducer } from "../../Pages/Exam/EditorPage/Page/redux-store/reducer";
import examResultsByIDReducer from "../../Pages/Exam/ExamResultsByID/redux-store/reducer";
import { combineReducers } from "@reduxjs/toolkit";
import StatusEditorSlice from "../../Pages/StatusEditor/redux-store/StatusEditorSlice";
import NotificationSlice from "../SharedComponents/Navbar/Notification/redux-store/NotificationSlice";
import coursePageSlice from "../../Pages/Course/Page/redux-store/course-page-slice";
import examEditorSlice from "../../Pages/Exam/EditorPage/ExamByID/redux-store/examEditorSlice";
import questionEditorPageSlice from "../../Pages/Question/Editor/Page/redux-store/QuestionEditorPageSlice";
import recentCardSlice from "../../Pages/RecentCards/Store/recent-card-slice";
import cardBookmarksSlice from "../../Pages/CardBookmarks/Store/card-bookmarks-slice";
import helpArticleEditorPageSlice from "../../Pages/HelpArticle/EditorPage/redux-store";
import helpArticleByURLSlice from "../../Pages/HelpArticle/HelpArticleByURL/redux-store";
import userGroupEditorPageSlice from "../../Pages/UserGroups/EditorPage/store";
import cardMicroViewSlice from "../../Pages/Cards/CardMicroView/store";
import profileSlice from "../../Pages/Profile/redux-store";

import { userGroupApi } from "../../Pages/UserGroups/EditorPage/store/api";

enableMapSet();
export const RootReducer = combineReducers({
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
  helpArticleEditor: helpArticleEditorPageSlice,
  helpArticleByURL: helpArticleByURLSlice,
  userGroupEditor: userGroupEditorPageSlice,
  cardMicroView: cardMicroViewSlice,
  [userGroupApi.reducerPath]: userGroupApi.reducer,
  profile: profileSlice,
});
