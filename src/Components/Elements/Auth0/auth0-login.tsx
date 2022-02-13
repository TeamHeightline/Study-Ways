import {observer} from "mobx-react";
import React, {useEffect} from 'react';
import { useAuth0 } from "@auth0/auth0-react";


interface IAuth0LoginProps extends React.HTMLAttributes<HTMLDivElement>{

}

const Auth0Login = observer(({...props}: IAuth0LoginProps) =>{
    const { loginWithRedirect } = useAuth0();

    useEffect(() => {
        loginWithRedirect()
    }, [])
    return(
        <div {...props}>

        </div>
    )
})

export default Auth0Login