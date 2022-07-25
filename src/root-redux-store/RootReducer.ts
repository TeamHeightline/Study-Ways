import ExamPlayerReducer from "../Components/Elements/Exam/ExamByUid/redux-store/ExamPlayerSlice";
import {enableMapSet} from 'immer'
import {examEditorPageReducer} from "../Components/Elements/Exam/EditorPage/Page/redux-store/reducer";
import {examResultsByIDReducer} from "../Components/Elements/Exam/ExamResultsByID/redux-store/reducer";
import {combineReducers} from '@reduxjs/toolkit'
import StatusEditorSlice from "../Components/Elements/StatusEditor/redux-store/StatusEditorSlice";
import NotificationSlice from "../Components/PublicPages/Navbar/Notification/redux-store/NotificationSlice";
import coursePageSlice from "../Components/Elements/Course/Page/redux-store/CoursePageSlice";
import examEditorSlice from "../Components/Elements/Exam/EditorPage/ExamByID/redux-store/examEditorSlice";

enableMapSet()
export const RootReducer = combineReducers({
    examEditorPageReducer,
    examResultsByIDReducer,
    examPlayer: ExamPlayerReducer,
    examEditor: examEditorSlice,
    statusEditor: StatusEditorSlice,
    notification: NotificationSlice,
    coursePage: coursePageSlice,

});


