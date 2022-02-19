import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Paper} from "@mui/material";
import GoBackButton from "./go-back";
import ExamName from "./exam-name";


interface IExamByIDProps extends PaperProps {

}

const ExamByID = observer(({...props}: IExamByIDProps) => {
    return (
        <Paper elevation={0} {...props} sx={{pt: 2}}>
            <GoBackButton/>
            Страница для экзамена
            <ExamName sx={{pt: 1}}/>
        </Paper>
    )
})

export default ExamByID