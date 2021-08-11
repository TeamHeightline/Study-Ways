import React, {useEffect} from "react";
import {BottomNavigation} from "@material-ui/core";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import {QuestionEditor} from "./QuestionEditor";
import {Alert} from "@material-ui/lab";
import AlertTitle from "@material-ui/lab/AlertTitle";
import ArtTrackIcon from '@material-ui/icons/ArtTrack';
import MainCardEditor from "./MainCardEditor";
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import MainCourseEditor from "./MainCourseEditor";
import BlurLinearIcon from '@material-ui/icons/BlurLinear';
import RecentActorsIcon from '@material-ui/icons/RecentActors';

import LinearScaleIcon from '@material-ui/icons/LinearScale'; // оставим для серии вопросов
import SearchingElementsEditor from "./SearchingElementsEditor";
import QuestionSequenceMainEditor from "./QuestionSequenceMainEditor";
import {UserStorage} from '../../Store/UserStore/UserStore'
import {observer} from "mobx-react";
import {
    Switch,
    Route,
    useRouteMatch, useHistory, useLocation, Redirect
} from "react-router-dom";


export const EditorsRouter = observer(() =>{
    const [value, setValue] = React.useState(0);
    const history = useHistory();
    const { path } = useRouteMatch();
    const location = useLocation();

    useEffect(() =>{
        //Необходимо для того, чтобы правильно подсвечивать активную вкладку
        if(location.pathname ==="/editor/course" && value !== 1){
            setValue(1)
        }
        if(location.pathname ==="/editor/card" && value !== 2){
            setValue(2)
        }
        if(location.pathname ==="/editor/se" && value !== 3){
            setValue(3)
        }
        if(location.pathname ==="/editor/qse" && value !== 4){
            setValue(4)
        }
    }, [])
    if (UserStorage.userAccessLevel !== "ADMIN" && UserStorage.userAccessLevel !== "TEACHER"){
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
                if(newValue === 0){
                    history.push(`${path}/course`)
                }
                if(newValue === 1){
                    history.push(`${path}/card`)
                }
                if(newValue === 2){
                    history.push(`${path}/se`)
                }
                if(newValue === 3){
                    history.push(`${path}/question`)
                }
                if(newValue === 4){
                    history.push(`${path}/qse`)
                }
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
        <Switch>
            <Route  path={`${path}/course`} component={MainCourseEditor}/>
            <Route  path={`${path}/card`} component={MainCardEditor}/>
            <Route  path={`${path}/se`} component={SearchingElementsEditor}/>
            <Route  path={`${path}/question`} component={QuestionEditor}/>
            <Route  path={`${path}/qse`} component={QuestionSequenceMainEditor}/>
            {/*Чтобы на основной странице отображался редактор курсов, в самом низу
            потому что иначе будет открываться только он, потому что это будет первым
            результатом switch*/}
            <Redirect to={`${path}/course`}/>
        </Switch>


            {/*{value === 0 && <MainCourseEditor/>}*/}
            {/*{value === 1 && <MainCardEditor/>}*/}
            {/*{value === 2 && <SearchingElementsEditor/>}*/}
            {/*{value === 3 && <QuestionEditor/>}*/}
            {/*{value === 4 && <QuestionSequenceMainEditor/>}*/}
        </div>
    );
})