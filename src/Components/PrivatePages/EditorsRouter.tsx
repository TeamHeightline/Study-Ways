import React, {Suspense} from "react";
import {Alert, Button, CircularProgress, Grid} from '@mui/material';
import AlertTitle from '@mui/material/AlertTitle';
import ArtTrackIcon from '@mui/icons-material/ArtTrack';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import BlurLinearIcon from '@mui/icons-material/BlurLinear';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import LinearScaleIcon from '@mui/icons-material/LinearScale';
import AddchartIcon from '@mui/icons-material/Addchart';

const SearchingElementsEditor = React.lazy(() => import("./SearchingElementsEditor"))
const QuestionSequenceMainEditor = React.lazy(() => import("./QuestionSequenceMainEditor"))
const MainCourseEditor = React.lazy(() => import("./MainCourseEditor"))
const MainCardEditor = React.lazy(() => import("./MainCardEditor"))

const QuestionEditor = React.lazy(() => import("./QuestionEditor").then(module => ({default: module.QuestionEditor})))
const MainUserQuestionPage = React.lazy(() => import("./MainUserQuestionPage").then(module => ({default: module.MainUserQuestionPage})))
const MainStatistic = React.lazy(() => import("./MainStatistic").then(module => ({default: module.MainStatistic})))
const StatisticV2 = React.lazy(() =>import("../Elements/Statistic/V2/show-statistic-for-selected-questions/StatisticV2").then(module => ({default: module.StatisticV2})))

import {UserStorage} from '../../Store/UserStore/UserStore'
import {observer} from "mobx-react";
import {
    Switch,
    Route,
    useRouteMatch, useHistory, Redirect
} from "react-router-dom";

import clsx from 'clsx';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import BarChartIcon from '@mui/icons-material/BarChart';
import {Tooltip, Typography} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import {isMobileHook} from "../../CustomHooks/isMobileHook";
const drawerWidth = 70;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        drawerOpen: {
            [theme.breakpoints.up('md')]: {
                marginTop: "50px"
            },
            width: theme.spacing(7) + 1,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        drawerClose: {
            [theme.breakpoints.up('md')]: {
                marginTop: "50px"
            },
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            overflowX: 'hidden',
            width: drawerWidth,
        },
    }),
);

export const EditorsRouter = observer(() =>{
    // const [value, setValue] = React.useState(0);
    const history = useHistory();
    const { path } = useRouteMatch();
    // const location = useLocation();
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const isMobile = isMobileHook()

    const handleDrawer = () => {
        setOpen(!open);
    };


    // useEffect(() =>{
    //     //Необходимо для того, чтобы правильно подсвечивать активную вкладку
    //     if(location.pathname ==="/editor/course" && value !== 1){
    //         setValue(1)
    //     }
    //     if(location.pathname ==="/editor/card" && value !== 2){
    //         setValue(2)
    //     }
    //     if(location.pathname ==="/editor/se" && value !== 3){
    //         setValue(3)
    //     }
    //     if(location.pathname ==="/editor/qse" && value !== 4){
    //         setValue(4)
    //     }
    // }, [])
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
                variant={isMobile? "temporary": "permanent"}
                open={open}
                onClose={()=> setOpen(!open)}

                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }}
            >
                <div>
                    <IconButton onClick={handleDrawer} size="large">
                        {!open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <Tooltip title={<Typography variant="body1">Редактор курсов</Typography>}>
                        <ListItem button onClick={() => {
                            if(isMobile){
                                setOpen(false)
                            }
                            history.push(`${path}/course`)
                        }}>
                            <ListItemIcon>
                                <BlurLinearIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Редактор курсов"/>
                        </ListItem>
                    </Tooltip>
                    <Tooltip title={<Typography variant="body1">Редактор карточек</Typography>}>
                        <ListItem button onClick={() => {
                            if(isMobile){
                                setOpen(false)
                            }
                            history.push(`${path}/card`)}}>
                            <ListItemIcon>
                                <ArtTrackIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Редактор карточек"/>
                        </ListItem>
                    </Tooltip>
                    <Tooltip title={<Typography variant="body1">Темы и авторы</Typography>}>
                        <ListItem button onClick={() => {
                            if(isMobile){
                                setOpen(false)
                            }
                            history.push(`${path}/se`)}}>
                            <ListItemIcon>
                                <RecentActorsIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Темы и авторы"/>
                        </ListItem>
                    </Tooltip>
                    <Tooltip title={<Typography variant="body1">Редактор вопросов</Typography>}>
                        <ListItem button onClick={() => {
                            if(isMobile){
                                setOpen(false)
                            }
                            history.push(`${path}/question`)}}>
                            <ListItemIcon>
                                <FormatListBulletedIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Редактор вопросов"/>
                        </ListItem>
                    </Tooltip>
                    <Tooltip title={<Typography variant="body1">Редактор серии вопросов</Typography>}>
                        <ListItem button onClick={() => {
                            if(isMobile){
                                setOpen(false)
                            }
                            history.push(`${path}/qse`)}}>
                            <ListItemIcon>
                                <LinearScaleIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Редактор серии вопросов"/>
                        </ListItem>
                    </Tooltip>
                    <Tooltip title={<Typography variant="body1">Статистика</Typography>}>
                        <ListItem button onClick={() => {
                            if(isMobile){setOpen(false)}
                            history.push(`${path}/statistic`)}}>
                            <ListItemIcon>
                                <BarChartIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Статистика (устаревшее)"/>
                        </ListItem>
                    </Tooltip>
                    <Tooltip title={<Typography variant="body1">Статистика (второе поколение)</Typography>}>
                        <ListItem button onClick={() => {
                            if(isMobile){setOpen(false)}
                            history.push(`${path}/statistic2`)}}>
                            <ListItemIcon>
                                <AddchartIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Статистика (второе поколение)"/>
                        </ListItem>
                    </Tooltip>
                </List>
            </Drawer>
            {isMobile &&
            <Grid container justifyContent="center">
                <Grid item>
                    <Button fullWidth variant="outlined"
                            endIcon={<MenuIcon />} onClick={() => {
                                setOpen(!open)
                            }}
                    >
                        Меню
                    </Button>
                </Grid>
            </Grid>}
            <Suspense fallback={<Grid container justifyContent={"center"} sx={{pt: 4}}><CircularProgress /></Grid>}>
                <div className={isMobile? "" :"pl-5"}>
                    <Switch>
                        <Route  path={`${path}/course`} component={MainCourseEditor}/>
                        <Route  path={`${path}/card`} component={MainCardEditor}/>
                        <Route  path={`${path}/se`} component={SearchingElementsEditor}/>
                        <Route  path={`${path}/question`} component={QuestionEditor}/>
                        <Route  path={`${path}/qse`} component={QuestionSequenceMainEditor}/>
                        <Route  path={`${path}/statistic`} component={MainStatistic}/>
                        <Route path={`${path}/allquestions`} component={MainUserQuestionPage}/>
                        <Route path={`${path}/statistic2`} component={StatisticV2}/>
                        {/*Чтобы на основной странице отображался редактор курсов, в самом низу
                        потому что иначе будет открываться только он, потому что это будет первым
                        результатом switch*/}
                        <Redirect to={`${path}/course`}/>
                    </Switch>
                </div>
            </Suspense>

        </div>
    );
})