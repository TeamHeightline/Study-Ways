import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Paper, Rating} from "@mui/material";


interface ICardRatingProps extends PaperProps{

}

const CardRating = observer(({...props}: ICardRatingProps) =>{
    return(
        <Paper elevation={0} {...props}>
            <Rating
                // value={rating}
                // onChange={(event, newValue) => {
                //     setRating(newValue);
                // }}
            />
        </Paper>
    )
})

export default CardRating