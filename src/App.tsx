//23 июля начат процесс полного переписывания проекта на mobX, документация может быть устаревшей
//10 августа, документация ОЧЕНЬ сильно устарела, вернее сказать, она в принципе ни как не связана с реальностью
//22 января - проект переписывается на новую архитектуру, селекторы выделены в независимый слой, вся логика в сторах

import React, {Suspense, useEffect} from 'react';
import './App.css';
import {Navibar} from './Components/PublicPages/Navbar/Navibar';
import 'bootstrap/dist/css/bootstrap.min.css';
import {UserStorage} from './Store/UserStore/UserStore'
import '@fontsource/roboto/300.css';


import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";


import {ApolloProvider} from "@apollo/client";

const EditorsRouter = React.lazy(() => import("./Components/PrivatePages/EditorRouter/EditorsRouter").then(module => ({default: module.EditorsRouter})))
const MainCardPublicView = React.lazy(() => import("./Components/Elements/Cards/Page/MainCardPublicView").then(module => ({default: module.MainCardPublicView})))
const QSPlayerByID = React.lazy(() => import("./Components/Elements/QuestionSequence/Public/QSPlayerByID").then(module => ({default: module.QSPlayerByID})))
const ImageQuestion = React.lazy(() => import("./Components/Elements/Question/QuestionByID/QuestionByID").then(module => ({default: module.QuestionByID})))
const SelfStatistic = React.lazy(() => import("./Components/Elements/SimpleSelfStatistic/UI/self-statistic-page").then(module => ({default: module.SelfStatisticPage})))
const CoursePage = React.lazy(() => import("./Components/Elements/Course/Page/UI/CoursPage"))
const CourseByURL = React.lazy(() => import("./Components/Elements/Course/CourseByURL/UI/CourseByURL"))

import {observer} from "mobx-react"
import {ClientStorage} from "./Store/ApolloStorage/ClientStorage";
import {LogInNotification} from "./Components/PublicPages/Notifications/LogInNotification";
import {isMobileHook} from "./CustomHooks/isMobileHook";
import {CircularProgress, Grid} from "@mui/material";
import Auth0Login from "./Components/Elements/Auth0/auth0-login";
import Auth0AfterLogin from "./Components/Elements/Auth0/auth0-after-login";
import {useAuth0} from "@auth0/auth0-react";
import Auth0Logout from "./Components/Elements/Auth0/auth0-logout";
import CardByURL from "./Components/Elements/Cards/CardByURL/UI/card-by-url";
import SeoData from "./seo-data";
import ProfilePage from "./Components/Elements/Profile/UI/ProfilePage";
import {ProfileNotification} from "./Components/PublicPages/Notifications/ProfileNotification";


const App = observer(() => {
    const isMobile = isMobileHook()
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
            })
        } else {
            ClientStorage.changeToken("")
        }

    }, [isLoading])

    if (isLoading) {
        return <Grid container justifyContent={"center"}
                     sx={{pt: 4}}><CircularProgress/></Grid>;
    }

    return (
        <>
            <ApolloProvider client={ClientStorage.client}>
                <Router>
                    <Navibar/>
                    <SeoData/>
                    <div style={{paddingTop: isMobile ? 0 : 48}}>
                        <Suspense fallback={<Grid container justifyContent={"center"}
                                                  sx={{pt: 4}}><CircularProgress/></Grid>}>
                            <LogInNotification/>
                            <ProfileNotification/>
                            <Switch>
                                <Route exact path="/login" component={Auth0Login}/>
                                <Route exact path={"/afterlogin"} component={Auth0AfterLogin}/>
                                <Route exact path="/unlogin" component={Auth0Logout}/>
                                <Route path="/editor"
                                       component={UserStorage.isLogin !== null ? EditorsRouter : Auth0Login}/>

                                <Route exact path="/iq/:id" component={ImageQuestion}/>
                                <Route exact path="/qs/:id" component={QSPlayerByID}/>

                                <Route path="/cards" component={MainCardPublicView}/>
                                <Route exact path={"/card/:id"} component={CardByURL}/>
                                <Route exact path={"/selfstatistic"} component={SelfStatistic}/>

                                <Route exact path="/courses" component={CoursePage}/>
                                <Route path={"/course"} component={CourseByURL}/>
                                <Route exact path={"/profile"} component={ProfilePage}/>


                                <Route path={"/"} component={CoursePage}/>
                            </Switch>
                        </Suspense>
                    </div>
                </Router>
            </ApolloProvider>
        </>
    );
})
export default App;
