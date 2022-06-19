// Мы в панели навигации, ВСЕ ПЕРЕХОДЫ СДЕЛАНЫ ЧЕРЕЗ LINK, никаких href, иначе все приложение
// будет перегружаться

import {Link, useHistory, useLocation} from 'react-router-dom';
import useWindowDimensions from "../../../CustomHooks/useWindowDimensions";
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import {UserStorage} from '../../../Store/UserStore/UserStore'

import BlurLinearIcon from "@mui/icons-material/BlurLinear";
import ArtTrackIcon from "@mui/icons-material/ArtTrack";
import EditIcon from '@mui/icons-material/Edit';
import React from 'react';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import {observer} from "mobx-react";
import {AccountCircle} from "@mui/icons-material";
import {Menu, MenuItem} from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import StackedLineChartIcon from '@mui/icons-material/StackedLineChart';
import {isMobileHook} from "../../../CustomHooks/isMobileHook";
import ThemeModeSwitch from "./ThemeModeSwitch";
import ThemeStoreObject from "../../../global-theme";
import {useAuth0} from "@auth0/auth0-react";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            flexGrow: 1,
            // height: 40
        },
        menuButton: {
            marginRight: 12,
        },
        title: {
            flexGrow: 1,
            color: "white",
            marginLeft: "50px"
        },
    }),
);

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export const Navibar = observer(() => {
    const classes = useStyles();
    const {width} = useWindowDimensions();
    const [value, setValue] = React.useState('0');//Здесь хронится значение на какой мы странице для
    // мобильных устройств
    const history = useHistory();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const query = useQuery();
    const isMobile = isMobileHook()
    const {logout, isAuthenticated, loginWithPopup} = useAuth0();

    const mobileMunuClickHandleChange = (event, newValue) => {
        if (newValue == 0) {
            history.push('/courses')
        }
        if (newValue == 1) {
            history.push('/cards')
        }
        if (newValue == 2) {
            history.push('/direction')
        }
        if (newValue == 3) {
            history.push('/editor')
        }
        if (newValue == 4) {
            history.push('/login')
        }
        if (newValue == 5) {
            history.push("/selfstatistic")
        }
        if (newValue == 6) {
            history.push("/profile")
        }
        setValue(newValue);
    };

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    if (isMobile) {
        return (
            <BottomNavigation value={value} onChange={mobileMunuClickHandleChange}>
                <BottomNavigationAction
                    sx={{color: "white"}}
                    label="Курсы"
                    value="0"
                    icon={<BlurLinearIcon/>}/>
                <BottomNavigationAction
                    sx={{color: "white"}}
                    label="Карточки"
                    value="1"
                    icon={<ArtTrackIcon/>}/>
                {UserStorage.isLogin ?
                    UserStorage.userAccessLevel == "STUDENT" ?
                        <BottomNavigationAction
                            sx={{color: "white"}}
                            label="Собственная статистика" value="5"
                            icon={<StackedLineChartIcon/>}/> :
                        <BottomNavigationAction
                            sx={{color: "white"}}
                            label="Редакторы" value="3"
                            icon={<EditIcon/>}/> :
                    <BottomNavigationAction
                        sx={{color: "white"}}
                        label="Войти"
                        value="4"
                        icon={<AccountCircleIcon/>}/>}

                {UserStorage.isLogin &&
                    <BottomNavigationAction
                        sx={{color: "white"}}
                        label="Профиль"
                        value="6"
                        icon={<AccountCircleIcon/>}/>}

            </BottomNavigation>
        )
    }
    return (
        <div className={classes.root}>
            <AppBar position="fixed" enableColorOnDark>

                <Toolbar variant="dense">
                    {/*<IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">*/}
                    {/*    <br/>*/}
                    {/*</IconButton>*/}
                    <Typography variant="h6" className={classes.title} sx={{color: "white"}}>
                        {width >= 765 ? "Study Ways" : "SW"}
                    </Typography>
                    <Link style={{
                        color: "#ffffff", textDecorationColor: "#2D3A4A", marginLeft: 25,
                        textDecoration: "none"
                    }}
                          to="/courses">Курсы </Link>
                    <Link style={{
                        color: "#ffffff", textDecorationColor: "#2D3A4A", marginLeft: 25,
                        textDecoration: "none"
                    }}
                          to="/cards">Карточки</Link>
                    {/*<Link className={s.link} to="/test">Вопросы</Link>*/}
                    <Typography sx={{color: "white", pl: 2,}}> | </Typography>
                    {UserStorage.userAccessLevel == "ADMIN" || UserStorage.userAccessLevel == "TEACHER" ?
                        <Link style={{
                            color: "#ffffff", textDecorationColor: "#2D3A4A", marginLeft: 25,
                            textDecoration: "none"
                        }}
                              to="/editor">Редакторы</Link> :
                        <Link style={{
                            color: "#ffffff", textDecorationColor: "#2D3A4A", marginLeft: 25,
                            textDecoration: "none"
                        }}
                              to="/selfstatistic">Статистика</Link>}
                    {UserStorage.isLogin ?
                        <>
                            <Typography sx={{color: "white", pl: 4, pr: 2}}>
                                {UserStorage.username}
                            </Typography>
                            <ThemeModeSwitch
                                onClick={ThemeStoreObject.changeMode}
                                checked={!ThemeStoreObject.isLightTheme}
                            />
                            <IconButton
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                sx={{color: "white"}}
                                size="large">
                                <AccountCircle/>
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={open}
                                onClose={handleClose}
                            >
                                <MenuItem
                                    disabled={!UserStorage.isLogin}
                                    onClick={() => {
                                        handleClose()
                                        history.push('/profile')
                                    }}>
                                    Профиль
                                </MenuItem>
                                <MenuItem
                                    disabled={UserStorage.userAccessLevel !== "ADMIN" && UserStorage.userAccessLevel !== "TEACHER"}
                                    onClick={() => {
                                        handleClose()
                                        history.push('/editor')
                                    }}>
                                    Редакторы
                                </MenuItem>
                                <MenuItem
                                    disabled={UserStorage.userAccessLevel !== "ADMIN" && UserStorage.userAccessLevel !== "TEACHER"}
                                    onClick={() => {
                                        handleClose()
                                        history.push('/editor/allquestions')
                                    }}>
                                    Вопросы
                                </MenuItem>
                                <MenuItem onClick={() => {
                                    handleClose()
                                    if (isAuthenticated) {
                                        logout({returnTo: window.location.origin})
                                    }
                                }}>
                                    Выйти
                                </MenuItem>

                            </Menu>

                        </> :
                        <>
                            <ThemeModeSwitch
                                checked={!ThemeStoreObject.isLightTheme}
                                onClick={ThemeStoreObject.changeMode}
                            />
                            <Button sx={{pl: 2, pr: 2}} color="inherit" variant="outlined"
                                    onClick={() => {
                                        loginWithPopup()
                                    }}>
                                Войти
                            </Button>
                        </>}
                </Toolbar>
            </AppBar>
        </div>
    );
})
