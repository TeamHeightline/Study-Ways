import ExamPlayerReducer from "../Pages/Exam/ExamByUid/redux-store/ExamPlayerSlice";
import {enableMapSet} from 'immer'
import {examEditorPageReducer} from "../Pages/Exam/EditorPage/Page/redux-store/reducer";
import {examResultsByIDReducer} from "../Pages/Exam/ExamResultsByID/redux-store/reducer";
import {combineReducers} from '@reduxjs/toolkit'
import StatusEditorSlice from "../Pages/StatusEditor/redux-store/StatusEditorSlice";
import NotificationSlice from "../SharedComponents/Navbar/Notification/redux-store/NotificationSlice";
import coursePageSlice from "../Pages/Course/Page/redux-store/course-page-slice";
import examEditorSlice from "../Pages/Exam/EditorPage/ExamByID/redux-store/examEditorSlice";
import questionEditorPageSlice from "../Pages/Question/Editor/Page/redux-store/QuestionEditorPageSlice";
import recentCardSlice from "../Pages/RecentCards/Store/recent-card-slice";
import cardBookmarksSlice from "../Pages/CardBookmarks/Store/card-bookmarks-slice";
import helpArticleEditorPageSlice from "../Pages/HelpArticle/EditorPage/redux-store";
import helpArticleByURLSlice from "../Pages/HelpArticle/HelpArticleByURL/redux-store"

enableMapSet()
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
    helpArticleByURL: helpArticleByURLSlice
});


