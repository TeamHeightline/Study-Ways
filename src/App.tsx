//23 июля начат процесс полного переписывания проекта на mobX, документация может быть устаревшей
//10 августа, документация ОЧЕНЬ сильно устарела, вернее сказать, она в принципе ни как не связана с реальностью
//22 января - проект переписывается на новую архитектуру, селекторы выделены в независимый слой, вся логика в сторах
//8 июня - проект уже как минимум месяц пишется исключительно на Redux, MobX оказался плохим выбором

import React, {useEffect} from 'react';
import './App.css';
import {Navibar} from './SharedComponents/Navbar/Navibar';
import {UserStorage} from './Store/UserStore/UserStore'


import {BrowserRouter as Router} from "react-router-dom";


import {ApolloProvider} from "@apollo/client";
import {observer} from "mobx-react"
import {ClientStorage} from "./Store/ApolloStorage/ClientStorage";
import {CircularProgress, Grid} from "@mui/material";
import {useAuth0} from "@auth0/auth0-react";
import SeoData from "./seo-data";
import axiosClient from "./ServerLayer/QueryLayer/config";
import AppRoutes from "./Routers/PublicRouter";
import AppHook from "./app.hook";

const App = observer(() => {
    const {isLoading} = AppHook();

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
                    <AppRoutes/>
                </Router>
            </ApolloProvider>
        </>
    );
})
export default App;
