// Все гениальное - просто, а UnLogin - еще проще, еще бы работал с первого раза

import * as React from 'react'
import {Spinner} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import {observer} from "mobx-react";
import {UserStorage} from "../../Store/UserStore/UserStore"
import {useEffect} from "react";
export const  UnLogin = observer(() =>{
    const history = useHistory();
    const _ = () =>{ //Необходимо, чтобы функция doUnLogin выполнилась один раз. Когда она выполнится
        //произойдет одновления стейта UnLogin, и если User.doUnLogin() будет не в UseEffect, то
        //обновление будет вечное, сайт просто зависнит
        UserStorage.doUnLogin()//Выполняем выход из аккаунта
        setTimeout(history.push, 200, '/')//Редирект на основную страницу
    }
    useEffect(() =>{
        _()
    }, [])
    return(
        <div className="col-1 offset-6 justify-content-center mt-4">
            <Spinner animation="border" variant="primary" />
        </div>
    )
})