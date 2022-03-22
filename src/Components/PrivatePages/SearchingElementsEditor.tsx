import React from 'react'
import LCUserTestThemeEditor from "../Elements/SearchingElements/UserTestThemeEditor/[LC]UserTestThemeEditor";
import {Grid, Stack, Typography} from "@mui/material";
import ThemeEditor from "../Elements/ThemeTree/ThemeEditor";
import {isMobileHook} from "../../CustomHooks/isMobileHook";

export default function SearchingElementsEditor({...props}: any) {
    const isMobile = isMobileHook()
    return (
        <div {...props}>
            <Stack direction={"column"} alignItems={"center"}>
                <Typography variant={"h3"} sx={{pt: 4, pb: 2}}>
                    Редактор связанных тем
                </Typography>
            </Stack>
            <Grid container justifyContent={"center"}
                  style={{paddingLeft: isMobile ? 12 : 48}}>
                <ThemeEditor/>
            </Grid>
            <Stack direction={"column"} alignItems={"center"} sx={{pb: 4}}>
                <Typography variant={"h3"}>
                    Темы для вопросов
                </Typography>
            </Stack>
            <Grid container justifyContent={"center"}
                  style={{paddingLeft: isMobile ? 12 : 48}}>
                <Grid item xs={12} md={6}>
                    <LCUserTestThemeEditor/>
                </Grid>
            </Grid>
        </div>
    )
}