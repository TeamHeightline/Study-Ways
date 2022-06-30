import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Menu, MenuItem} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {AccountCircle} from "@mui/icons-material";
import {UserStorage} from "../../../Store/UserStore/UserStore";
import {useAuth0} from "@auth0/auth0-react";
import {useHistory} from "react-router-dom";


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
        </>
    )
})

export default NavbarMenu
