import React, {Suspense} from "react";
import {CircularProgress, Grid} from "@mui/material";
import {RequireLogInAlert} from "../../SharedComponents/Notifications/RequireLogInAlert";
import {Route, Routes} from "react-router-dom";
import Auth0Login from "../../Pages/Auth0/auth0-login";
import Auth0AfterLogin from "../../Pages/Auth0/auth0-after-login";
import CardByURL from "../../Pages/Cards/CardByURL/UI/card-by-url";
import ProfilePage from "../../Pages/Profile/UI/ProfilePage";
import CardByID from "../../Pages/Cards/CardByID/UI/card-by-id";

const EditorsRouter = React.lazy(() => import("../../Routers/EditorRouter/EditorsRouter").then(module => ({default: module.EditorsRouter})))
const MainCardPublicView = React.lazy(() => import("../../Pages/Cards/Page/MainCardPublicView").then(module => ({default: module.MainCardPublicView})))
const QSPlayerByID = React.lazy(() => import("../../Pages/QuestionSequence/Public/QSPlayerByID").then(module => ({default: module.QSPlayerByID})))
const ImageQuestion = React.lazy(() => import("../../Pages/Question/QuestionByID/UI/QuestionByID").then(module => ({default: module.QuestionByID})))
const SelfStatistic = React.lazy(() => import("../../Pages/SimpleSelfStatistic/UI/self-statistic-page").then(module => ({default: module.SelfStatisticPage})))
const CoursePage = React.lazy(() => import("../../Pages/Course/Page/UI/course-page"))
const CourseByURL = React.lazy(() => import("../../Pages/Course/CourseByURL/UI/CourseByURL"))
const ExamByUID = React.lazy(() => import("../../Pages/Exam/ExamByUid/UI/exam-by-uid-page"))
const RecentCardsPage = React.lazy(() => import("../../Pages/RecentCards/UI/recent-cards-page"))
const BookmarksPage = React.lazy(() => import("../../Pages/CardBookmarks/UI/card-bookmarks-page"))

interface IPublicRouterProps {

}

const routes = [
    {
        path: "/login",
        component: <Auth0Login/>
    },
    {
        path: "/afterlogin",
        component: <Auth0AfterLogin/>
    },
    {
        path: "/unlogin",
        component: <div>Auth0Logout</div>
    },
    {
        path: "/editor/*",
        component: <div><EditorsRouter/></div>
    },
    {
        path: "/iq/:id",
        component: <ImageQuestion/>
    },
    {
        path: "/qs/:id",
        component: <QSPlayerByID/>
    },
    {
        path: "/exam/:uid",
        component: <ExamByUID/>
    },
    {
        path: "/cards",
        component: <MainCardPublicView/>
    },
    {
        path: "/card/:id",
        component: <CardByURL/>
    },
    {
        path: "/selfstatistic",
        component: <SelfStatistic/>
    },
    {
        path: "/courses",
        component: <CoursePage/>
    },
    {
        path: "/course",
        component: <CourseByURL/>
    },
    {
        path: "/profile",
        component: <ProfilePage/>
    },
    {
        path: "/recent-cards",
        component: <RecentCardsPage/>
    },
    {
        path: "/bookmarks",
        component: <BookmarksPage/>
    },
    {
        path: "/",
        component: <CardByID card_id={2677}/>
    }

]
export default function PublicRouter({...props}: IPublicRouterProps) {
    return (
        <>
            <div style={{paddingTop: 48}}>
                <Suspense fallback={<Grid container justifyContent={"center"}
                                          sx={{pt: 4}}><CircularProgress/></Grid>}>

                    <RequireLogInAlert/>
                    {/*<ProfileNotification/>*/}

                    <Routes>
                        {routes.map((route) => {
                            return (
                                <Route path={route.path} element={<Suspense fallback={<div/>}>
                                    {route.component}
                                </Suspense>}/>
                            )
                        })}
                    </Routes>
                </Suspense>
            </div>

        </>
    )
}
