import React, {useMemo, useState} from "react";
import {BottomNavigation} from "@material-ui/core";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import AddIcon from '@material-ui/icons/Add';
import {ViewList} from "@material-ui/icons";
import CreatePoint from "./UserTest/Editor/CreatePoint";
import LCUpdateQuestion from "./UserTest/Editor/UpdateQuestion/[LC]UpdateQuestion";
import {Alert} from "@material-ui/lab";
import AlertTitle from "@material-ui/lab/AlertTitle";
import {gql, useQuery} from "@apollo/client";
import {Spinner} from "react-bootstrap";
import ArtTrackIcon from '@material-ui/icons/ArtTrack';
import MainCardEditor from "./Cards/Editor/MainCardEditor/MainCardEditor";
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import MainCourseEditor from "./Course/Editor/MainCourseEditor";
import BlurLinearIcon from '@material-ui/icons/BlurLinear';
import RecentActorsIcon from '@material-ui/icons/RecentActors';

import LinearScaleIcon from '@material-ui/icons/LinearScale';
import SearchingElementsPage from "./SearchingElements/SearchingElementsPage"; // оставим для серии вопросов
const CHECK_USER_LEVEL = gql`
query CHECK_USER_LEVEL{
      me{
        id
        isStaff
        userAccessLevel
      }
    }`




export default function EditorsRouter(){
    const [value, setValue] = React.useState(0);
    const {data: check_level_data, error: check_error} = useQuery(CHECK_USER_LEVEL,{
        pollInterval: 10000
    })
    if (!check_level_data){
        return(
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    if (check_level_data.me.userAccessLevel !== "ADMIN" && check_level_data.me.userAccessLevel !== "TEACHER"){
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
            <BottomNavigationAction label="Создание вопроса" icon={ <AddIcon />} />
            <BottomNavigationAction label="Редактор вопроса" icon={<FormatListBulletedIcon />} />
        </BottomNavigation>
            {value === 0 && <MainCourseEditor/>}
            {value === 1 && <MainCardEditor/>}
            {value === 2 && <SearchingElementsPage/>}
            {value === 3 && <CreatePoint/>}
            {value === 4 && <LCUpdateQuestion/>}
        </div>
    );
}