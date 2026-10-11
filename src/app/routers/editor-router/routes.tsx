import EditQuestionByURL from '../../../pages/question/editor/question-editor/ui/EditQuestionByUrl';
import React from 'react';
import BlurLinearIcon from '@mui/icons-material/BlurLinear';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import QuizIcon from '@mui/icons-material/Quiz';
import LinearScaleIcon from '@mui/icons-material/LinearScale';
import SchoolIcon from '@mui/icons-material/School';
import AddchartIcon from '@mui/icons-material/Addchart';
import RuleIcon from '@mui/icons-material/Rule';
import GroupIcon from '@mui/icons-material/Group';

import ExamEditorPage from '../../../pages/exam/editor-page/page/ui/exam-editor-page';

import StatusEditorPage from '../../../pages/status-editor/ui/StatusEditorPage';
import SearchingElementsEditor from '../../../pages/themes/editor-page/ThemesEditor';
import QuestionSequenceMainEditor from '../../../pages/question-sequence/editor/editor-page/QuestionSequenceMainEditor';
import MainCourseEditor from '../../../pages/course/course-editor-page/MainCourseEditor';

import {Index as QuestionEditor} from '../../../pages/question/editor/page/ui';
import {StatisticV2 as StatisticV2} from '../../../pages/statistic/v2/StatisticV2';
import {EditorPage as CardEditorV2} from '../../../pages/cards/editor/editor-page-v2/Page';
import CheckQuestion from '../../../pages/check-question/page/ui/check-question-page';

export const privateRoutes = [
    {
        path: '/course/*',
        component: <MainCourseEditor/>,
        navigate: 'course',
        icon: <BlurLinearIcon/>,
        title: 'Редактор курсов',
        status: ['ADMIN', 'TEACHER', 'CARD_EDITOR'],
    },
    {
        path: '/card2/*',
        component: <CardEditorV2/>,
        title: 'Редактор карточек',
        navigate: 'card2',
        icon: <AppRegistrationIcon/>,
        status: ['ADMIN', 'TEACHER', 'CARD_EDITOR'],
    },
    {
        path: '/se',
        component: <SearchingElementsEditor/>,
        title: 'Редактор тем',
        navigate: 'se',
        icon: <AccountTreeIcon/>,
        status: ['ADMIN', 'TEACHER'],
    },
    {
        path: '/question',
        component: <QuestionEditor/>,
        title: 'Редактор вопросов',
        navigate: 'question',
        icon: <QuizIcon/>,
        status: ['ADMIN', 'TEACHER'],
    },
    {
        path: '/qse',
        component: <QuestionSequenceMainEditor/>,
        title: 'Редактор серий вопросов',
        navigate: 'qse',
        icon: <LinearScaleIcon/>,
        status: ['ADMIN', 'TEACHER'],
    },
    {
        path: '/statistic2/*',
        component: <StatisticV2/>,
        title: 'Статистика',
        navigate: 'statistic2',
        icon: <AddchartIcon/>,
        status: ['ADMIN', 'TEACHER'],
    },
    {
        path: '/exam/*',
        component: <ExamEditorPage/>,
        title: 'Редактор экзаменов',
        navigate: 'exam',
        icon: <SchoolIcon/>,
        status: ['ADMIN', 'TEACHER'],
    },
    {
        path: '/checkquestion/*',
        component: <CheckQuestion/>,
        title: 'Проверка вопросов',
        navigate: 'checkquestion',
        icon: <RuleIcon/>,
        status: ['ADMIN', 'TEACHER'],
    },
    {
        path: '/status-editor/*',
        component: <StatusEditorPage/>,
        title: 'Редактор уровней доступа',
        navigate: 'status-editor',
        icon: <GroupIcon/>,
        status: ['ADMIN', 'TEACHER'],
    },

    {
        path: '/question/selected/:id',
        component: (
            <div>
                <EditQuestionByURL/>
            </div>
        ),
        status: ['ADMIN', 'TEACHER'],
    },
    {
        path: '*',
        component: <MainCourseEditor/>,
        status: ['ADMIN', 'TEACHER', 'CARD_EDITOR'],
    },
];
