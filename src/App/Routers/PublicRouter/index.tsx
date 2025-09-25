import React, { Suspense } from "react";
import { CircularProgress, Grid } from "@mui/material";
import { RequireLogInAlert } from "../../SharedComponents/Notifications/RequireLogInAlert";
import { Navigate, Route, Routes } from "react-router-dom";
import Auth0Login from "../../../Pages/Auth0/auth0-login";
import Auth0AfterLogin from "../../../Pages/Auth0/auth0-after-login";
import CardByURL from "../../../Pages/Cards/CardByURL/UI/card-by-url";
import ProfilePage from "../../../Pages/Profile/UI/ProfilePage";
import CardByID from "../../../Pages/Cards/CardByID/UI/card-by-id";

import { EditorsRouter } from "../EditorRouter/EditorsRouter";
import { MainCardPublicView } from "../../../Pages/Cards/Page/MainCardPublicView";
import { QSPlayerByID } from "../../../Pages/QuestionSequence/Public/QSPlayerByID";
import { QuestionByID } from "../../../Pages/Question/QuestionByID/UI/QuestionByID";
import { SelfStatisticPage } from "../../../Pages/SimpleSelfStatistic/UI/self-statistic-page";
import CoursePage from "../../../Pages/Course/Page/UI/course-page";
import CourseByURL from "../../../Pages/Course/CourseByURL/UI/CourseByURL";
import ExamByUID from "../../../Pages/Exam/ExamByUid/UI/exam-by-uid-page";
import RecentCardsPage from "../../../Pages/RecentCards/UI/recent-cards-page";
import BookmarksPage from "../../../Pages/CardBookmarks/UI/card-bookmarks-page";
import { MainUserQuestionPage } from "../../../Pages/Question/QuestionsPage/MainUserQuestionPage";
import Author from "../../../Pages/Author";
import { AiCourse } from "../../../Pages/AICourse/ui/ai-course";

interface IPublicRouterProps {}

const routes = [
  {
    path: "/login",
    component: <Auth0Login />,
  },
  {
    path: "/afterlogin",
    component: <Auth0AfterLogin />,
  },
  {
    path: "/unlogin",
    component: <div>Auth0Logout</div>,
  },
  {
    path: "/editor/*",
    component: (
      <div>
        <EditorsRouter />
      </div>
    ),
  },
  {
    path: "/iq/:id",
    component: <QuestionByID />,
  },
  {
    path: "/qs/:id",
    component: <QSPlayerByID />,
  },
  {
    path: "/exam/:uid",
    component: <ExamByUID />,
  },
  {
    path: "/cards",
    component: <MainCardPublicView />,
  },
  {
    path: "/card/:id",
    component: <CardByURL />,
  },
  {
    path: "/selfstatistic",
    component: <SelfStatisticPage />,
  },
  {
    path: "/courses",
    component: <CoursePage />,
  },
  {
    path: "/course",
    component: <CourseByURL />,
  },
  {
    path: "/profile",
    component: <ProfilePage />,
  },
  {
    path: "/recent-cards",
    component: <RecentCardsPage />,
  },
  {
    path: "/bookmarks",
    component: <BookmarksPage />,
  },
  {
    path: "/all-questions/*",
    component: <MainUserQuestionPage />,
  },
  {
    path: "/author/:id",
    component: <Author />,
  },
  {
    path: "/ai-course",
    component: <AiCourse />,
  },
  {
    path: "/",
    component: <Navigate to="/courses" replace />,
  },
];
export default function PublicRouter({ ...props }: IPublicRouterProps) {
  return (
    <>
      <div style={{ paddingTop: 48 }}>
        <Suspense
          fallback={
            <Grid container justifyContent={"center"} sx={{ pt: 4 }}>
              <CircularProgress />
            </Grid>
          }
        >
          <RequireLogInAlert />

          <Routes>
            {routes.map((route) => (
              <Route
                path={route.path}
                key={route.path}
                element={
                  <Suspense fallback={<div />}>{route.component}</Suspense>
                }
              />
            ))}
          </Routes>
        </Suspense>
      </div>
    </>
  );
}
