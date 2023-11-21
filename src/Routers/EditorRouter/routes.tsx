import EditQuestionByURL from "../../Pages/Question/Editor/QuestionEditor/UI/EditQuestionByUrl";
import HelpArticleEditPage from "../../Pages/HelpArticle/EditorPage/UI";
import React from "react";
import BlurLinearIcon from "@mui/icons-material/BlurLinear";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import QuizIcon from "@mui/icons-material/Quiz";
import LinearScaleIcon from "@mui/icons-material/LinearScale";
import SchoolIcon from '@mui/icons-material/School';
import AddchartIcon from "@mui/icons-material/Addchart";
import RuleIcon from '@mui/icons-material/Rule';
import GroupIcon from '@mui/icons-material/Group';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

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


export const privateRoutes = [
    {
        path: `/course/*`,
        component: <MainCourseEditor/>,
        navigate: "course",
        icon: <BlurLinearIcon/>,
        title: "Редактор курсов",
        status: ["ADMIN", "TEACHER", "CARD_EDITOR"]
    },
    {
        path: `/card2/*`,
        component: <CardEditorV2/>,
        title: "Редактор карточек",
        navigate: "card2",
        icon: <AppRegistrationIcon/>,
        status: ["ADMIN", "TEACHER", "CARD_EDITOR"]
    },
    {
        path: `/se`,
        component: <SearchingElementsEditor/>,
        title: "Редактор тем",
        navigate: "se",
        icon: <AccountTreeIcon/>,
        status: ["ADMIN", "TEACHER"]
    },
    {
        path: `/question`,
        component: <QuestionEditor/>,
        title: "Редактор вопросов",
        navigate: "question",
        icon: <QuizIcon/>,
        status: ["ADMIN", "TEACHER"]
    },
    {
        path: `/qse`,
        component: <QuestionSequenceMainEditor/>,
        title: "Редактор серий вопросов",
        navigate: "qse",
        icon: <LinearScaleIcon/>,
        status: ["ADMIN", "TEACHER"]
    },
    {
        path: `/statistic2/*`,
        component: <StatisticV2/>,
        title: "Статистика",
        navigate: "statistic2",
        icon: <AddchartIcon/>,
        status: ["ADMIN", "TEACHER"]
    },
    {
        path: `/exam/*`,
        component: <ExamEditorPage/>,
        title: "Редактор экзаменов",
        navigate: "exam",
        icon: <SchoolIcon/>,
        status: ["ADMIN", "TEACHER"]
    },
    {
        path: `/checkquestion/*`,
        component: <CheckQuestion/>,
        title: "Проверка вопросов",
        navigate: "checkquestion",
        icon: <RuleIcon/>,
        status: ["ADMIN", "TEACHER"]
    },
    {
        path: `/status-editor/*`,
        component: <StatusEditorPage/>,
        title: "Редактор уровней доступа",
        navigate: "status-editor",
        icon: <GroupIcon/>,
        status: ["ADMIN", "TEACHER"]
    },
    {
        path: "/help-article",
        component: <HelpArticleEditPage/>,
        title: "Редактор подсказок для страниц",
        navigate: "help-article",
        icon: <QuestionMarkIcon/>,
        status: ["ADMIN", "TEACHER"]
    },
    {
        path: `/allquestions/*`,
        component: <MainUserQuestionPage/>,
        status: ["ADMIN", "TEACHER"]
    },


    {
        path: "/question/selected/:id",
        component: <div><EditQuestionByURL/></div>,
        status: ["ADMIN", "TEACHER"]
    },
    {
        path: `*`,
        component: <MainCourseEditor/>,
        status: ["ADMIN, TEACHER", "CARD_EDITOR"]
    }
]