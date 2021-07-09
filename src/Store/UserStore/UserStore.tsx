import { makeAutoObservable } from "mobx"
import {useLazyQuery, useMutation, useQuery} from "@apollo/client";
import {GET_USER_DATA, LOGIN_MUTATION} from "./Struct";
import React from 'react';
import ClientStorage from "../ApolloStorage/ClientStorage";
// import {client} from '../../index'


class User{
    username = ''
    mail = ''
    isLogin = false
    userAccessLevel = "STUDENT"
    token = localStorage.getItem('token');
    doLoginSuccess = false //Результат того, смог ли пользователь залогинется в компоненте Login
    doLoginReturnError = false //Нужна, чтобы понимать, что бы понимать, что при логине была получена ошибка
    clientStorage = ClientStorage

    constructor() {
        makeAutoObservable(this)
    }

    changeDoLoginVariables(Success, Errors){
        this.doLoginSuccess = Success
        this.doLoginReturnError = Errors
    }
    changeIslogin(isLogin){
        this.isLogin = isLogin
    }
    changeUserAccessLevel(accessLevel){
        this.userAccessLevel = accessLevel
    }
    changeUsername(userName){
        this.username = userName
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
                        console.log("User Store data ------")
                        console.log(result)
                        this.clientStorage.changeToken(result.data.tokenAuth.token)
                        this.changeIslogin(true)
                        this.changeDoLoginVariables(true, false)
                        this.checkLogin()
                    }else{
                        this.changeDoLoginVariables(false, true)
                    }
                }
                catch (e){
                    console.log(e)
            }
        })

    }
    checkLogin() {
        this.clientStorage.AutoUpdatedApolloClient
            .query({
                query: GET_USER_DATA
            })
            .then(result => {
                try{
                    console.log("OPEN FROM STORAGE")
                    console.log(result)
                    this.changeUsername(result.data.me.username)
                    this.changeUserAccessLevel(result.data.me.userAccessLevel)
                    this.changeIslogin(true)
                }
                catch (e) {
                    console.log(e)
                }
            });
    }
}
export default new User