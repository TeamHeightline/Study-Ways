import React, {Suspense} from "react";
import {Alert, CircularProgress, Grid} from '@mui/material';
import AlertTitle from '@mui/material/AlertTitle';
import {UserStorage} from '../../../Store/UserStore/UserStore'
import {observer} from "mobx-react";
import {Route, Switch, useRouteMatch} from "react-router-dom";
import {isMobileHook} from "../../../CustomHooks/isMobileHook";
import RouterMenu from "./router-menu";


const StatusEditorPage = React.lazy(() => import("../../Elements/StatusEditor/UI/StatusEditorPage"));
const SearchingElementsEditor = React.lazy(() => import("../SearchingElementsEditor"))
const QuestionSequenceMainEditor = React.lazy(() => import("../QuestionSequenceMainEditor"))
const MainCourseEditor = React.lazy(() => import("../MainCourseEditor"))

const QuestionEditor = React.lazy(() => import("../../Elements/Question/Editor/QuestionEditor/UI/QuestionEditor").then(module => ({default: module.QuestionEditor})))
const MainUserQuestionPage = React.lazy(() => import("../MainUserQuestionPage").then(module => ({default: module.MainUserQuestionPage})))
const StatisticV2 = React.lazy(() => import("../../Elements/Statistic/V2/StatisticV2").then(module => ({default: module.StatisticV2})))
const CardEditorV2 = React.lazy(() => import("../../Elements/Cards/Editor/EditorPageV2/Page").then(module => ({default: module.EditorPage})))
const ExamPage = React.lazy(() => import("../../Elements/Exam/EditorPage/ExamByID/Page/UI/page"))
const CheckQuestion = React.lazy(() => import("../../Elements/CheckQuestion/Page/UI/check-question-page"))


export const EditorsRouter = observer(() => {
    const {path} = useRouteMatch();
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
        <div>
            <RouterMenu/>
            <Suspense fallback={<Grid container justifyContent={"center"} sx={{pt: 4}}><CircularProgress/></Grid>}>
                <div className={isMobile ? "" : "pl-5"}>
                    <Switch>
                        <Route path={`${path}/course`} component={MainCourseEditor}/>
                        <Route path={`${path}/se`} component={SearchingElementsEditor}/>
                        <Route path={`${path}/question`} component={QuestionEditor}/>
                        <Route path={`${path}/qse`} component={QuestionSequenceMainEditor}/>
                        <Route path={`${path}/allquestions`} component={MainUserQuestionPage}/>
                        <Route path={`${path}/statistic2`} component={StatisticV2}/>
                        <Route path={`${path}/card2`} component={CardEditorV2}/>
                        <Route path={`${path}/exam`} component={ExamPage}/>
                        <Route path={`${path}/checkquestion`} component={CheckQuestion}/>
                        <Route path={`${path}/status-editor`} component={StatusEditorPage}/>
                        <Route path={`${path}/`} component={MainCourseEditor}/>
                    </Switch>
                </div>
            </Suspense>

        </div>
    );
})
