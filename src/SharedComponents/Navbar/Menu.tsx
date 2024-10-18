import {IconButton, Stack} from "@mui/material";
import {UserStorage} from "../../Store/UserStore/UserStore";
import PagesMenu from "./PagesMenu";
import React from "react";
import {useAuth0} from "@auth0/auth0-react";
import {observer} from "mobx-react";
import PersonalMenu from "./PersonalMenu";
import LoginIcon from '@mui/icons-material/Login';

const Menu = observer(() => {
    const {loginWithPopup} = useAuth0();

    return (
        <Stack direction={"row"} sx={{backdropFilter: "none"}}>
            <Stack direction={"row"} spacing={2}>
                <PagesMenu/>
                {UserStorage.isLogin ?
                    <>
                        <PersonalMenu/>
                    </>
                    :
                    <IconButton sx={{mx: 2}} onClick={() => {
                        loginWithPopup()
                    }}>
                        <LoginIcon/>
                    </IconButton>}
            </Stack>
        </Stack>
    )
})

export default Menu
