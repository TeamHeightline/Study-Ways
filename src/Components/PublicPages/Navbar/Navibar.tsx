// Мы в панели навигации, ВСЕ ПЕРЕХОДЫ СДЕЛАНЫ ЧЕРЕЗ LINK, никаких href, иначе все приложение
// будет перегружаться

import {useHistory} from 'react-router-dom';
import useWindowDimensions from "../../../CustomHooks/useWindowDimensions";
import BottomNavigation from '@mui/material/BottomNavigation';
import React from 'react';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {observer} from "mobx-react";

import {isMobileHook} from "../../../CustomHooks/isMobileHook";
import ThemeStoreObject from "../../../global-theme";
import {Stack} from "@mui/material";
import IconMenu from "./IconMenu";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            flexGrow: 1,
            // height: 40
        },
        menuButton: {
            marginRight: 12,
        },
        title: {
            flexGrow: 1,
            color: "white",
            marginLeft: "50px"
        },
    }),
);


export const Navibar = observer(() => {
    const classes = useStyles();
    const {width} = useWindowDimensions();
    const history = useHistory();
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
        <div className={classes.root}>
            <AppBar position="fixed"
                    enableColorOnDark={ThemeStoreObject.isNavbarColored}
            >

                <Toolbar variant="dense">
                    <Typography variant="h6"
                                className={classes.title}
                                sx={{color: "white"}}
                                onClick={() => {
                                    history.push("/courses")
                                }}>
                        {width >= 765 ? "Study Ways" : "SW"}
                    </Typography>
                    <IconMenu/>
                </Toolbar>
            </AppBar>
        </div>
    );
})
