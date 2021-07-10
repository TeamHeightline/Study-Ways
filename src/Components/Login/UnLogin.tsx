// Все гениальное - просто, а UnLogin - еще проще, еще бы работал с первого раза

import * as React from 'react'
// import 'react-bootstrap';
import {Spinner} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import {observer} from "mobx-react";
import User from "../../Store/UserStore/UserStore"
import {useEffect} from "react";
export const  UnLogin = observer(() =>{
    const history = useHistory();
    const _ = () =>{
        User.doUnLogin()
        setTimeout(history.push, 200, '/')
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