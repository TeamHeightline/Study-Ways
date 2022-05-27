import {combineReducers} from "redux";
import {statusEditorReducer} from "./user-status-editor/reducer";
import {examEditorReducer} from "./exam-editor/reducer";

export const RootReducer = combineReducers({
    statusEditorReducer,
    examEditorReducer
});

export type RootState = ReturnType<typeof RootReducer>
