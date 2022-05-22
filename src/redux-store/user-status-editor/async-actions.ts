import {loadAllUsers} from "../../ServerLayer/QueryLayer/user.query";
import {loadingUsersError, startLoadingUsers, successLoadUsers} from "./actions";

export const loadUsersAsync = () => (dispatch) => {
    dispatch(startLoadingUsers());

    return loadAllUsers()
        .then((res) => dispatch(successLoadUsers(res.data.allUsers)))
        .catch((error) => dispatch(loadingUsersError(error.message)));

};

