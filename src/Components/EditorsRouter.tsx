import React from "react";
import {BottomNavigation} from "@material-ui/core";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import LCUpdateQuestion from "./UserTest/Editor/UpdateQuestion/[LC]UpdateQuestion";
import {Alert} from "@material-ui/lab";
import AlertTitle from "@material-ui/lab/AlertTitle";
import ArtTrackIcon from '@material-ui/icons/ArtTrack';
import MainCardEditor from "./Cards/Editor/MainCardEditor/MainCardEditor";
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import MainCourseEditor from "./Course/Editor/MainCourseEditor";
import BlurLinearIcon from '@material-ui/icons/BlurLinear';
import RecentActorsIcon from '@material-ui/icons/RecentActors';

import LinearScaleIcon from '@material-ui/icons/LinearScale'; // оставим для серии вопросов
import SearchingElementsPage from "./SearchingElements/SearchingElementsPage";
import QuestionSequenceMainEditor from "./QuestionSequence/Editor/QuestionSequenceMainEditor";
import User from '../Store/UserStore/UserStore'
import {observer} from "mobx-react";



export const EditorsRouter = observer(() =>{
    const [value, setValue] = React.useState(0);
    console.log(User.userAccessLevel)
    // User.UpdateUser()
    if (User.userAccessLevel !== "ADMIN" && User.userAccessLevel !== "TEACHER"){
        return (
            <Alert severity="error">
                <AlertTitle>Доступ ограничен</AlertTitle>
                Вы не обладаете достаточными правами, чтобы просматривать этот раздел, для дополнитльной информации обратитесь к администрации
            </Alert>
        )
    }
    return (
        <div>
        <BottomNavigation
            value={value}
            onChange={(event, newValue) => {
                setValue(newValue);
            }}
            showLabels
            className="col-12"
        >
            <BottomNavigationAction label="Редактор курсов" icon={<BlurLinearIcon/>}/>
            <BottomNavigationAction label="Редактор карточек" icon={<ArtTrackIcon/>}/>
            <BottomNavigationAction label="Темы и авторы" icon={<RecentActorsIcon/>}/>
            <BottomNavigationAction label="Редактор вопроса" icon={<FormatListBulletedIcon />} />
            <BottomNavigationAction label="Редактор серии вопросов" icon={<LinearScaleIcon />} />
        </BottomNavigation>
            {value === 0 && <MainCourseEditor/>}
            {value === 1 && <MainCardEditor/>}
            {value === 2 && <SearchingElementsPage/>}
            {value === 3 && <LCUpdateQuestion/>}
            {value === 4 && <QuestionSequenceMainEditor/>}
        </div>
    );
})