import {statusEditorReducer} from "../Components/Elements/StatusEditor/redux-store/reducer";
import {examEditorReducer} from "../Components/Elements/Exam/EditorPage/ExamByID/redux-store/reducer";
import {ExamByUIDReducer} from "../Components/Elements/Exam/ExamByUid/redux-store/reducer";
import {enableMapSet} from 'immer'
import {examEditorPageReducer} from "../Components/Elements/Exam/EditorPage/Page/redux-store/reducer";
import {examResultsByIDReducer} from "../Components/Elements/Exam/ExamResultsByID/redux-store/reducer";
import {combineReducers} from '@reduxjs/toolkit'
import StatusEditorSlice from "../Components/Elements/StatusEditor/redux-store/StatusEditorSlice";

enableMapSet()
export const RootReducer = combineReducers({
    examEditorPageReducer,
    statusEditorReducer,
    examEditorReducer,
    ExamByUIDReducer,
    examResultsByIDReducer,
    statusEditor: StatusEditorSlice,
});


