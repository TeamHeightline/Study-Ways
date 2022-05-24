import {
    ST_EDITOR_CHANGE_ACTIVE_EDIT_USER_ID,
    ST_EDITOR_CHANGE_ACTIVE_EDIT_USER_STATUS,
    ST_EDITOR_LOAD_USER_ERROR,
    ST_EDITOR_LOAD_USER_SUCCESS,
    ST_EDITOR_START_LOADING_USERS
} from "../ActionTypes";
import {initialState} from "./initial-state";


export const statusEditorReducer = (state = initialState, action) => {
    switch (action.type) {

        case ST_EDITOR_START_LOADING_USERS: {
            return {
                ...state,
                loading: true
            }
        }

        case ST_EDITOR_LOAD_USER_ERROR: {
            return {
                ...state,
                loading: false,
                error: action.error
            }
        }

        case ST_EDITOR_LOAD_USER_SUCCESS:
            return {
                ...state,
                users: action.users,
                loading: false
            }

        case ST_EDITOR_CHANGE_ACTIVE_EDIT_USER_ID:
            return {
                ...state,
                activeEditUserID: action.userID
            }

        case ST_EDITOR_CHANGE_ACTIVE_EDIT_USER_STATUS:
            return {
                ...state,
                activeEditUserStatus: action.status
            }

        default:
            return state;
    }
}
