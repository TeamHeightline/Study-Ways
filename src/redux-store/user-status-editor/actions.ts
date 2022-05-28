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
import {IBasicUserInformation} from "../../ServerLayer/Types/user.types";

export function successLoadUsers(users: IBasicUserInformation[]) {
    return {
        type: LOAD_USER_SUCCESS,
        users
    }
}

export function startLoadingUsers() {
    return {
        type: START_LOADING_USERS
    }
}

export function loadingUsersError(error) {
    return {
        type: LOAD_USER_ERROR,
        error
    }
}

export function changeEditUserID(userID: number | null) {
    return {
        type: CHANGE_ACTIVE_EDIT_USER_ID,
        userID
    }
}

export function changeEditUserStatus(status) {
    return {
        type: CHANGE_ACTIVE_EDIT_USER_STATUS,
        status
    }
}

export function startUpdateStatus() {
    return {
        type: START_UPDATE_STATUS
    }
}

export function updateStatusSuccess(userData) {
    return {
        type: UPDATE_STATUS_SUCCESS,
        userData
    }
}

export function updateStatusError(error) {
    return {
        type: UPDATE_STATUS_ERROR,
        error
    }
}

export function changeSearchText(text) {
    return {
        type: CHANGE_SEARCH_TEXT,
        text
    }
}

export function searchUsers() {
    return {
        type: SEARCH_USERS
    }
}

