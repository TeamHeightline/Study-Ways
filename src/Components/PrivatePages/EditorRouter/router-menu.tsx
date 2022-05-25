import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Button, Grid, Paper, Tooltip, Typography} from "@mui/material";
import Drawer from "@mui/material/Drawer";
import clsx from "clsx";
import IconButton from "@mui/material/IconButton";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import BlurLinearIcon from "@mui/icons-material/BlurLinear";
import ListItemText from "@mui/material/ListItemText";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import QuizIcon from "@mui/icons-material/Quiz";
import LinearScaleIcon from "@mui/icons-material/LinearScale";
import AddchartIcon from "@mui/icons-material/Addchart";
import MenuIcon from "@mui/icons-material/Menu";
import {useHistory, useRouteMatch} from "react-router-dom";
import {isMobileHook} from "../../../CustomHooks/isMobileHook";
import makeStyles from "@mui/styles/makeStyles";
import {Theme} from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import RuleIcon from '@mui/icons-material/Rule';
import GroupIcon from '@mui/icons-material/Group';


interface IRouterMenuProps extends PaperProps {

}

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


const RouterMenu = observer(({...props}: IRouterMenuProps) => {
    // const [value, setValue] = React.useState(0);
    const history = useHistory();
    const {path} = useRouteMatch();
    // const location = useLocation();
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const isMobile = isMobileHook()

    const handleDrawer = () => {
        setOpen(!open);
    };


    return (
        <Paper elevation={0} {...props}>
            <Drawer
                variant={isMobile ? "temporary" : "permanent"}
                open={open}
                onClose={() => setOpen(!open)}

                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }}
            >
                <div>
                    <IconButton onClick={handleDrawer} size="large">
                        {!open ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
                    </IconButton>
                </div>
                <Divider/>
                <List>
                    <Tooltip title={<Typography variant="body1">Редактор курсов</Typography>}>
                        <ListItem button onClick={() => {
                            if (isMobile) {
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
                    <Tooltip title={<Typography variant="body1">Редактор карточек (второе поколение)</Typography>}>
                        <ListItem button onClick={() => {
                            if (isMobile) {
                                setOpen(false)
                            }
                            history.push(`${path}/card2`)
                        }}>
                            <ListItemIcon>
                                <AppRegistrationIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Редактор карточек"/>
                        </ListItem>
                    </Tooltip>
                    <Tooltip title={<Typography variant="body1">Объединенные темы и авторы</Typography>}>
                        <ListItem button onClick={() => {
                            if (isMobile) {
                                setOpen(false)
                            }
                            history.push(`${path}/se`)
                        }}>
                            <ListItemIcon>
                                {/*<HubIcon/>*/}
                                <AccountTreeIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Объединенные темы"/>
                        </ListItem>
                    </Tooltip>
                    <Tooltip title={<Typography variant="body1">Редактор вопросов</Typography>}>
                        <ListItem button onClick={() => {
                            if (isMobile) {
                                setOpen(false)
                            }
                            history.push(`${path}/question`)
                        }}>
                            <ListItemIcon>
                                <QuizIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Редактор вопросов"/>
                        </ListItem>
                    </Tooltip>
                    <Tooltip title={<Typography variant="body1">Редактор серии вопросов</Typography>}>
                        <ListItem button onClick={() => {
                            if (isMobile) {
                                setOpen(false)
                            }
                            history.push(`${path}/qse`)
                        }}>
                            <ListItemIcon>
                                <LinearScaleIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Редактор серии вопросов"/>
                        </ListItem>
                    </Tooltip>
                    <Tooltip title={<Typography variant="body1">Статистика (второе поколение)</Typography>}>
                        <ListItem button onClick={() => {
                            if (isMobile) {
                                setOpen(false)
                            }
                            history.push(`${path}/statistic2`)
                        }}>
                            <ListItemIcon>
                                <AddchartIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Статистика (второе поколение)"/>
                        </ListItem>
                    </Tooltip>
                    {/*<Tooltip title={<Typography variant="body1">Экзамен</Typography>}>*/}
                    {/*    <ListItem button onClick={() => {*/}
                    {/*        if (isMobile) {*/}
                    {/*            setOpen(false)*/}
                    {/*        }*/}
                    {/*        history.push(`${path}/exam`)*/}
                    {/*    }}>*/}
                    {/*        <ListItemIcon>*/}
                    {/*            <SchoolIcon/>*/}
                    {/*        </ListItemIcon>*/}
                    {/*        <ListItemText primary="Экзамен)"/>*/}
                    {/*    </ListItem>*/}
                    {/*</Tooltip>*/}
                    <Tooltip title={<Typography variant="body1">Проверка вопросов</Typography>}>
                        <ListItem button onClick={() => {
                            if (isMobile) {
                                setOpen(false)
                            }
                            history.push(`${path}/checkquestion`)
                        }}>
                            <ListItemIcon>
                                <RuleIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Проверка вопросов"/>
                        </ListItem>
                    </Tooltip>
                    <Tooltip title={<Typography variant="body1">Редактор статусов</Typography>}>
                        <ListItem button onClick={() => {
                            if (isMobile) {
                                setOpen(false)
                            }
                            history.push(`${path}/status-editor`)
                        }}>
                            <ListItemIcon>
                                <GroupIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Редактор статусов"/>
                        </ListItem>
                    </Tooltip>
                </List>
            </Drawer>
            {isMobile &&
                <Grid container justifyContent="center">
                    <Grid item>
                        <Button fullWidth variant="outlined"
                                endIcon={<MenuIcon/>} onClick={() => {
                            setOpen(!open)
                        }}
                        >
                            Меню
                        </Button>
                    </Grid>
                </Grid>}
        </Paper>
    )
})

export default RouterMenu
