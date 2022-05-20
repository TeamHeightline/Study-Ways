import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Paper} from "@mui/material";


interface IUITextSearchProps extends PaperProps{

}

const UITextSearch = observer(({...props}: IUITextSearchProps) =>{
    return(
        <Paper elevation={0} {...props}>

        </Paper>
    )
})

export default UITextSearch
