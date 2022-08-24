//23 июля начат процесс полного переписывания проекта на mobX, документация может быть устаревшей
//10 августа, документация ОЧЕНЬ сильно устарела, вернее сказать, она в принципе ни как не связана с реальностью
//22 января - проект переписывается на новую архитектуру, селекторы выделены в независимый слой, вся логика в сторах
//8 июня - проект уже как минимум месяц пишется исключительно на Redux, MobX оказался плохим выбором

import React, {Suspense, useEffect} from 'react';
import './App.css';
import {Navibar} from './Components/PublicPages/Navbar/Navibar';
import {UserStorage} from './Store/UserStore/UserStore'


import {BrowserRouter as Router, Route, Routes,} from "react-router-dom";


import {ApolloProvider} from "@apollo/client";
import {observer} from "mobx-react"
import {ClientStorage} from "./Store/ApolloStorage/ClientStorage";
import {RequireLogInAlert} from "./Components/PublicPages/Notifications/RequireLogInAlert";
import {CircularProgress, Grid} from "@mui/material";
import Auth0Login from "./Components/Elements/Auth0/auth0-login";
import Auth0AfterLogin from "./Components/Elements/Auth0/auth0-after-login";
import {useAuth0} from "@auth0/auth0-react";
import CardByURL from "./Components/Elements/Cards/CardByURL/UI/card-by-url";
import SeoData from "./seo-data";
import ProfilePage from "./Components/Elements/Profile/UI/ProfilePage";
import axiosClient from "./ServerLayer/QueryLayer/config";

const EditorsRouter = React.lazy(() => import("./Components/PrivatePages/EditorRouter/EditorsRouter").then(module => ({default: module.EditorsRouter})))
const MainCardPublicView = React.lazy(() => import("./Components/Elements/Cards/Page/MainCardPublicView").then(module => ({default: module.MainCardPublicView})))
const QSPlayerByID = React.lazy(() => import("./Components/Elements/QuestionSequence/Public/QSPlayerByID").then(module => ({default: module.QSPlayerByID})))
const ImageQuestion = React.lazy(() => import("./Components/Elements/Question/QuestionByID/UI/QuestionByID").then(module => ({default: module.QuestionByID})))
const SelfStatistic = React.lazy(() => import("./Components/Elements/SimpleSelfStatistic/UI/self-statistic-page").then(module => ({default: module.SelfStatisticPage})))
const CoursePage = React.lazy(() => import("./Components/Elements/Course/Page/UI/course-page"))
const CourseByURL = React.lazy(() => import("./Components/Elements/Course/CourseByURL/UI/CourseByURL"))
const ExamByUID = React.lazy(() => import("./Components/Elements/Exam/ExamByUid/UI/exam-by-uid-page"))
const RecentCardsPage = React.lazy(() => import("./Components/Elements/RecentCards/UI/recent-cards-page"))
const BookmarksPage = React.lazy(() => import("./Components/Elements/CardBookmarks/UI/card-bookmarks-page"))

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
                    <div style={{paddingTop: 48}}>
                        <Suspense fallback={<Grid container justifyContent={"center"}
                                                  sx={{pt: 4}}><CircularProgress/></Grid>}>
                            <RequireLogInAlert/>
                            {/*<ProfileNotification/>*/}
                            <Routes>
                                <Route path="/login" element={<div><Auth0Login/></div>}/>
                                <Route path={"/afterlogin"} element={<div><Auth0AfterLogin/></div>}/>
                                <Route path="/unlogin" element={<div>Auth0Logout</div>}/>
                                <Route path="/editor/*" element={<div><EditorsRouter/></div>}/>

                                <Route path="/iq/:id"
                                       element={<Suspense fallback={<div/>}><ImageQuestion/></Suspense>}/>

                                <Route path="/qs/:id"
                                       element={<Suspense fallback={<div/>}><QSPlayerByID/></Suspense>}/>
                                <Route path={"/exam/:uid"}
                                       element={<Suspense fallback={<div/>}><ExamByUID/></Suspense>}/>

                                <Route path="/cards"
                                       element={<Suspense fallback={<div/>}><MainCardPublicView/></Suspense>}/>
                                <Route path={"/card/:id"}
                                       element={<Suspense fallback={<div/>}><CardByURL/></Suspense>}/>
                                <Route path={"/selfstatistic"}
                                       element={<Suspense fallback={<div/>}><SelfStatistic/></Suspense>}/>

                                <Route path="/courses"
                                       element={<Suspense fallback={<div/>}><CoursePage/></Suspense>}/>
                                <Route path={"/course"}
                                       element={<Suspense fallback={<div/>}><CourseByURL/></Suspense>}/>
                                <Route path={"/profile"}
                                       element={<Suspense fallback={<div/>}><ProfilePage/></Suspense>}/>

                                <Route path={"/recent-cards"}
                                       element={<Suspense fallback={<div/>}><RecentCardsPage/></Suspense>}/>
                                <Route path={"/bookmarks"}
                                       element={<Suspense fallback={<div/>}><BookmarksPage/></Suspense>}/>

                                <Route path={"/"}
                                       element={<Suspense fallback={<div/>}><CoursePage/></Suspense>}/>
                            </Routes>
                        </Suspense>
                    </div>
                </Router>
            </ApolloProvider>
        </>
    );
})
export default App;
