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

import React, {useState} from 'react';
import './App.css';
import {Navibar} from './Components/Navbar/Navibar';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useEffect} from "react";
import {UserStorage} from './Store/UserStore/UserStore'



import  { BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";


import {Login} from "./Components/Login/Login"
import {ApolloProvider} from "@apollo/client";
import {UnLogin} from "./Components/Login/UnLogin";
import {Registration} from "./Components/Login/Registration";
import LCUpdateQuestion from "./Components/UserTest/Editor/UpdateQuestion/[LC]UpdateQuestion";
import {EditorsRouter} from "./Components/EditorsRouter";
import {MainUserQuestionPage} from "./Components/UserTest/MainUserQuestionPage/MainUserQuestionPage";
import QuestionByID from "./Components/UserTest/QuestionByID";
import ImageQuestion from "./Components/UserTest/ImageQuestion/ImageQuestion";
import Typist from 'react-typist';
import {MainCardPublicView} from "./Components/Cards/Public/MainCardPublicView";
import {MainCoursePublicView} from "./Components/Course/Public/MainCoursePublicView";
import QSByID from "./Components/QuestionSequence/Public/QSByID";
import { observer } from "mobx-react"
import {ClientStorage} from "./Store/ApolloStorage/ClientStorage";

const  App = observer(() => {
    const [animationState, setAnimationState] = useState(false)

    useEffect(() =>{
        setTimeout(setAnimationState, 1500, true)
    }, [])

    if (!animationState){
        return(
            <Typist className="display-4 text-center mt-4 rl" style={{fontSize: '33px', fontFamily: "Raleway"}}>
                Study Ways
                {/*<div className="Loading-Text">*/}
                {/*    Fire build*/}
                {/*</div>*/}
            </Typist>)
    }

    return (
    <>
        <ApolloProvider client={ClientStorage.client}>
            <Router>
                <Navibar/>
                <Switch>
                    {/*<Route exact path="/" ><Redirect to="/courses"/></Route>*/}
                    {/*------------TEMP------------------*/}
                    <Route exact path="/sequences" component={QSByID}/>
                    {/*<Route exact path="/se" component={SearchingElementsPage}/>*/}
                    {/*<Route exact path="/qe" component={QuestionSequenceMainEditor}/>*/}
                    {/*<Route exact path="/cad" component={LCCardAuthorEditor}/>*/}
                    {/*<Route exact path="/utae" component={LCUserTestAuthorEditor}/>*/}
                    {/*<Route exact path="/utte" component={LCUserTestThemeEditor}/>*/}
                    {/*<Route exact path="/cte" component={LCCardThemeEditor}/>*/}
                    {/*----------TEMP--------------------*/}

                    <Route exact path="/login" component={Login}/>
                    <Route exact path="/unlogin" component={UnLogin}/>
                    <Route exact path="/registration" component={Registration}/>
                    <Route exact path="/editor" component={UserStorage.isLogin !== null? EditorsRouter: Login}/>

                    <Route  path="/q/:id" component={QuestionByID}/>
                    <Route exact path="/iq/:id" component={ImageQuestion}/>

                    <Route exact path="/test" component={MainUserQuestionPage}/>
                    <Route exact path="/cards" component={MainCardPublicView}/>
                    <Route exact path="/courses" component={MainCoursePublicView}/>
                    <Redirect to="/courses"/>
                </Switch>
                {/*{height/width >= 1 && <Navibar/>}*/}
            </Router>
        </ApolloProvider>
    </>
  );
})
export default App;
