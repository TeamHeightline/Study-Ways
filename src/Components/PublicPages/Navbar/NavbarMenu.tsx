import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Button, Divider, ListItemIcon, Menu, MenuItem} from "@mui/material";
import {DarkMode} from "@mui/icons-material";
import {UserStorage} from "../../../Store/UserStore/UserStore";
import {useAuth0} from "@auth0/auth0-react";
import {useHistory} from "react-router-dom";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import EditIcon from '@mui/icons-material/Edit';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import ThemeStoreObject from "../../../global-theme";
import LightModeIcon from '@mui/icons-material/LightMode';

interface INavbarMenuProps extends PaperProps {

}

const NavbarMenu = observer(({...props}: INavbarMenuProps) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const history = useHistory();

    const {logout, isAuthenticated} = useAuth0();

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <>
            <Button
                onClick={handleMenu}
                sx={{color: "white", mx: 2}}
                endIcon={<MenuIcon/>}>
                Меню
            </Button>
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
                    <ListItemIcon>
                        <AccountBoxIcon fontSize="small"/>
                    </ListItemIcon>
                    Профиль
                </MenuItem>
                <MenuItem
                    disabled={UserStorage.userAccessLevel !== "ADMIN" && UserStorage.userAccessLevel !== "TEACHER"}
                    onClick={() => {
                        handleClose()
                        history.push('/editor')
                    }}>
                    <ListItemIcon>
                        <EditIcon fontSize="small"/>
                    </ListItemIcon>
                    Редакторы
                </MenuItem>
                <MenuItem
                    disabled={UserStorage.userAccessLevel !== "ADMIN" && UserStorage.userAccessLevel !== "TEACHER"}
                    onClick={() => {
                        handleClose()
                        history.push('/editor/allquestions')
                    }}>
                    <ListItemIcon>
                        <QuestionMarkIcon fontSize="small"/>
                    </ListItemIcon>
                    Вопросы
                </MenuItem>
                <Divider/>
                <MenuItem
                    onClick={ThemeStoreObject.changeMode}
                >
                    <ListItemIcon>
                        {ThemeStoreObject.mode === "dark" ?
                            <LightModeIcon fontSize="small"/> :
                            <DarkMode fontSize="small"/>}

                    </ListItemIcon>
                    Сменить тему
                </MenuItem>
                <MenuItem onClick={() => {
                    handleClose()
                    if (isAuthenticated) {
                        logout({returnTo: window.location.origin})
                    }
                }}>
                    <ListItemIcon>
                        <LogoutIcon/>
                    </ListItemIcon>
                    Выйти
                </MenuItem>

            </Menu>
        </>
    )
})

export default NavbarMenu
