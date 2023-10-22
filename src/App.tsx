//23 июля начат процесс полного переписывания проекта на mobX, документация может быть устаревшей
//10 августа, документация ОЧЕНЬ сильно устарела, вернее сказать, она в принципе ни как не связана с реальностью
//22 января - проект переписывается на новую архитектуру, селекторы выделены в независимый слой, вся логика в сторах
//8 июня - проект уже как минимум месяц пишется исключительно на Redux, MobX оказался плохим выбором

import React, {Suspense, useEffect} from 'react';
import './App.css';
import {Navibar} from './SharedComponents/Navbar/Navibar';
import {UserStorage} from './Store/UserStore/UserStore'


import {BrowserRouter as Router, Route, Routes,} from "react-router-dom";


import {ApolloProvider} from "@apollo/client";
import {observer} from "mobx-react"
import {ClientStorage} from "./Store/ApolloStorage/ClientStorage";
import {RequireLogInAlert} from "./SharedComponents/Notifications/RequireLogInAlert";
import {CircularProgress, Grid} from "@mui/material";
import Auth0Login from "./Pages/Auth0/auth0-login";
import Auth0AfterLogin from "./Pages/Auth0/auth0-after-login";
import {useAuth0} from "@auth0/auth0-react";
import CardByURL from "./Pages/Cards/CardByURL/UI/card-by-url";
import SeoData from "./seo-data";
import ProfilePage from "./Pages/Profile/UI/ProfilePage";
import axiosClient from "./ServerLayer/QueryLayer/config";
import CardByID from "./Pages/Cards/CardByID/UI/card-by-id";
import PublicRouter from "./Routers/PublicRouter";

const App = observer(() => {
    const {
        isLoading,
        isAuthenticated,
        getAccessTokenSilently
    } = useAuth0();


    useEffect(() => {
        if (isAuthenticated) {
            getAccessTokenSilently({
                audience: `sw-backend-identifier`,
                scope: "read:current_user",
            }).then((user_token) => {
                ClientStorage.changeToken(user_token)

                axiosClient.interceptors.request.use((config: any) => {
                    config.headers.common["authorization"] = "Bearer " + user_token;
                    config.headers.post["authorization"] = "Bearer " + user_token;
                    return config;
                })

                UserStorage.reloadUser()
            })
        } else {
            ClientStorage.changeToken("")
        }

    }, [isAuthenticated, isLoading])

    if (isLoading) {
        return <Grid container justifyContent={"center"}
                     sx={{pt: 4}}>
            <SeoData/>
            <CircularProgress/>
        </Grid>;
    }

    return (
        <>
            <ApolloProvider client={ClientStorage.client}>
                <Router>
                    <Navibar/>
                    <SeoData/>
                    <PublicRouter/>
                </Router>
            </ApolloProvider>
        </>
    );
})
export default App;
