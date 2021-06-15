// Присвятая документация, ты ли это...
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

import React, {useState} from 'react';
import './App.css';
import Navibar from './Components/Navbar/Navibar.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useEffect} from "react";


import  { BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";

import {MainExperimental} from "./Components/Menu/MainMenu";
import Login from "./Components/Login/Login"
import {gql, useMutation, useQuery} from "@apollo/client";
import UnLogin from "./Components/Login/UnLogin";
import Registration from "./Components/Login/Registration";
import UpdateQuestion from "./Components/UserTest/Editor/UpdateQuestion";
import EditorsRouter from "./Components/EditorsRouter";
import MainUserTest from "./Components/UserTest/MainUserTest";
import QuestionByID from "./Components/UserTest/QuestionByID";
import CKEDITOR from "./Components/UserTest/Editor/CKEditor";
import ImageQuestion from "./Components/UserTest/ImageQuestion";
import CardView from "./Components/Cards/Card";
import CARDS from "./Components/Cards/Card";
import CardEditByID from "./Components/Cards/Editor/CardEditByID/CardEditByID";
import MainCardEditor from './Components/Cards/Editor/MainCardEditor/MainCardEditor'
import Typist from 'react-typist';
import EditCourseByID from "./Components/Course/Editor/EditCourseByID";
import MainCourseEditor from "./Components/Course/Editor/MainCourseEditor";
import MainCardPublicView from "./Components/Cards/Public/MainCardPublicView";
import MainCoursePublicView from "./Components/Course/Public/MainCoursePublicView";
const VERIFY_LOGIN = gql`
    mutation VERIFY_LOGIN($token: String!){
      verifyToken(token: $token){
        payload
        success
        errors
      }
    }
`

// const REFRESH_TOKEN = gql`
//     mutation REFRESH_TOKEN($refresh_token: String!){
//       refreshToken(refreshToken: $refresh_token){
//         token
//         refreshToken
//         payload
//         success
//         errors
//       }
//     }`
const GET_USER_DATA = gql`
    query{
        me{
            id
            firstName
            username
            userAccessLevel
        }
    }
`

function App() {
    const checkTokenAndLoginVariablesInLocalStore = () => {
        if (localStorage.getItem('token') === null){
            localStorage.setItem('token', 'wrong key')}
        if (localStorage.getItem('is_login') === null){
            localStorage.setItem('is_login', 'false')}
        if (localStorage.getItem('user_name') === null){
            localStorage.setItem('user_name', '')}
        if (localStorage.getItem('refreshToken') === null){
            localStorage.setItem('refreshToken', 'wrong refresh token')}
        // console.log(localStorage.getItem('token'))
        return(localStorage.getItem('token'))
    }
    const {data: user_data} = useQuery(GET_USER_DATA, {
        // pollInterval: 10000,
        onCompleted: data => {
            // console.log(data)
        },
        onError: error => {
            console.log(error)
        }
    })

    const [verify_login, { data, error }] = useMutation(VERIFY_LOGIN, {
        variables: {
            token: checkTokenAndLoginVariablesInLocalStore()
        },
        onCompleted: data1 => console.log("---------new login verify --------"),
        errorPolicy: 'all'
    })
    const [animationState, setAnimationState] = useState(false)
    useEffect(() =>{
        verify_login().then().catch(() => {localStorage.setItem('is_login', 'false')})
        setTimeout(setAnimationState, 3000, true)
    }, [])  //для создания фоновой задачи, перед запятой пишем setInterval

    if (!data || !animationState || !user_data){
        return  <Typist className="display-4 text-center mt-4 rl" style={{fontSize: '33px', fontFamily: "Raleway"}}>
            Загрузка Study Ways
        </Typist>
    }

    if(data.verifyToken.success === true){
        localStorage.setItem('is_login', 'true')
        localStorage.setItem('user_name', data.verifyToken.payload.username)
    }else{
        localStorage.setItem('is_login', 'false')
    }


  return (
    <>
        <Router>
            <Navibar/>
            <Switch>
                {/*<Route exact path="/" ><Redirect to="/courses"/></Route>*/}
                <Route exact path="/login" component={Login}/>
                <Route exact path="/unlogin" component={UnLogin}/>
                <Route exact path="/registration" component={Registration}/>
                <Route exact path="/editor" component={user_data.me !== null? EditorsRouter: Login}/>
                {/*<Route exact path="/updatequestion" component={localStorage.getItem('is_login') === 'true'? UpdateQuestion: Login}/>*/}
                <Route exact path="/test" component={MainUserTest}/>
                <Route exact path="/ckeditor" component={CKEDITOR}/>
                <Route  path="/q/:id" component={QuestionByID}/>
                <Route exact path="/iq/:id" component={ImageQuestion}/>
                <Route exact path="/card/edit/:id" component={CardEditByID}/>
                <Route exact path="/c/:id" component={CARDS}/>
                <Route exact path='/card' component={MainCardEditor}/>
                <Route exact path="/course/:id" component={EditCourseByID}/>
                <Route exact path="/mce" component={MainCourseEditor}/>
                <Route exact path="/cards" component={MainCardPublicView}/>
                <Route exact path="/courses" component={MainCoursePublicView}/>
                <Redirect to="/courses"/>
            </Switch>
        </Router>
    </>
  );
}

export default App;
