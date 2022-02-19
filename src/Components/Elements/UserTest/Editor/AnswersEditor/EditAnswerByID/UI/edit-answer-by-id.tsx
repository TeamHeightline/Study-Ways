import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Paper} from "@mui/material";


interface IEditAnswerByIDProps extends PaperProps {
    answer_id: number
}

const EditAnswerByID = observer(({answer_id, ...props}: IEditAnswerByIDProps) => {
    return (
        <Paper elevation={0} {...props}>
            
        </Paper>
    )
})

export default EditAnswerByID