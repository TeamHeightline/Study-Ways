import {
    ST_EDITOR_CHANGE_ACTIVE_EDIT_USER_ID,
    ST_EDITOR_CHANGE_ACTIVE_EDIT_USER_STATUS,
    ST_EDITOR_LOAD_USER_ERROR,
    ST_EDITOR_LOAD_USER_SUCCESS,
    ST_EDITOR_START_LOADING_USERS
} from "../ActionTypes";
import {IBasicUserInformation} from "../../ServerLayer/Types/user.types";

export function successLoadUsers(users: IBasicUserInformation[]) {
    return {
        type: ST_EDITOR_LOAD_USER_SUCCESS,
        users
    }
}

export function startLoadingUsers() {
    return {
        type: ST_EDITOR_START_LOADING_USERS
    }
}

export function loadingUsersError(error) {
    return {
        type: ST_EDITOR_LOAD_USER_ERROR,
        error
    }
}

export function changeEditUserID(userID: number) {
    return {
        type: ST_EDITOR_CHANGE_ACTIVE_EDIT_USER_ID,
        userID
    }
}

export function changeEditUserStatus(status) {
    return {
        type: ST_EDITOR_CHANGE_ACTIVE_EDIT_USER_STATUS,
        status
    }
}

