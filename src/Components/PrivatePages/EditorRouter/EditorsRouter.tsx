import React, {Suspense} from "react";
import {Alert, CircularProgress, Grid, Paper} from '@mui/material';
import AlertTitle from '@mui/material/AlertTitle';
import {UserStorage} from '../../../Store/UserStore/UserStore'
import {observer} from "mobx-react";
import {Route, Routes} from "react-router-dom";
import {isMobileHook} from "../../../CustomHooks/isMobileHook";
import RouterMenu from "./router-menu";

const ExamEditorPage = React.lazy(() => import("../../Elements/Exam/EditorPage/Page/UI/exam-editor-page"))


const StatusEditorPage = React.lazy(() => import("../../Elements/StatusEditor/UI/StatusEditorPage"));
const SearchingElementsEditor = React.lazy(() => import("../SearchingElementsEditor"))
const QuestionSequenceMainEditor = React.lazy(() => import("../QuestionSequenceMainEditor"))
const MainCourseEditor = React.lazy(() => import("../MainCourseEditor"))

const QuestionEditor = React.lazy(() => import("../../Elements/Question/Editor/QuestionEditor/UI/QuestionEditor").then(module => ({default: module.QuestionEditor})))
const MainUserQuestionPage = React.lazy(() => import("../MainUserQuestionPage").then(module => ({default: module.MainUserQuestionPage})))
const StatisticV2 = React.lazy(() => import("../../Elements/Statistic/V2/StatisticV2").then(module => ({default: module.StatisticV2})))
const CardEditorV2 = React.lazy(() => import("../../Elements/Cards/Editor/EditorPageV2/Page").then(module => ({default: module.EditorPage})))
const CheckQuestion = React.lazy(() => import("../../Elements/CheckQuestion/Page/UI/check-question-page"))


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
        <Paper elevation={0}>
            <RouterMenu/>
            <Paper elevation={0} sx={{ml: isMobile ? 0 : 8}}>
                <Routes>
                    <Route path={`/course`} element={
                        <Suspense fallback={<Grid container justifyContent={"center"}
                                                  sx={{pt: 4}}><CircularProgress/></Grid>}>
                            <MainCourseEditor/>
                        </Suspense>
                    }/>
                    <Route path={`/se`} element={
                        <Suspense fallback={<Grid container justifyContent={"center"}
                                                  sx={{pt: 4}}><CircularProgress/></Grid>}>
                            <SearchingElementsEditor/>
                        </Suspense>
                    }/>
                    <Route path={`/question`} element={
                        <Suspense fallback={<Grid container justifyContent={"center"}
                                                  sx={{pt: 4}}><CircularProgress/></Grid>}>
                            <QuestionEditor/>
                        </Suspense>}/>
                    <Route path={`/qse`} element={
                        <Suspense fallback={<Grid container justifyContent={"center"}
                                                  sx={{pt: 4}}><CircularProgress/></Grid>}>
                            <QuestionSequenceMainEditor/>
                        </Suspense>
                    }/>
                    <Route path={`/allquestions/*`} element={
                        <Suspense fallback={<Grid container justifyContent={"center"}
                                                  sx={{pt: 4}}><CircularProgress/></Grid>}>
                            <MainUserQuestionPage/>
                        </Suspense>
                    }/>

                    <Route path={`/statistic2/*`} element={
                        <Suspense fallback={<Grid container justifyContent={"center"}
                                                  sx={{pt: 4}}><CircularProgress/></Grid>}>
                            <StatisticV2/>
                        </Suspense>
                    }/>
                    <Route path={`card2/*`} element={
                        <Suspense fallback={<Grid container justifyContent={"center"}
                                                  sx={{pt: 4}}><CircularProgress/></Grid>}>
                            <CardEditorV2/>
                        </Suspense>
                    }/>
                    <Route path={`/exam/*`} element={

                        <Suspense fallback={<Grid container justifyContent={"center"}
                                                  sx={{pt: 4}}><CircularProgress/></Grid>}>
                            <ExamEditorPage/>
                        </Suspense>

                    }/>
                    <Route path={`/checkquestion/*`} element={

                        <Suspense fallback={<Grid container justifyContent={"center"}
                                                  sx={{pt: 4}}><CircularProgress/></Grid>}>
                            <CheckQuestion/>
                        </Suspense>

                    }/>
                    <Route path={`/status-editor/*`} element={

                        <Suspense fallback={<Grid container justifyContent={"center"}
                                                  sx={{pt: 4}}><CircularProgress/></Grid>}>
                            <StatusEditorPage/>
                        </Suspense>

                    }/>
                    <Route path={`*`} element={
                        <Suspense fallback={<Grid container justifyContent={"center"}
                                                  sx={{pt: 4}}><CircularProgress/></Grid>}>
                            <MainCourseEditor/>
                        </Suspense>
                    }/>
                </Routes>
            </Paper>
        </Paper>
    )
        ;
})
