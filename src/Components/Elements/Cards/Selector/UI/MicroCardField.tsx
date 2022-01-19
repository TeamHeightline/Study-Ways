import Grid from "@mui/material/Grid/Grid";
import {observer} from "mobx-react";
import React from 'react';
import {CSSObject} from "../Store/CardSelectorStore";
import CardMicroView from "../../CardView/#CardMicroView";

interface IMicroCardFieldProps extends React.HTMLAttributes<HTMLDivElement>{

}
export const MicroCardField = observer(({...props}: IMicroCardFieldProps) =>{
    return(
        <Grid container {...props} spacing={2} justifyContent="space-evenly">
            {CSSObject.cards_id_array?.map((card_id) =>{
                return(
                    <Grid item xs={12} md={"auto"} onClick={()=>{CSSObject.selectCard(card_id)}}>
                        <CardMicroView cardID={Number(card_id)} onChange={() =>void(0)}/>
                    </Grid>
                )
            })}
        </Grid>
    )
})