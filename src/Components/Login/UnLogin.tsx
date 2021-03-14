import * as React from 'react'
// import 'react-bootstrap';
import {Spinner} from "react-bootstrap";

export default function UnLogin(){
    localStorage.setItem('token', 'wrong key')
    localStorage.setItem('is_login', 'false')
    localStorage.setItem('user_name', '')
    localStorage.setItem('refreshToken', 'wrong refresh token')

    return(
        <div className="col-4 offset-4 justify-content-center mt-4">
        <Spinner animation="border" variant="primary" />
        </div>
    )
}