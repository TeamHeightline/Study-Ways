import axiosClient from "./config";
import {IBasicUserInformation} from "../Types/user.types";

export async function loadAllUsers() {
    return axiosClient.get<{ allUsers: IBasicUserInformation[] }>("/user/all/data")
}

export async function updateUserStatus(userID, status) {
    return axiosClient.post("/user/status/update", {
        user_id: userID,
        user_access_level: status
    })
}
