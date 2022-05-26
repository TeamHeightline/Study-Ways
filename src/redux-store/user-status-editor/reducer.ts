import {
    ST_EDITOR_CHANGE_ACTIVE_EDIT_USER_ID,
    ST_EDITOR_CHANGE_ACTIVE_EDIT_USER_STATUS,
    ST_EDITOR_CHANGE_SEARCH_TEXT,
    ST_EDITOR_LOAD_USER_ERROR,
    ST_EDITOR_LOAD_USER_SUCCESS,
    ST_EDITOR_SEARCH_USERS,
    ST_EDITOR_START_LOADING_USERS,
    ST_EDITOR_START_UPDATE_STATUS,
    ST_EDITOR_UPDATE_STATUS_ERROR,
    ST_EDITOR_UPDATE_STATUS_SUCCESS
} from "../ActionTypes";
import {initialState} from "./initial-state";
import {IBasicUserInformation} from "../../ServerLayer/Types/user.types";


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
                selected_users: action.users,
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

        case ST_EDITOR_START_UPDATE_STATUS:
            return {
                ...state,
                loading_update_status: true
            }

        case ST_EDITOR_UPDATE_STATUS_SUCCESS:
            //return state with new user array with user with new user_access_level from action
            return {
                ...state,
                users: state.users.map((user: IBasicUserInformation) => {
                    if (user.id == action.userData.id) {
                        return {...user, user_access_level: action.userData.user_access_level}
                    } else {
                        return user
                    }
                }),
                loading_update_status: false
            }


        // case ST_EDITOR_UPDATE_STATUS_SUCCESS:
        //     console.log(action.userData)
        //     return produce(state, draft => {
        //         draft.loading_update_status = false
        //         // @ts-ignore
        //         let editedUser: any = draft.users.find((user) => user.id = action.userData.id)
        //         if (editedUser) {
        //             editedUser.user_access_level = action.userData.user_access_level
        //         }
        //     })

        case ST_EDITOR_UPDATE_STATUS_ERROR:
            return {
                ...state,
                loading_update_status: false,
                update_status_error: action.error
            }

        case ST_EDITOR_CHANGE_SEARCH_TEXT:
            return {
                ...state,
                search_text: action.text,
            }

        case ST_EDITOR_SEARCH_USERS:
            if (!state.search_text) {
                return {
                    ...state,
                    selected_users: state.users
                }
            }
            return {
                ...state,
                selected_users: state.users.filter((user: IBasicUserInformation) => (
                        String(user.id).toLowerCase()
                        + user.username.toLowerCase()
                        + user?.users_userprofile?.firstname.toLowerCase()
                        + user?.users_userprofile?.lastname.toLowerCase()
                    ).includes(state.search_text.toLowerCase())
                )
            }

        default:
            return state;
    }
}
