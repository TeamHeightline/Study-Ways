import {autorun, makeAutoObservable, reaction} from "mobx"
import {
    GET_USER_DATA,
} from "./Struct";
import React from 'react';
import {ClientStorage} from "../ApolloStorage/ClientStorage";

class User {
    username = ''//Имя пользователя, отображается в навигационной панели
    isLogin = false //Вошел ли пользователь в систему или нет
    userAccessLevel = "STUDENT"//Уровень доступа, если он будет ADMIN или TEACHER, то откроется редактор
    clientStorage = ClientStorage//Получаем прямой доступ и подписку на изменение в хранилище @client
    //для Apollo (для Query и Mutation)

    constructor() {
        makeAutoObservable(this)
        autorun(() => this.UpdateUser())
        reaction(() => this.clientStorage.client, () => this.UpdateUser())
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
}

export const UserStorage = new User()