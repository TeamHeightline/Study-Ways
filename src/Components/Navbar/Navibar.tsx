// Мы в панели навигации, ВСЕ ПЕРЕХОДЫ СДЕЛАНЫ ЧЕРЕЗ LINK, никаких href, иначе все приложение
// будет перегружаться

import s from'./navibar.module.css';
import {Link, useHistory} from 'react-router-dom';
import useWindowDimensions from "../../CustomHooks/useWindowDimensions";
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import {UserStorage} from '../../Store/UserStore/UserStore'

import BlurLinearIcon from "@material-ui/icons/BlurLinear";
import ArtTrackIcon from "@material-ui/icons/ArtTrack";
import DoneAllIcon from '@material-ui/icons/DoneAll';
import EditIcon from '@material-ui/icons/Edit';
import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import {observer} from "mobx-react";
import {AccountCircle} from "@material-ui/icons";
import {Menu, MenuItem} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            // height: 40
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
            color: "white",
        },
    }),
);

export const Navibar = observer(() => {
    const classes = useStyles();
    const{height, width} = useWindowDimensions();
    const [value, setValue] = React.useState('0');//Здесь хронится значение на какой мы странице для
    // мобильных устройств
    const history = useHistory();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const mobileMunuClickHandleChange = (event, newValue) => {
        if(newValue == 0){
            history.push('/courses')
        }
        if(newValue == 1){
            history.push('/cards')
        }
        if(newValue == 2){
            history.push('/test')
        }
        if(newValue == 3){
            history.push('/editor')
        }
        setValue(newValue);
    };

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    if(height/width >= 1){
    return (
        <BottomNavigation value={value} onChange={mobileMunuClickHandleChange} className="col-12">
            <BottomNavigationAction label="Курсы" value="0" icon={<BlurLinearIcon />} />
            <BottomNavigationAction label="Карточки" value="1" icon={<ArtTrackIcon />} />
            <BottomNavigationAction label="Вопросы" value="2" icon={<DoneAllIcon />} />
            <BottomNavigationAction label="Редакторы" value="3" icon={<EditIcon />} />
        </BottomNavigation>
    )}
    return (
        <div className={classes.root}>
            <AppBar position="static" >
                <Toolbar variant="dense">
                    {/*<IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">*/}
                    {/*    <br/>*/}
                    {/*</IconButton>*/}
                    <Typography variant="h6" className={classes.title}>
                        { width >= 715 ? "Study Ways" : "SW"}
                    </Typography>
                     <Link className={s.link} to="/courses">Курсы </Link>
                     <Link className={s.link} to="/cards">Карточки</Link>
                     <Link className={s.link} to="/test">Вопросы</Link>
                     <Typography className="ml-4"> | </Typography>
                     <Link className={s.link} to="/editor">Редакторы</Link>
                    {UserStorage.isLogin ?
                        <>
                        <Typography className="ml-5 mr-4">{UserStorage.username}</Typography>
                        <IconButton
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <AccountCircle />
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
                                    <MenuItem onClick={() => {
                                        handleClose()
                                        history.push('/unlogin')
                                    }}>Logout</MenuItem>
                                </Menu>

                        </> :
                        <>
                            <Button className="ml-5 mr-4" color="inherit" variant="outlined"
                                    onClick={()=>{history.push('/login')}}>
                                Login
                            </Button>
                        </>}
                </Toolbar>
            </AppBar>
        </div>
    );
})