import React from 'react';
import './App.css';
import Navibar from './Components/Navbar/Navibar.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useEffect} from "react";


import  {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

// import {MainPage} from './Pages/mainPage.tsx';
// import {AdvancedSearch} from './Pages/advancedSearch.tsx';
// import {OpenCard} from './Pages/OpenCard.tsx';
// import {TestForUser} from './Pages/TestForUser';
import {CreateUserTest} from './Components/OLD_NOT_USED/CreateUserTest';
import {MainExperimental} from "./Components/Menu/MainMenu";
import {TakeTheTest} from "./Components/OLD_NOT_USED/TakeTheTest"
import Login from "./Components/Login/Login"
import {gql, useMutation} from "@apollo/client";
import UnLogin from "./Components/Login/UnLogin";
import Registration from "./Components/Login/Registration";
import CreatePoint from "./Components/Editor/CreatePoint"
import UpdateQuestion from "./Components/Editor/UpdateQuestion";
import MainEditor from "./Components/Editor/MainEditor";
import MainUserTest from "./Components/UserTest/MainUserTest";
import QuestionByID from "./Components/UserTest/QuestionByID";


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

    const [verify_login, { data, error }] = useMutation(VERIFY_LOGIN, {
        variables: {
            token: checkTokenAndLoginVariablesInLocalStore()
        },
        errorPolicy: 'all'
    })

    useEffect(() =>{
        verify_login().then().catch(() => {localStorage.setItem('is_login', 'false')})}, [])  //для создания фоновой задачи, перед запятой пишем setInterval
    if (!data){
        return <div>Loading...</div>
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
                <Route exact path="/testeditor" component={localStorage.getItem('is_login') === 'true'? MainEditor: Login}/>
                <Route exact path="/updatequestion" component={localStorage.getItem('is_login') === 'true'? UpdateQuestion: Login}/>
                <Route exact path="/test" component={MainUserTest}/>
                <Route  path="/test/question/:id" component={QuestionByID}/>
            </Switch>
        </Router>
    </>
  );
}

export default App;
