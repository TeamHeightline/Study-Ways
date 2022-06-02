import {loadAllUsers, updateUserStatus} from "../../../../ServerLayer/QueryLayer/user.query";
import {
    loadingUsersError,
    startLoadingUsers,
    startUpdateStatus,
    successLoadUsers,
    updateStatusError,
    updateStatusSuccess
} from "./actions";

export const loadUsersAsync = () => (dispatch) => {
    dispatch(startLoadingUsers());

    return loadAllUsers()
        .then((res) => dispatch(successLoadUsers(res.data.allUsers)))
        .catch((error) => dispatch(loadingUsersError(error.message)));

};


export const statusEditorUpdateUserStatus = (userID, status) => (dispatch) => {
    dispatch(startUpdateStatus())

    return updateUserStatus(userID, status)
        .then((res) => dispatch(updateStatusSuccess(res.data.updatedUser)))
        .catch((error) => dispatch(updateStatusError(error.message)))
}

