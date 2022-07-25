import {IconButton, Stack, Tooltip} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AppsIcon from "@mui/icons-material/Apps";
import {UserStorage} from "../../../Store/UserStore/UserStore";
import NavbarMenu from "./NavbarMenu";
import React from "react";
import {useHistory} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";
import NotificationButtonForNavbar from "./Notification/UI/notification-button-for-nav-bar";
import LoginIcon from '@mui/icons-material/Login';


export default function IconMenu() {
    const history = useHistory();
    const {loginWithPopup} = useAuth0();

    return (
        <Stack direction={"row"}>
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
                <Stack direction={"row"}>
                    <NavbarMenu/>
                    <NotificationButtonForNavbar/>
                </Stack>
                :
                <IconButton sx={{mx: 2}}
                            onClick={() => {
                                loginWithPopup()
                            }}>
                    <LoginIcon/>
                </IconButton>}
        </Stack>
    )
}