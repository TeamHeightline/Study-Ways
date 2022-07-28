import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Box, Button, Grid, Paper, Tooltip, Typography} from "@mui/material";
import Drawer from "@mui/material/Drawer";
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
import SchoolIcon from '@mui/icons-material/School';
import AddchartIcon from "@mui/icons-material/Addchart";
import MenuIcon from "@mui/icons-material/Menu";
import {useNavigate} from "react-router-dom";
import {isMobileHook} from "../../../CustomHooks/isMobileHook";
import RuleIcon from '@mui/icons-material/Rule';
import GroupIcon from '@mui/icons-material/Group';


interface IRouterMenuProps extends PaperProps {

}


const RouterMenu = observer(({...props}: IRouterMenuProps) => {
    const navigate = useNavigate();
    const [isOpen, setOpen] = React.useState(false);
    const isMobile = isMobileHook()

    const handleDrawer = () => {
        setOpen(!isOpen);
    };


    return (
        <Paper elevation={0} {...props}>
            <Drawer
                variant={"permanent"}
                open={isOpen}
                onClose={() => setOpen(!isOpen)}


            >
                <Box
                    sx={(theme) => ({
                        pt: "50px",
                        width: isOpen ? 250 : isMobile ? 0 : 70,
                        overflowX: 'hidden',
                        transition: theme.transitions.create('width', {
                            easing: theme.transitions.easing.sharp,
                            duration: theme.transitions.duration.leavingScreen,
                        }),
                    })}>
                    <div>
                        < IconButton onClick={handleDrawer} size="large">
                            {!isOpen ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
                        </IconButton>
                    </div>
                    <Divider/>
                    <List>
                        <Tooltip title={<Typography variant="body1">Курсов</Typography>}>
                            <ListItem onClick={() => {
                                if (isMobile) {
                                    setOpen(false)
                                }
                                navigate(`/editor/course`)
                            }}>
                                <ListItemIcon>
                                    <BlurLinearIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Редактор курсов"/>
                            </ListItem>
                        </Tooltip>
                        <Tooltip title={<Typography variant="body1">Карточки</Typography>}>
                            <ListItem onClick={() => {
                                if (isMobile) {
                                    setOpen(false)
                                }
                                navigate(`/editor/card2`)
                            }}>
                                <ListItemIcon>
                                    <AppRegistrationIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Редактор карточек"/>
                            </ListItem>
                        </Tooltip>
                        <Tooltip title={<Typography variant="body1">Темы</Typography>}>
                            <ListItem onClick={() => {
                                if (isMobile) {
                                    setOpen(false)
                                }
                                navigate(`/editor/se`)
                            }}>
                                <ListItemIcon>
                                    {/*<HubIcon/>*/}
                                    <AccountTreeIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Редактор тем"/>
                            </ListItem>
                        </Tooltip>
                        <Tooltip title={<Typography variant="body1">Вопросы</Typography>}>
                            <ListItem onClick={() => {
                                if (isMobile) {
                                    setOpen(false)
                                }
                                navigate(`/editor/question`)
                            }}>
                                <ListItemIcon>
                                    <QuizIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Редактор вопросов"/>
                            </ListItem>
                        </Tooltip>
                        <Tooltip title={<Typography variant="body1">Серии вопросов</Typography>}>
                            <ListItem onClick={() => {
                                if (isMobile) {
                                    setOpen(false)
                                }
                                navigate(`/editor/qse`)
                            }}>
                                <ListItemIcon>
                                    <LinearScaleIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Редактор серии вопросов"/>
                            </ListItem>
                        </Tooltip>
                        <Tooltip title={<Typography variant="body1">Статистика</Typography>}>
                            <ListItem onClick={() => {
                                if (isMobile) {
                                    setOpen(false)
                                }
                                navigate(`/editor/statistic2`)
                            }}>
                                <ListItemIcon>
                                    <AddchartIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Статистика"/>
                            </ListItem>
                        </Tooltip>
                        <Tooltip title={<Typography variant="body1">Редактор экзаменов</Typography>}>
                            <ListItem onClick={() => {
                                if (isMobile) {
                                    setOpen(false)
                                }
                                navigate(`/editor/exam`)
                            }}>
                                <ListItemIcon>
                                    <SchoolIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Редактор экзаменов"/>
                            </ListItem>
                        </Tooltip>
                        <Tooltip title={<Typography variant="body1">Проверка вопросов</Typography>}>
                            <ListItem onClick={() => {
                                if (isMobile) {
                                    setOpen(false)
                                }
                                navigate(`/editor/checkquestion`)
                            }}>
                                <ListItemIcon>
                                    <RuleIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Проверка вопросов"/>
                            </ListItem>
                        </Tooltip>
                        <Tooltip title={<Typography variant="body1">Уровень доступа</Typography>}>
                            <ListItem onClick={() => {
                                if (isMobile) {
                                    setOpen(false)
                                }
                                navigate(`/editor/status-editor`)
                            }}>
                                <ListItemIcon>
                                    <GroupIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Редактор уровней доступа"/>
                            </ListItem>
                        </Tooltip>
                    </List>
                </Box>
            </Drawer>
            {isMobile &&
                <Grid container justifyContent="center" sx={{pb: 2}}>
                    <Grid item>
                        <Button fullWidth variant="outlined"
                                endIcon={<MenuIcon/>} onClick={() => {
                            setOpen(!isOpen)
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
