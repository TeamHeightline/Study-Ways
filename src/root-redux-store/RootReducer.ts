import {combineReducers} from "redux";
import {statusEditorReducer} from "../Components/Elements/StatusEditor/redux-store/reducer";
import {examEditorReducer} from "../Components/Elements/Exam/EditorPage/ExamByID/redux-store/reducer";

export const RootReducer = combineReducers({
    statusEditorReducer,
    examEditorReducer
});

export type RootState = ReturnType<typeof RootReducer>
