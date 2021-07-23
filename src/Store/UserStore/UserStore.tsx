import {autorun, makeAutoObservable, reaction} from "mobx"
import {GET_USER_DATA, LOGIN_MUTATION} from "./Struct";
import React from 'react';
import {ClientStorage} from "../ApolloStorage/ClientStorage";

class User{
    username = ''//Имя пользователя, отображается в навигационной панели
    mail = ''//Пока нигде не используется, может потом пригодится
    isLogin = false //Вошел ли пользователь в систему или нет
    userAccessLevel = "STUDENT"//Уровень доступа, если он будет ADMIN или TEACHER, то откроется редактор
    doLoginSuccess = false //Результат того, смог ли пользователь залогинется в компоненте Login
    doLoginReturnError = false //Нужна, чтобы понимать, что бы понимать, что при логине была получена ошибка
    clientStorage = ClientStorage//Получаем прямой доступ и подписку на изменение в хранилище @client
    //для Apollo (для Query и Mutation)

    constructor() {
        makeAutoObservable(this)
        autorun(()=>this.UpdateUser())
        reaction(()=>this.clientStorage.client, ()=>this.UpdateUser())
    }



    doLogin(mail, password){
        //Функция для того, чтобы можно было залогиниться, её основная задача в том,
        //чтобы получить новый токен, он отправляется в ClientStorage, где собирается новый
        //apollo client. Так же эта функция меняет isLogin, а это уже запускает авторан для
        //выкачивания всех данных о пользователе(выкаивание производится уже на новом @client)
        this.clientStorage.client
            .mutate({ mutation: LOGIN_MUTATION, variables:{
                pass: password,
                mail: mail
            }})
            .then( result=>{
                try{
                    if(result.data.tokenAuth.success){
                        // console.log("User Store data ------")
                        // console.log(result)
                        ClientStorage.changeToken(result.data.tokenAuth.token)
                        this.isLogin = true
                        this.doLoginSuccess = true
                        this.doLoginReturnError = false
                    }else{
                        this.doLoginSuccess = false
                        this.doLoginReturnError = true
                    }
                }
                catch (e){
                    console.log(e)
            }
        })
    }
    doUnLogin(){
        //Функция для выхода, при выходе сбрасывает вообще все переменные, связанные с пользователем
        this.clientStorage.changeToken('')//Уничтожаем старый токен
        this.username = ''//Чтобы не осталось имя того, кто был залогинен до этого
        this.mail = ''//Обнуляем не всякий случай
        this.isLogin = false//Обновит навигацию и роуты
        this.userAccessLevel = "STUDENT"//На всякий случай забирем право на использование редактора
        this.doLoginSuccess = false //Обнуляем все переменные связанные с прозессом логина
        this.doLoginReturnError = false //Обнуляем все переменные связанные с прозессом логина
        ClientStorage.changeToken('')//Обновляем токен
    }

    UpdateUser() {
        if(this.clientStorage.client){
            //Функция, которая получает всю информацию о пользователе
            this.clientStorage.client
                    .query({
                        query: GET_USER_DATA
                    })
                    .then(result => {
                        this.username = result.data.me.username
                        this.userAccessLevel = result.data.me.userAccessLevel
                        this.isLogin = true
                        console.log("TRY TO UPDATE USER DATA")
                    })
                    .catch(() =>{
                        //На всякий случай при неудачном логирование обнуляем свойства пользователя
                        this.isLogin = false
                        this.username = ''
                        this.userAccessLevel = "STUDENT"
                    })
        }
        console.log("UPDATE USER DATA")
    }
}
export const UserStorage =  new User()