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

import React, {useState} from 'react';
import './App.css';
import {Navibar} from './Components/PublicPages/Navbar/Navibar';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useEffect} from "react";
import {UserStorage} from './Store/UserStore/UserStore'



import  { BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";


import {Login} from "./Components/PublicPages/Login/Login"
import {ApolloProvider} from "@apollo/client";
import {UnLogin} from "./Components/PublicPages/Login/UnLogin";
import {Registration} from "./Components/PublicPages/Login/Registration";
import {EditorsRouter} from "./Components/PrivatePages/EditorsRouter";
import {MainUserQuestionPage} from "./Components/PublicPages/MainUserQuestionPage";

import ImageQuestion from "./Components/Elements/UserTest/ImageQuestion/ImageQuestion";
import Typist from 'react-typist';
import {MainCardPublicView} from "./Components/PublicPages/MainCardPublicView";
import {MainCoursePublicView} from "./Components/PublicPages/MainCoursePublicView";
import QSByID from "./Components/Elements/QuestionSequence/Public/QSByID";
import { observer } from "mobx-react"
import {ClientStorage} from "./Store/ApolloStorage/ClientStorage";
import {MainDirectionWay} from "./Components/PublicPages/MainDirectionWay";

const  App = observer(() => {
    const [animationState, setAnimationState] = useState(false)

    useEffect(() =>{
        setTimeout(setAnimationState, 1500, true)
    }, [])

    if (!animationState){
        return(
            <Typist className="display-4 text-center mt-4 rl App-header"
                    style={{fontSize: '33px', fontFamily: "Raleway", color: "#ffffff"}}>
                Study Ways
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
                    {/*<Route exact path="/se" component={SearchingElementsEditor}/>*/}
                    {/*<Route exact path="/qe" component={QuestionSequenceMainEditor}/>*/}
                    {/*<Route exact path="/cad" component={LCCardAuthorEditor}/>*/}
                    {/*<Route exact path="/utae" component={LCUserTestAuthorEditor}/>*/}
                    {/*<Route exact path="/utte" component={LCUserTestThemeEditor}/>*/}
                    {/*<Route exact path="/cte" component={LCCardThemeEditor}/>*/}
                    {/*----------TEMP--------------------*/}

                    <Route exact path="/login" component={Login}/>
                    <Route exact path="/unlogin" component={UnLogin}/>
                    <Route exact path="/registration" component={Registration}/>
                    <Route path="/editor" component={UserStorage.isLogin !== null? EditorsRouter: Login}/>

                    <Route exact path="/iq/:id" component={ImageQuestion}/>

                    <Route exact path="/test" component={MainUserQuestionPage}/>
                    <Route exact path="/cards" component={MainCardPublicView}/>
                    <Route exact path="/courses" component={MainCoursePublicView}/>
                    <Route exact path="/direction" component={MainDirectionWay}/>
                    <Redirect to="/courses"/>
                </Switch>
                {/*{height/width >= 1 && <Navibar/>}*/}
            </Router>
        </ApolloProvider>
    </>
  );
})
export default App;
