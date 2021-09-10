import React, {useEffect} from "react";
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

import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
        appBarShift: {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        menuButton: {
            marginRight: 36,
        },
        hide: {
            display: 'none',
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
            whiteSpace: 'nowrap',
        },
        drawerOpen: {
            marginTop: "50px",
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        drawerClose: {
            marginTop: "50px",
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            overflowX: 'hidden',
            width: theme.spacing(7) + 1,
            [theme.breakpoints.up('sm')]: {
                width: theme.spacing(9) + 1,
            },
        },
        toolbar: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: theme.spacing(0, 1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
        },
    }),
);

export const EditorsRouter = observer(() =>{
    const [value, setValue] = React.useState(0);
    const history = useHistory();
    const { path } = useRouteMatch();
    const location = useLocation();
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);


    const handleDrawer = () => {
        setOpen(!open);
    };


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
            <Drawer
                variant="permanent"
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }}
            >
                <div>
                    <IconButton onClick={handleDrawer}>
                        {!open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <ListItem button onClick={() => history.push(`${path}/course`)}>
                        <ListItemIcon>
                            <BlurLinearIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Редактор курсов"/>
                    </ListItem>
                    <ListItem button onClick={() => history.push(`${path}/card`)}>
                        <ListItemIcon>
                            <ArtTrackIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Редактор карточек"/>
                    </ListItem>
                    <ListItem button onClick={() => history.push(`${path}/se`)}>
                        <ListItemIcon>
                            <RecentActorsIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Темы и авторы"/>
                    </ListItem>
                    <ListItem button onClick={() => history.push(`${path}/question`)}>
                        <ListItemIcon>
                            <FormatListBulletedIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Редактор вопроса"/>
                    </ListItem>
                    <ListItem button onClick={() => history.push(`${path}/qse`)}>
                        <ListItemIcon>
                            <LinearScaleIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Редактор серии вопросов"/>
                    </ListItem>
                </List>
            </Drawer>
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

        </div>
    );
})