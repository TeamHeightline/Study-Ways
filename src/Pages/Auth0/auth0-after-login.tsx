import {observer} from "mobx-react";
import React, {useEffect} from 'react';
import {useAuth0} from "@auth0/auth0-react";
import {ClientStorage} from "../../Store/ApolloStorage/ClientStorage";

interface IAuth0AfterLoginProps extends React.HTMLAttributes<HTMLDivElement> {

}

const Auth0AfterLogin = observer(({...props}: IAuth0AfterLoginProps) => {
    const {isAuthenticated, getAccessTokenSilently} = useAuth0();

    useEffect(() => {
        if (isAuthenticated) {
            getAccessTokenSilently({
                audience: `sw-backend-identifier`,
                scope: "read:current_user",
            }).then((user_token) => {
                ClientStorage.changeToken(user_token)
            })
        }
    }, [])
    return (
        <div {...props}>

        </div>
    )
})

export default Auth0AfterLogin
