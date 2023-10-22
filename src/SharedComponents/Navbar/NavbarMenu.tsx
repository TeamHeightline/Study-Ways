import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Box, Divider, IconButton, ListItemIcon, MenuItem, Popover, Tooltip} from "@mui/material";
import {DarkMode} from "@mui/icons-material";
import {UserStorage} from "../../Store/UserStore/UserStore";
import {useAuth0} from "@auth0/auth0-react";
import {useNavigate} from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import ThemeStoreObject from "../../global-theme";
import LightModeIcon from '@mui/icons-material/LightMode';
import NightlightIcon from '@mui/icons-material/Nightlight';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

interface INavbarMenuProps extends PaperProps {

}

const NavbarMenu = observer(({...props}: INavbarMenuProps) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const navigate = useNavigate();


    const {logout, isAuthenticated} = useAuth0();

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>

            <Tooltip title={"Меню"}>
                <IconButton onClick={handleMenu} sx={{mx: 2}}>
                    <MenuIcon/>
                </IconButton>
            </Tooltip>
            <Popover
                open={!!anchorEl}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}

            >
                <Box sx={{py: 1}}>
                    <MenuItem
                        disabled={!UserStorage.isLogin}
                        onClick={() => {
                            handleClose()
                            navigate('/profile')
                        }}>
                        <ListItemIcon>
                            <ManageAccountsIcon fontSize="small"/>
                        </ListItemIcon>
                        Профиль
                    </MenuItem>
                    <MenuItem
                        disabled={UserStorage.userAccessLevel !== "ADMIN" && UserStorage.userAccessLevel !== "TEACHER"}
                        onClick={() => {
                            handleClose()
                            navigate('/editor')
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
                            navigate('/editor/allquestions')
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
                            {ThemeStoreObject.mode === "light" &&
                                <NightlightIcon fontSize="small"/>
                            }
                            {ThemeStoreObject.mode === "dark" &&
                                <DarkMode fontSize="small"/>}
                            {ThemeStoreObject.mode === "dark2" &&
                                <LightModeIcon fontSize="small"/>}

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
                </Box>
            </Popover>

        </>
    )
})

export default NavbarMenu
