import {makeAutoObservable} from "mobx"
import React from 'react';
import {ClientStorage} from "../ApolloStorage/ClientStorage";
import axiosClient from "../../ServerLayer/QueryLayer/config";

interface IBasicUserData {
    id: number,
    username: string,
    user_access_level: "STUDENT" | "TEACHER" | "ADMIN"
}

class User {
    clientStorage = ClientStorage//Получаем прямой доступ и подписку на изменение в хранилище @client
    user_data: IBasicUserData | null = null

    constructor() {
        makeAutoObservable(this)
    }

    get isLogin() {
        return !!this?.user_data?.id
    }

    get userAccessLevel() {
        return this.user_data?.user_access_level ?? "STUDENT"
    }

    get username() {
        return this.user_data?.username ?? ''
    }

    get userIDForRecombee() {
        return this.user_data?.id ?? "-1"
    }


    reloadUser() {
        axiosClient
            .get<IBasicUserData>("/page/me/basic-data")
            .then((res) => {
                this.user_data = res.data
            })
    }
}

export const UserStorage = new User()
