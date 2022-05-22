import {ST_EDITOR_LOAD_USER_ERROR, ST_EDITOR_LOAD_USER_SUCCESS, ST_EDITOR_START_LOADING_USERS} from "../ActionTypes";
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

