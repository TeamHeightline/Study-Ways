import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Paper, TextField} from "@mui/material";
import {isMobileHook} from "../../../../../../CustomHooks/isMobileHook";


interface IExamNameProps extends PaperProps {

}

const ExamName = observer(({...props}: IExamNameProps) => {
    const isMobile = isMobileHook()
    return (
        <Paper elevation={0} {...props}>
            <TextField
                sx={{minWidth: !isMobile ? 300 : undefined}}
                variant="filled"
                multiline
                label={"Название экзамена"}/>
        </Paper>
    )
})

export default ExamName