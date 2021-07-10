import {autorun, makeAutoObservable} from "mobx"
import {GET_USER_DATA, LOGIN_MUTATION} from "./Struct";
import React from 'react';
import ClientStorage from "../ApolloStorage/ClientStorage";

class User{
    username = ''
    mail = ''
    isLogin = false
    userAccessLevel = "STUDENT"
    doLoginSuccess = false //Результат того, смог ли пользователь залогинется в компоненте Login
    doLoginReturnError = false //Нужна, чтобы понимать, что бы понимать, что при логине была получена ошибка
    clientStorage = ClientStorage

    constructor() {
        makeAutoObservable(this)
        autorun(() => this.UpdateUser())
    }



    doLogin(mail, password){
        this.clientStorage.AutoUpdatedApolloClient
            .mutate({ mutation: LOGIN_MUTATION, variables:{
                pass: password,
                mail: mail
            }})
            .then( result=>{
                try{
                    if(result.data.tokenAuth.success){
                        // console.log("User Store data ------")
                        // console.log(result)
                        this.clientStorage.changeToken(result.data.tokenAuth.token)
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
        this.clientStorage.changeToken('')//Уничтожаем старый токен
        this.username = ''//Чтобы не осталось имя того, кто был залогинен до этого
        this.mail = ''//Обнуляем не всякий случай
        this.isLogin = false//Обновит навигацию и роуты
        this.userAccessLevel = "STUDENT"//На всякий случай забирем право на использование редактора
        this.doLoginSuccess = false //Обнуляем все переменные связанные с прозессом логина
        this.doLoginReturnError = false //Обнуляем все переменные связанные с прозессом логина
        this.clientStorage = ClientStorage//Обновляем клиент
    }

    UpdateUser() {
        if(this.doLoginSuccess || this.isLogin || this.clientStorage.token !=''){
            this.clientStorage.AutoUpdatedApolloClient
                .query({
                    query: GET_USER_DATA
                })
                .then(result => {
                    try{
                        // console.log("OPEN FROM STORAGE")
                        // console.log(result)
                        this.username = result.data.me.username
                        this.userAccessLevel = result.data.me.userAccessLevel
                        this.isLogin = true
                    }
                    catch (e) {
                        console.log(e)
                    }
                })

        }else{
            this.isLogin = false
            this.username = ''
            this.userAccessLevel = "STUDENT"
        }
    }
}
export default new User