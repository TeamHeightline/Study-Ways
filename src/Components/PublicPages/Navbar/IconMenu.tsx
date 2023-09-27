import {IconButton, Stack, Tooltip} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AppsIcon from "@mui/icons-material/Apps";
import {UserStorage} from "../../../Store/UserStore/UserStore";
import NavbarMenu from "./NavbarMenu";
import React from "react";
import {useNavigate} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";
import {observer} from "mobx-react";
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import PersonalMenu from "./PersonalMenu";
import HelpArticleByURL from "../../Elements/HelpArticle/HelpArticleByURL";


const IconMenu = observer(() => {
    const navigate = useNavigate();
    const {loginWithPopup} = useAuth0();

    return (
        <Stack direction={"row"} sx={{backdropFilter: "none"}}>

            <HelpArticleByURL/>

            <Tooltip title={"Курсы"}>
                <IconButton
                    sx={{mx: 1}}
                    onClick={() => {
                        navigate("/courses")
                    }}>
                    <HomeIcon/>
                </IconButton>
            </Tooltip>

            <Tooltip title={"Карточки"}>
                <IconButton
                    sx={{mx: 1}}
                    onClick={() => {
                        navigate("/cards")
                    }}>
                    <AppsIcon/>
                </IconButton>
            </Tooltip>

            {UserStorage.isLogin ?
                <Stack direction={"row"}>
                    <NavbarMenu/>
                    <PersonalMenu/>
                    {/*<NotificationButtonForNavbar/>*/}
                </Stack>
                :
                <IconButton sx={{mx: 2}}
                            onClick={() => {
                                loginWithPopup()
                            }}>
                    <VpnKeyIcon/>
                </IconButton>}
        </Stack>
    )
})

export default IconMenu
