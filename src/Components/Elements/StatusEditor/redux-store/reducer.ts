import {
    CHANGE_ACTIVE_EDIT_USER_ID,
    CHANGE_ACTIVE_EDIT_USER_STATUS,
    CHANGE_SEARCH_TEXT,
    LOAD_USER_ERROR,
    LOAD_USER_SUCCESS,
    SEARCH_USERS,
    START_LOADING_USERS,
    START_UPDATE_STATUS,
    UPDATE_STATUS_ERROR,
    UPDATE_STATUS_SUCCESS
} from "./action-types";
import {initialState} from "./initial-state";
import {IBasicUserInformation} from "../../../../ServerLayer/Types/user.types";


export const statusEditorReducer = (state = initialState, action) => {
    switch (action.type) {

        case START_LOADING_USERS: {
            return {
                ...state,
                loading: true
            }
        }

        case LOAD_USER_ERROR: {
            return {
                ...state,
                loading: false,
                error: action.error
            }
        }

        case LOAD_USER_SUCCESS:
            return {
                ...state,
                users: action.users,
                selected_users: action.users,
                loading: false
            }

        case CHANGE_ACTIVE_EDIT_USER_ID:
            return {
                ...state,
                activeEditUserID: action.userID
            }

        case CHANGE_ACTIVE_EDIT_USER_STATUS:
            return {
                ...state,
                activeEditUserStatus: action.status
            }

        case START_UPDATE_STATUS:
            return {
                ...state,
                loading_update_status: true
            }

        case UPDATE_STATUS_SUCCESS:
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


        // case UPDATE_STATUS_SUCCESS:
        //     console.log(action.userData)
        //     return produce(state, draft => {
        //         draft.loading_update_status = false
        //         // @ts-ignore
        //         let editedUser: any = draft.users.find((user) => user.id = action.userData.id)
        //         if (editedUser) {
        //             editedUser.user_access_level = action.userData.user_access_level
        //         }
        //     })

        case UPDATE_STATUS_ERROR:
            return {
                ...state,
                loading_update_status: false,
                update_status_error: action.error
            }

        case CHANGE_SEARCH_TEXT:
            return {
                ...state,
                search_text: action.text,
            }

        case SEARCH_USERS:
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
