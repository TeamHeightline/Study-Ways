import {observer} from "mobx-react";
import React from 'react';
import {Grid, TextField} from "@mui/material";
import {AISObject} from "../Store/AISearch";

export const AISearchString = observer(() =>{
    return(
        <Grid container justifyContent={"center"}>
            <Grid item xs={12} md={6} sx={{pb:2}}>
                <TextField
                    onChange={AISObject.changeAISearchString}
                    value={AISObject.AISearchString}
                    fullWidth
                    label="Поиск на основе личных предпочтений"
                    variant="outlined" />
            </Grid>
        </Grid>
    )
})