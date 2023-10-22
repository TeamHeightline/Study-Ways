import {observer} from "mobx-react";
import React from 'react';
import {Grid, TextField} from "@mui/material";
import {CSSObject} from "../Store/CardSelectorStore";

interface ICleverSearchingProps extends React.HTMLAttributes<HTMLDivElement>{

}
export const CleverSearching = observer(({...props}: ICleverSearchingProps) =>{
    return(
        <div {...props}>
            <Grid container justifyContent="center">
                <Grid item xs={12} md={8}>
                    <TextField
                        value={CSSObject.searching_string}
                        onChange={CSSObject.changeSearchString}
                        fullWidth label="Умный поиск по названию и тексту карточки" variant="filled" />
                </Grid>
            </Grid>
        </div>
    )
})