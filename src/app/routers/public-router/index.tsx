import React, { Suspense } from 'react';
import { CircularProgress, Grid } from '@mui/material';
import { RequireLogInAlert } from '../../shared-components/notifications/RequireLogInAlert';
import { Navigate, Route, Routes } from 'react-router-dom';
import Auth0Login from '../../../pages/auth0/auth0-login';
import Auth0AfterLogin from '../../../pages/auth0/auth0-after-login';
import CardByURL from '../../../pages/cards/card-by-url/ui/card-by-url';
import ProfilePage from '../../../pages/profile/ui/ProfilePage';
import CardByID from '../../../pages/cards/card-by-id/ui/card-by-id';

import { EditorsRouter } from '../editor-router/EditorsRouter';
import { MainCardPublicView } from '../../../pages/cards/page/MainCardPublicView';
import { QuestionByID } from '../../../pages/question/question-by-id/ui/QuestionByID';
import { SelfStatisticPage } from '../../../pages/simple-self-statistic/ui/self-statistic-page';
import CoursePage from '../../../pages/course/page/ui/course-page';
import CourseByURL from '../../../pages/course/course-by-url/ui/CourseByURL';
import ExamByUID from '../../../pages/exam/exam-by-uid/ui/exam-by-uid-page';
import RecentCardsPage from '../../../pages/recent-cards/ui/recent-cards-page';
import BookmarksPage from '../../../pages/card-bookmarks/ui/card-bookmarks-page';
import { MainUserQuestionPage } from '../../../pages/question/questions-page/MainUserQuestionPage';
import Author from '../../../pages/author';
import { AiCourse } from '../../../pages/ai-course/ui/ai-course';

interface IPublicRouterProps {}

const routes = [
  {
    path: '/login',
    component: <Auth0Login />,
  },
  {
    path: '/afterlogin',
    component: <Auth0AfterLogin />,
  },
  {
    path: '/unlogin',
    component: <div>Auth0Logout</div>,
  },
  {
    path: '/editor/*',
    component: (
      <div>
        <EditorsRouter />
      </div>
    ),
  },
  {
    path: '/iq/:id',
    component: <QuestionByID />,
  },
  {
    path: '/exam/:uid',
    component: <ExamByUID />,
  },
  {
    path: '/cards',
    component: <MainCardPublicView />,
  },
  {
    path: '/card/:id',
    component: <CardByURL />,
  },
  {
    path: '/selfstatistic',
    component: <SelfStatisticPage />,
  },
  {
    path: '/courses',
    component: <CoursePage />,
  },
  {
    path: '/course',
    component: <CourseByURL />,
  },
  {
    path: '/profile',
    component: <ProfilePage />,
  },
  {
    path: '/recent-cards',
    component: <RecentCardsPage />,
  },
  {
    path: '/bookmarks',
    component: <BookmarksPage />,
  },
  {
    path: '/all-questions/*',
    component: <MainUserQuestionPage />,
  },
  {
    path: '/author/:id',
    component: <Author />,
  },
  {
    path: '/ai-course',
    component: <AiCourse />,
  },
  {
    path: '/',
    component: <Navigate to="/courses" replace />,
  },
];
export default function PublicRouter({ ...props }: IPublicRouterProps) {
  return (
    <>
      <div>
        <Suspense
          fallback={
            <Grid
              container
              sx={{
                justifyContent: 'center',
                pt: 4,
              }}
            >
              <CircularProgress />
            </Grid>
          }
        >
          <RequireLogInAlert />

          <Routes>
            {routes.map(route => (
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
