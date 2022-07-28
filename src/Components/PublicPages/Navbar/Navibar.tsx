// Мы в панели навигации, ВСЕ ПЕРЕХОДЫ СДЕЛАНЫ ЧЕРЕЗ LINK, никаких href, иначе все приложение
// будет перегружаться

import {useNavigate} from 'react-router-dom';
import useWindowDimensions from "../../../CustomHooks/useWindowDimensions";
import BottomNavigation from '@mui/material/BottomNavigation';
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {observer} from "mobx-react";

import {isMobileHook} from "../../../CustomHooks/isMobileHook";
import ThemeStoreObject from "../../../global-theme";
import {Stack} from "@mui/material";
import IconMenu from "./IconMenu";


export const Navibar = observer(() => {
    const {width} = useWindowDimensions();
    const navigate = useNavigate();
    const isMobile = isMobileHook()


    if (isMobile) {
        return (
            <BottomNavigation>
                <Stack alignItems={"center"}>
                    <IconMenu/>
                </Stack>
            </BottomNavigation>
        )
    }
    return (
        <AppBar position="fixed"
                enableColorOnDark={ThemeStoreObject.isNavbarColored}
                sx={{zIndex: (theme) => theme.zIndex.drawer + 1}}
        >

            <Toolbar variant="dense">
                <Typography variant="h6"
                            sx={{color: "white", flexGrow: 1}}
                            onClick={() => {
                                navigate("/courses")
                            }}>
                    {width >= 765 ? "Study Ways" : "SW"}
                </Typography>
                <IconMenu/>
            </Toolbar>
        </AppBar>
    );
})
