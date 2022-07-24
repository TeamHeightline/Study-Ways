// Мы в панели навигации, ВСЕ ПЕРЕХОДЫ СДЕЛАНЫ ЧЕРЕЗ LINK, никаких href, иначе все приложение
// будет перегружаться

import {Link, useHistory} from 'react-router-dom';
import useWindowDimensions from "../../../CustomHooks/useWindowDimensions";
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import {UserStorage} from '../../../Store/UserStore/UserStore'
import BlurLinearIcon from "@mui/icons-material/BlurLinear";
import ArtTrackIcon from "@mui/icons-material/ArtTrack";
import React from 'react';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {observer} from "mobx-react";

import {isMobileHook} from "../../../CustomHooks/isMobileHook";
import {useAuth0} from "@auth0/auth0-react";
import NavbarMenu from "./NavbarMenu";
import ThemeStoreObject from "../../../global-theme";
import NotificationButtonForNavbar from "./Notification/UI/notification-button-for-nav-bar";
import LoginIcon from '@mui/icons-material/Login';
import HomeIcon from '@mui/icons-material/Home';
import AppsIcon from '@mui/icons-material/Apps';
import {IconButton, Tooltip} from "@mui/material";

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


export const Navibar = observer(() => {
    const classes = useStyles();
    const {width} = useWindowDimensions();
    const [value, setValue] = React.useState('0');//Здесь хронится значение на какой мы странице для
    // мобильных устройств
    const history = useHistory();
    const isMobile = isMobileHook()
    const {loginWithPopup} = useAuth0();

    const mobileMenuClickHandleChange = (event, newValue) => {
        setValue(newValue);
    };


    if (isMobile) {
        return (
            <BottomNavigation value={value} onChange={mobileMenuClickHandleChange}>
                <BottomNavigationAction
                    sx={{color: "white"}}
                    onClick={() => {
                        history.push('/courses')
                    }}
                    label="Курсы"
                    value="0"
                    icon={<BlurLinearIcon/>}/>
                <BottomNavigationAction
                    sx={{color: "white"}}
                    onClick={() => {
                        history.push('/cards')
                    }}
                    label="Карточки"
                    value="1"
                    icon={<ArtTrackIcon/>}/>

                {UserStorage.isLogin ?
                    <NavbarMenu/> :
                    <BottomNavigationAction
                        onClick={() => {
                            loginWithPopup()
                        }}
                        sx={{color: "white"}}
                        label="Войти"
                        value="4"
                        icon={<LoginIcon/>}/>
                }

            </BottomNavigation>
        )
    }
    return (
        <div className={classes.root}>
            <AppBar position="fixed"
                    enableColorOnDark={ThemeStoreObject.isNavbarColored}
            >

                <Toolbar variant="dense">
                    {/*<IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">*/}
                    {/*    <br/>*/}
                    {/*</IconButton>*/}
                    <Typography variant="h6"
                                className={classes.title}
                                sx={{color: "white"}}
                                onClick={() => {
                                    history.push("/courses")
                                }}>
                        {width >= 765 ? "Study Ways" : "SW"}
                    </Typography>

                    <Tooltip title={"Курсы"}>
                        <IconButton
                            sx={{mx: 1}}
                            onClick={() => {
                                history.push("/courses")
                            }}>
                            <HomeIcon/>
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={"Карточки"}>
                        <IconButton
                            sx={{mx: 1}}
                            onClick={() => {
                                history.push("/cards")
                            }}>
                            <AppsIcon/>
                        </IconButton>
                    </Tooltip>

                    {UserStorage.isLogin ?
                        <>
                            <NavbarMenu/>
                            <NotificationButtonForNavbar/>
                        </>
                        :
                        <Button sx={{pl: 2, pr: 2, mx: 2}} color="inherit" variant="outlined"
                                onClick={() => {
                                    loginWithPopup()
                                }}>
                            Войти
                        </Button>}
                </Toolbar>
            </AppBar>
        </div>
    );
})
