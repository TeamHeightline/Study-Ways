import {UserStorage} from "../UserStore";

export default function haveStatus(statusArray: string[]){
    return statusArray.includes(UserStorage.userAccessLevel)
}