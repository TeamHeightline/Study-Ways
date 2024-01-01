import {IconButton, Stack} from "@mui/material";
import {UserStorage} from "../../Store/UserStore/UserStore";
import NavbarMenu from "./NavbarMenu";
import React from "react";
import {useNavigate} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";
import {observer} from "mobx-react";
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import PersonalMenu from "./PersonalMenu";
import HelpArticleByURL from "../../Pages/HelpArticle/HelpArticleByURL";


const IconMenu = observer(() => {
    const navigate = useNavigate();
    const {loginWithPopup} = useAuth0();

    return (
        <Stack direction={"row"} sx={{backdropFilter: "none"}}>

            <Stack direction={"row"} spacing={2}>
                <HelpArticleByURL/>

                {UserStorage.isLogin ?
                    <>
                        <NavbarMenu/>
                        <PersonalMenu/>
                        {/*<NotificationButtonForNavbar/>*/}
                    </>
                    :
                    <IconButton sx={{mx: 2}} onClick={() => {
                        loginWithPopup()
                    }}>
                        <VpnKeyIcon/>
                    </IconButton>}


            </Stack>
        </Stack>
    )
})

export default IconMenu
