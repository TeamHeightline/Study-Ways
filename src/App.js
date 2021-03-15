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

import {MainPage} from './Pages/mainPage.tsx';
// import {AdvancedSearch} from './Pages/advancedSearch.tsx';
import {OpenCard} from './Pages/OpenCard.tsx';
import {TestForUser} from './Pages/TestForUser';
import {CreateUserTest} from './Components/UserTests/CreateUserTest';
import {MainExperimental} from "./Components/Experimental/ExpMain";
import {TakeTheTest} from "./Components/Experimental/TakeTheTest"
import Login from "./Components/Login/Login"
import {gql, useMutation} from "@apollo/client";
import UnLogin from "./Components/Login/UnLogin";
import Registration from "./Components/Login/Registration";


const VERIFY_LOGIN = gql`
    mutation VERIFY_LOGIN($token: String!){
      verifyToken(token: $token){
        payload
        success
        errors
      }
    }
`

const REFRESH_TOKEN = gql`
    mutation REFRESH_TOKEN($refresh_token: String!){
      refreshToken(refreshToken: $refresh_token){
        token
        refreshToken
        payload
        success
        errors
      }
    }`

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
        console.log(localStorage.getItem('token'))
        return(localStorage.getItem('token'))
    }

    const [verify_login, { data, error }] = useMutation(VERIFY_LOGIN, {
        variables: {
            token: checkTokenAndLoginVariablesInLocalStore()
        },
        errorPolicy: 'all'
    })

    useEffect(() =>{
        verify_login().then().catch(() => {localStorage.setItem('is_login', 'false')})}, [])
    if (!data){
        return <div>Loading...</div>
    }
    if(data.verifyToken.success === true){
        localStorage.setItem('is_login', 'true')
        localStorage.setItem('user_name', data.verifyToken.payload.username)
    }else{
        localStorage.setItem('is_login', 'false')
    }
    console.log(data)
    // if (error){
    //     console.log(error.graphQLErrors)
    // }

  return (
    <>
        <Router>
            <Navibar/>
            <Switch>
                <Route exact path="/" component={MainExperimental}/>
                {/*<Route exact path="/search" component={AdvancedSearch}/>*/}
                <Route exact path="/lc" component={OpenCard}/>
                <Route exact path="/test" component={TestForUser}/>
                <Route exact path='/test/n' component={CreateUserTest}/>
                <Route exact path="/exp" component={MainExperimental}/>
                <Route exact path="/exp/testing" component={TakeTheTest}/>
                <Route exact path="/login" component={Login}/>
                <Route exact path="/unlogin" component={UnLogin}/>
                <Route exact path="/registration" component={Registration}/>
            </Switch>
        </Router>
    </>
  );
}

export default App;
