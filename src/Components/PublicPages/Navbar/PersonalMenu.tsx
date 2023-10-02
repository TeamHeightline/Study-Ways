import {Box, IconButton, ListItemIcon, MenuItem, Popover, Tooltip} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";
import React from "react";
import {UserStorage} from "../../../Store/UserStore/UserStore";
import StackedLineChartIcon from "@mui/icons-material/StackedLineChart";
import {useNavigate} from "react-router-dom";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import HomeIcon from '@mui/icons-material/Home';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import HistoryIcon from '@mui/icons-material/History';

interface IPersonalMenuProps extends BoxProps {

}

export default function PersonalMenu({...props}: IPersonalMenuProps) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const navigate = useNavigate();

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box {...props}>
            <Tooltip title={"Личная активность"}>
                <IconButton onClick={handleMenu} sx={{mx: 2}}>
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
                            navigate('/my-courses')
                        }}>
                        <ListItemIcon>
                            <HomeIcon/>
                        </ListItemIcon>
                        Мои курсы
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
                    <MenuItem disabled={!UserStorage.isLogin}
                              onClick={() => {
                                  navigate('/recent-cards')
                              }}>
                        <ListItemIcon>
                            <HistoryIcon/>
                        </ListItemIcon>
                        Недавние карточки
                    </MenuItem>

                </Box>
            </Popover>
        </Box>
    )
}
