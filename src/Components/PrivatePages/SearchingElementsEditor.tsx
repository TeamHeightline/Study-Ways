import React from 'react'
import {Grid, Stack, Typography} from "@mui/material";
import ThemeEditor from "../Elements/ThemeTree/ThemeEditor";
import {isMobileHook} from "../../CustomHooks/isMobileHook";

export default function SearchingElementsEditor({...props}: any) {
    const isMobile = isMobileHook()
    return (
        <div {...props}>
            <Stack direction={"column"} alignItems={"center"}>
                <Typography variant={"h3"} sx={{pt: 4, pb: 2}}>
                    Редактор тем для вопросов и ресурсов
                </Typography>
            </Stack>
            <Grid container justifyContent={"center"}
                  style={{paddingLeft: isMobile ? 12 : 48}}>
                <ThemeEditor/>
            </Grid>
        </div>
    )
}
