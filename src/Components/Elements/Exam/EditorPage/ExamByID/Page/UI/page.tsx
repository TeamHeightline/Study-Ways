import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Paper} from "@mui/material";
import ExamByID from "../../UI/exam-by-id-page";


interface IExamEditorPageProps extends PaperProps {

}

const ExamEditorPage = observer(({...props}: IExamEditorPageProps) => {
    return (
        <Paper elevation={0} {...props} sx={{pl: 4}}>
            <ExamByID exam_id={5}/>
        </Paper>
    )
})

export default ExamEditorPage
