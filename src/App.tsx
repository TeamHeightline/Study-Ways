// Документация, ты ли это...
// Если по делу, сейчас 8 июня, а проект начался 4 месяца назад, я уже не помню, что здесь и как, но
// постараюсь рассказать. Здесь у нас происходит роутинг, при первой загрузки тайпист будет писать
// 'Загрузка Study Ways' - на самом деле, это создано для отвлечения от мутации VERIFY_LOGIN, она
// проверяет правильность токена, так же у нас проходит проверка, есть ли вообще ячейки для логина
// токена и рефреш токена в локальном хранилище, после этого срабатывает "me" запрос, он достает все данные
// о пользователи, если он проходит, то система думает, что пользователь залогинен, такой же запрос
// происходит в навигационной панели, ожидается, то там он уже будет поднят из кэша, а не будет ходить
// на сервер, на практике, никто не знает, что там на самом деле происходит.
// Важный момент, App.js не проверяет уровень доступа пользователя, подразумевается, что это делает
// вызываемый компонент.
// Следующая часть рассказа в Navbar.tsx

//23 июля начат процесс полного переписывания проекта на mobX, документация может быть устаревшей
//10 августа, документация ОЧЕНЬ сильно устарела, вернее сказать, она в принципе ни как не связана с реальностью

import React, {Suspense} from 'react';
import './App.css';
import {Navibar} from './Components/PublicPages/Navbar/Navibar';
import 'bootstrap/dist/css/bootstrap.min.css';
import {UserStorage} from './Store/UserStore/UserStore'
import '@fontsource/roboto/300.css';



import  { BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";


import {Login} from "./Components/PublicPages/Login/Login"
import {ApolloProvider} from "@apollo/client";
import {UnLogin} from "./Components/PublicPages/Login/UnLogin";
import {Registration} from "./Components/PublicPages/Login/Registration";
const EditorsRouter = React.lazy(() => import("./Components/PrivatePages/EditorsRouter").then(module => ({default: module.EditorsRouter})))
const MainCardPublicView = React.lazy(() => import("./Components/PublicPages/MainCardPublicView").then(module => ({default: module.MainCardPublicView})))
const CodeEditor = React.lazy(() => import('./Components/PublicPages/CodeEditor').then(module => ({default: module.CodeEditor})))
const ThemeEditor = React.lazy(() => import("./Components/Elements/ThemeTree/ThemeEditor"))
const QSPlayerByID = React.lazy(() => import("./Components/Elements/QuestionSequence/Public/QSPlayerByID").then(module => ({default: module.QSPlayerByID})))
const ImageQuestion = React.lazy(() => import("./Components/Elements/UserTest/ImageQuestion/ImageQuestion").then(module => ({default: module.ImageQuestion})))

import {MainCoursePublicView} from "./Components/PublicPages/MainCoursePublicView";
import { observer } from "mobx-react"
import {ClientStorage} from "./Store/ApolloStorage/ClientStorage";
import {MainDirection} from "./Components/PublicPages/MainDirection";
import {LogInNotification} from "./Components/PublicPages/Login/#LogInNotification";
import CardByURL from "./Components/Elements/Cards/CardView/CardByURL";
import {isMobileHook} from "./CustomHooks/isMobileHook";
import {CircularProgress, Grid} from "@mui/material";


const  App = observer(() => {
    const isMobile = isMobileHook()
    return (
    <>
        <ApolloProvider client={ClientStorage.client}>
            <Router>
                <Navibar/>
                <div style={{paddingTop: isMobile? 0: 48}}>
                    <Suspense fallback={<Grid container justifyContent={"center"} sx={{pt: 4}}><CircularProgress /></Grid>}>
                    <LogInNotification/>
                        <Switch >
                            <Route exact path="/login" component={Login}/>
                            <Route exact path="/unlogin" component={UnLogin}/>
                            <Route exact path="/registration" component={Registration}/>
                            <Route path="/editor" component={UserStorage.isLogin !== null? EditorsRouter: Login}/>

                            <Route exact path="/iq/:id" component={ImageQuestion}/>
                            <Route exact path="/qs/:id" component={QSPlayerByID}/>

                            <Route exact path="/cards" component={MainCardPublicView}/>
                            <Route exact path={"/card/:id"} component={CardByURL}/>

                            <Route exact path="/courses" component={MainCoursePublicView}/>
                            <Route exact path="/direction" component={MainDirection}/>
                            <Route exact path="/cedit" component={CodeEditor}/>
                            <Route exact path="/tt" component={ThemeEditor}/>
                            <Redirect to="/courses"/>
                        </Switch>
                    </Suspense>
                </div>
            </Router>
        </ApolloProvider>
    </>
  );
})
export default App;
