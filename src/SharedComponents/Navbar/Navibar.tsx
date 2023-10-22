// Мы в панели навигации, ВСЕ ПЕРЕХОДЫ СДЕЛАНЫ ЧЕРЕЗ LINK, никаких href, иначе все приложение
// будет перегружаться

import {useNavigate} from 'react-router-dom';
import useWindowDimensions from "../../CustomHooks/useWindowDimensions";
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {observer} from "mobx-react";
import IconMenu from "./IconMenu";
import {alpha, styled} from '@mui/material/styles';

const BlurredAppBar = styled(AppBar)(
    ({theme}) => `
  background-color: ${alpha(theme.palette.background.default, 0.10)};
  background-image: none;
  backdrop-filter: blur(10px);
  box-shadow: none;
  z-index: ${theme.zIndex.drawer + 1};
`,
)

export const Navibar = observer(() => {
    const {width} = useWindowDimensions();
    const navigate = useNavigate();

    return (
        <BlurredAppBar position="fixed" sx={{height: 48}}>
            <Toolbar variant="dense" sx={{justifyContent: {xs: "space-around", md: "none"}}}>

                <Typography variant="h6"
                            sx={{color: "white", flexGrow: 1, display: {xs: "none", md: "block"}}}
                            onClick={() => {
                                navigate("/courses")
                            }}>
                    {width >= 765 ? "Study Ways" : "SW"}
                </Typography>
                <IconMenu/>
            </Toolbar>
        </BlurredAppBar>
    );
})
