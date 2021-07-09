// Все гениальное - просто, а UnLogin - еще проще, еще бы работал с первого раза

import * as React from 'react'
// import 'react-bootstrap';
import {Spinner} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import {observer} from "mobx-react";
import User from "../../Store/UserStore/UserStore"
import ClientStorage from "../../Store/ApolloStorage/ClientStorage";
export const  UnLogin = observer(() =>{
    User.changeIslogin(false)
    User.changeUserAccessLevel("STUDENT")
    ClientStorage.changeToken('')
    const history = useHistory();
    setTimeout(history.push, 200, '/')
    return(
        <div className="col-1 offset-6 justify-content-center mt-4">
            <Spinner animation="border" variant="primary" />
        </div>
    )
})