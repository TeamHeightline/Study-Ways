import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Box, Button, Divider, IconButton, ListItemIcon, MenuItem, Popover, Tooltip} from "@mui/material";
import {useNavigate} from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import MenuIcon from '@mui/icons-material/Menu';
import haveStatus from "../../../Shared/Store/UserStore/utils/HaveStatus";
import HomeIcon from "@mui/icons-material/Home";
import AppsIcon from "@mui/icons-material/Apps";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import {UserStorage} from "../../../Shared/Store/UserStore/UserStore";
import {isMobileHook} from "../../../Shared/CustomHooks/isMobileHook";

interface INavbarMenuProps extends PaperProps {

}

const PagesMenu = observer(({...props}: INavbarMenuProps) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const navigate = useNavigate();
    const isMobile = isMobileHook()


    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Button startIcon={<MenuIcon/>} sx={{color: 'white'}} onClick={handleMenu}>
                Меню
            </Button>
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
                        onClick={() => {
                            handleClose()
                            navigate('/courses')
                        }}>
                        <ListItemIcon>
                            <HomeIcon fontSize="small"/>
                        </ListItemIcon>
                        Курсы
                    </MenuItem>

                    <MenuItem
                        onClick={() => {
                            handleClose()
                            navigate('/ai-course')
                        }}>
                        <ListItemIcon>
                            <AutoAwesomeIcon fontSize="small"/>
                        </ListItemIcon>
                        AI курсы
                    </MenuItem>

                    <MenuItem
                        onClick={() => {
                            handleClose()
                            navigate('/cards')
                        }}>
                        <ListItemIcon>
                            <AppsIcon fontSize="small"/>
                        </ListItemIcon>
                        Карточки
                    </MenuItem>

                    <MenuItem
                        disabled={!UserStorage.isLogin}
                        onClick={() => {
                            handleClose()
                            navigate('/all-questions')
                        }}>
                        <ListItemIcon>
                            <QuestionMarkIcon fontSize="small"/>
                        </ListItemIcon>
                        Тесты
                    </MenuItem>
                    <Divider/>
                    <MenuItem
                        disabled={!haveStatus(["ADMIN", "TEACHER", "CARD_EDITOR"])}
                        onClick={() => {
                            handleClose()
                            navigate('/editor')
                        }}>
                        <ListItemIcon>
                            <EditIcon fontSize="small"/>
                        </ListItemIcon>
                        Редакторы
                    </MenuItem>
                </Box>
            </Popover>
        </>
    )
})

export default PagesMenu
