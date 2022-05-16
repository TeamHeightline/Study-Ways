import {autorun, makeAutoObservable, reaction} from "mobx"
import {
    GET_USER_DATA,
} from "./Struct";
import React from 'react';
import {ClientStorage} from "../ApolloStorage/ClientStorage";
import {Query, UserProfileNode} from "../../SchemaTypes";
import {LoadUserProfile} from "../../Components/Elements/Profile/Store/query";

class User {
    username = ''//Имя пользователя, отображается в навигационной панели
    isLogin = false //Вошел ли пользователь в систему или нет
    userAccessLevel = "STUDENT"//Уровень доступа, если он будет ADMIN или TEACHER, то откроется редактор
    clientStorage = ClientStorage//Получаем прямой доступ и подписку на изменение в хранилище @client
    //для Apollo (для Query и Mutation)
    profile?: UserProfileNode
    profileLoaded = false

    constructor() {
        makeAutoObservable(this)
        autorun(() => this.UpdateUser())
        reaction(() => this.clientStorage.client, () => this.UpdateUser())
        reaction(() => this.isLogin, () => this.loadUserProfile())
    }


    UpdateUser() {
        if (this.clientStorage.client) {
            //Функция, которая получает всю информацию о пользователе
            this.clientStorage.client
                .query({
                    query: GET_USER_DATA,
                    errorPolicy: "all"
                })
                .then(result => {
                    this.username = result.data.me.username
                    this.userAccessLevel = result.data.me.userAccessLevel
                    this.isLogin = true
                    localStorage.setItem("username", result.data.me.username)
                })
                .catch(() => {
                    //На всякий случай при неудачном логирование обнуляем свойства пользователя
                    this.isLogin = false
                    this.username = ''
                    this.userAccessLevel = "STUDENT"
                })
        }
    }

    loadUserProfile = () => {
        if (this.isLogin) {
            this.clientStorage.client
                .query<Query>({
                    query: LoadUserProfile,
                    fetchPolicy: "network-only"
                })
                .then(res => res.data.myProfile)
                .then(profileData => {
                    if (profileData) {
                        this.profile = profileData
                    }
                    this.profileLoaded = true
                })
        }
    }
}

export const UserStorage = new User()