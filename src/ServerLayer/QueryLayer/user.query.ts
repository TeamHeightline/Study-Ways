import axiosClient from "./config";

export async function loadAllUsers() {
    return axiosClient.get("/user/all/data")
}
