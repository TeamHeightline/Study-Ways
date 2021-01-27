import React from 'react';
import 'react-bootstrap';
import {Button} from "react-bootstrap";

let isLogin = false;

function content(isLogin){
    if (isLogin){
        return(
            <>
                <Button variant="danger">Выйти</Button>
            </>
        )
    }
    else {
        return(
            <>
                <Button variant={"primary"}>Войти</Button>
            </>
        )
    }
}

export default function IsLogin(){
    return(content(isLogin))}