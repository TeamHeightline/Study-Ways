import * as React from 'react'
// import 'react-bootstrap';
import {Spinner} from "react-bootstrap";
import {useHistory} from "react-router-dom";

export default function UnLogin(){
    const history = useHistory();
    localStorage.setItem('token', 'wrong key')
    localStorage.setItem('is_login', 'false')
    localStorage.setItem('user_name', '')
    localStorage.setItem('refreshToken', 'wrong refresh token')
    setTimeout(history.push, 500, '/')
    return(
        <div className="col-1 offset-6 justify-content-center mt-4">
        <Spinner animation="border" variant="primary" />
        </div>
    )
}