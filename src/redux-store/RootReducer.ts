import {combineReducers} from "redux";
import {statusEditorReducer} from "./user-status-editor/reducer";

export const RootReducer = combineReducers({
    statusEditorReducer
});

export type RootState = ReturnType<typeof RootReducer>
