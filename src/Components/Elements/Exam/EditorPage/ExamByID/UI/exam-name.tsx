import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Paper, TextField} from "@mui/material";


interface IExamNameProps extends PaperProps {

}

const ExamName = observer(({...props}: IExamNameProps) => {
    return (
        <Paper elevation={0} {...props}>
            <TextField
                fullWidth
                variant="filled"
                multiline
                label={"Название экзамена"}/>
        </Paper>
    )
})

export default ExamName
