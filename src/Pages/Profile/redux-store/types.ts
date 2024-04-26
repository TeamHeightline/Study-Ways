interface IUser {
    id: number,
    username: string,
}

export interface IProfile {
    user_id: number,
    firstname: string,
    lastname: string,
    avatar_src: string,
    study_in_id: number,
    group: string,
    users_customuser: IUser
}