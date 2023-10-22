import React, {Suspense, ReactElement} from "react";
import {Alert, Box, CircularProgress, Grid} from '@mui/material';
import AlertTitle from '@mui/material/AlertTitle';
import {UserStorage} from '../../Store/UserStore/UserStore'
import {observer} from "mobx-react";
import {Route, Routes} from "react-router-dom";
import {isMobileHook} from "../../CustomHooks/isMobileHook";
import RouterMenu from "./router-menu";
import EditQuestionByURL from "../../Pages/Question/Editor/QuestionEditor/UI/EditQuestionByUrl";
import HelpArticleEditPage from "../../Pages/HelpArticle/EditorPage/UI";

const ExamEditorPage = React.lazy(() => import("../../Pages/Exam/EditorPage/Page/UI/exam-editor-page"))


const StatusEditorPage = React.lazy(() => import("../../Pages/StatusEditor/UI/StatusEditorPage"));
const SearchingElementsEditor = React.lazy(() => import("../../Pages/Themes/EditorPage/ThemesEditor"))
const QuestionSequenceMainEditor = React.lazy(() => import("../../Pages/QuestionSequence/Editor/EditorPage/QuestionSequenceMainEditor"))
const MainCourseEditor = React.lazy(() => import("../../Pages/Course/CourseEditorPage/MainCourseEditor"))

const QuestionEditor = React.lazy(() => import("../../Pages/Question/Editor/Page/UI/question-editor-page").then(module => ({default: module.QuestionEditorPage})))
const MainUserQuestionPage = React.lazy(() => import("../../Pages/Question/QuestionsPage/MainUserQuestionPage").then(module => ({default: module.MainUserQuestionPage})))
const StatisticV2 = React.lazy(() => import("../../Pages/Statistic/V2/StatisticV2").then(module => ({default: module.StatisticV2})))
const CardEditorV2 = React.lazy(() => import("../../Pages/Cards/Editor/EditorPageV2/Page").then(module => ({default: module.EditorPage})))
const CheckQuestion = React.lazy(() => import("../../Pages/CheckQuestion/Page/UI/check-question-page"))


const routes: { path: string, component: ReactElement }[] = [
    {
        path: `/course/*`,
        component: <MainCourseEditor/>
    },
    {
        path: `/se`,
        component: <SearchingElementsEditor/>
    },
    {
        path: `/question`,
        component: <QuestionEditor/>
    },
    {
        path: `/qse`,
        component: <QuestionSequenceMainEditor/>
    },
    {
        path: `/allquestions/*`,
        component: <MainUserQuestionPage/>
    },
    {
        path: `/statistic2/*`,
        component: <StatisticV2/>
    },
    {
        path: `/card2/*`,
        component: <CardEditorV2/>
    },
    {
        path: `/exam/*`,
        component: <ExamEditorPage/>
    },
    {
        path: `/checkquestion/*`,
        component: <CheckQuestion/>
    },
    {
        path: `/status-editor/*`,
        component: <StatusEditorPage/>
    },
    {
        path: "/question/selected/:id",
        component: <div><EditQuestionByURL/></div>
    },
    {
        path: "/help-article",
        component: <HelpArticleEditPage/>
    },
    {
        path: `*`,
        component: <MainCourseEditor/>
    }

]

export const EditorsRouter = observer(() => {
    const isMobile = isMobileHook()

    if (UserStorage.userAccessLevel !== "ADMIN" && UserStorage.userAccessLevel !== "TEACHER") {
        return (
            <Alert severity="error">
                <AlertTitle>Доступ ограничен</AlertTitle>
                Вы не обладаете достаточными правами, чтобы просматривать этот раздел, для дополнитльной информации
                обратитесь к администрации
            </Alert>
        )
    }
    return (
        <Box>
            <RouterMenu/>
            <Box sx={{ml: isMobile ? 0 : 12}}>
                <Routes>
                    {routes.map((route) => {
                        return (
                            <Route path={route.path} element={
                                <Suspense fallback={
                                    <Grid container justifyContent={"center"} sx={{pt: 4}}>
                                        <CircularProgress/>
                                    </Grid>}>
                                    {route.component}
                                </Suspense>
                            }/>
                        )
                    })}
                </Routes>
            </Box>
        </Box>
    )
})
