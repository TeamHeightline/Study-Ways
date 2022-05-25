import axiosClient from "./config";

export async function loadAllUsers() {
    return axiosClient.get("/user/all/data")
}

export async function updateUserStatus(userID, status) {
    return axiosClient.post("/user/status/update", {
        user_id: userID,
        user_access_level: status
    })
}
