import React, {useState} from 'react';
import './App.css';
import Navibar from './Components/Navbar/Navibar.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useEffect} from "react";


import  {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

import {MainExperimental} from "./Components/Menu/MainMenu";
import Login from "./Components/Login/Login"
import {gql, useMutation, useQuery} from "@apollo/client";
import UnLogin from "./Components/Login/UnLogin";
import Registration from "./Components/Login/Registration";
import UpdateQuestion from "./Components/UserTest/Editor/UpdateQuestion";
import MainEditor from "./Components/UserTest/Editor/MainEditor";
import MainUserTest from "./Components/UserTest/MainUserTest";
import QuestionByID from "./Components/UserTest/QuestionByID";
import CKEDITOR from "./Components/UserTest/Editor/CKEditor";
import ImageQuestion from "./Components/UserTest/ImageQuestion";
import CardView from "./Components/Cards/Card";
import CARDS from "./Components/Cards/Card";
import CardEditByID from "./Components/Cards/Editor/CardEditByID/CardEditByID";
import MainCardEditor from './Components/Cards/Editor/MainCardEditor/MainCardEditor'
import Typist from 'react-typist';

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
        errorPolicy: 'all'
    })
    const [animationState, setAnimationState] = useState(false)
    useEffect(() =>{
        verify_login().then().catch(() => {localStorage.setItem('is_login', 'false')})
        setTimeout(setAnimationState, 3000, true)
    }, [])  //для создания фоновой задачи, перед запятой пишем setInterval

    if (!data || !animationState || !user_data){
        return  <Typist className="display-4 text-center mt-4" style={{fontSize: '33px'}}>
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
                <Route exact path="/" component={MainExperimental}/>
                <Route exact path="/login" component={Login}/>
                <Route exact path="/unlogin" component={UnLogin}/>
                <Route exact path="/registration" component={Registration}/>
                <Route exact path="/testeditor" component={user_data.me !== null? MainEditor: Login}/>
                {/*<Route exact path="/updatequestion" component={localStorage.getItem('is_login') === 'true'? UpdateQuestion: Login}/>*/}
                <Route exact path="/test" component={MainUserTest}/>
                <Route exact path="/ckeditor" component={CKEDITOR}/>
                <Route  path="/q/:id" component={QuestionByID}/>
                <Route exact path="/iq/:id" component={ImageQuestion}/>
                <Route exact path="/c/:id" component={CARDS}/>
                <Route exact path="/c/edit/:id" component={CardEditByID}/>
                <Route exact path='/card' component={MainCardEditor}/>
            </Switch>
        </Router>
    </>
  );
}

export default App;
