import { makeAutoObservable } from "mobx"
import {useLazyQuery, useMutation, useQuery} from "@apollo/client";
import {GET_USER_DATA, LOGIN_MUTATION} from "./Struct";
import React from 'react';
import {client} from '../../index'


class User{
    username = ''
    mail = ''
    isLogin = false
    userAccessLevel = "STUDENT"
    token = localStorage.getItem('token');

    constructor() {
        makeAutoObservable(this)
    }
    doLogin(mail, password){
        const [login] = useMutation(LOGIN_MUTATION, {
            variables: {
                pass: password,
                mail: mail
            },
            onCompleted: data =>{
                console.log(" User Store data ------ " )
                console.log(data)
            }
        })
        login()
    }
    checkLogin() {
        client
        .query({
            query: GET_USER_DATA
        })
        .then(result => {
            try{
                console.log("OPEN FROM STORAGE")
                console.log(result)
                this.username = result.data.me.username
                this.userAccessLevel = result.data.me.userAccessLevel
                this.isLogin = true
            }
            catch (e) {
                console.log(e)
            }
        });
    }
}
export default new User