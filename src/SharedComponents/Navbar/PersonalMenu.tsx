import {Box, Divider, IconButton, ListItemIcon, MenuItem, Popover, Tooltip} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";
import React from "react";
import {UserStorage} from "../../Store/UserStore/UserStore";
import StackedLineChartIcon from "@mui/icons-material/StackedLineChart";
import {useNavigate} from "react-router-dom";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import HomeIcon from '@mui/icons-material/Home';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import HistoryIcon from '@mui/icons-material/History';
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import ThemeStoreObject from "../../global-theme";
import NightlightIcon from "@mui/icons-material/Nightlight";
import {DarkMode} from "@mui/icons-material";
import LightModeIcon from "@mui/icons-material/LightMode";
import LogoutIcon from "@mui/icons-material/Logout";
import {useAuth0} from "@auth0/auth0-react";

interface IPersonalMenuProps extends BoxProps {

}

export default function PersonalMenu({...props}: IPersonalMenuProps) {
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
        <Box {...props}>
            <Tooltip title={"Личная активность"}>
                <IconButton onClick={handleMenu}>
                    <AccountBoxIcon/>
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


                    <MenuItem disabled={!UserStorage.isLogin}
                              onClick={() => {
                                  handleClose()
                                  navigate('/selfstatistic')
                              }}>
                        <ListItemIcon>
                            <StackedLineChartIcon/>
                        </ListItemIcon>
                        Результаты тестов
                    </MenuItem>
                    <MenuItem disabled={!UserStorage.isLogin}
                              onClick={() => {
                                  handleClose()
                                  navigate('/bookmarks')
                              }}>
                        <ListItemIcon>
                            <BookmarksIcon/>
                        </ListItemIcon>
                        Закладки
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
        </Box>
    )
}
