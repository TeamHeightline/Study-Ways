import {Stack} from "@mui/material";
import {UserStorage} from "../../Store/UserStore/UserStore";
import PagesMenu from "./PagesMenu";
import React from "react";
import {observer} from "mobx-react";
import PersonalMenu from "./PersonalMenu";
import {LoginButton} from "./LoginButton";

const Menu = observer(() => {
    return (
        <Stack direction={"row"} sx={{backdropFilter: "none"}}>
            <Stack direction={"row"} spacing={2}>
                <PagesMenu/>
                {UserStorage.isLogin ? <PersonalMenu/> : <LoginButton/>}
            </Stack>
        </Stack>
    )
})

export default Menu
