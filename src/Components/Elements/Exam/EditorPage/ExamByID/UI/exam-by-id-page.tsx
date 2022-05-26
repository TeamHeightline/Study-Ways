import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Paper, Stack} from "@mui/material";
import GoBackButton from "./go-back";
import ExamName from "./exam-name";
import UIPageTitle from "./ui-page-title";
import UIDuration from "./ui-duration";
import UIQuestionSequenceSelector from "./ui-question-sequence-selector";


interface IExamByIDProps extends PaperProps {

}

const ExamByID = observer(({...props}: IExamByIDProps) => {
    return (
        <Paper elevation={0} {...props} sx={{pt: 2}}>
            <UIPageTitle/>
            <Stack direction={"column"} spacing={1} maxWidth={300}>
                <GoBackButton/>
                <ExamName sx={{pt: 1}}/>
                <UIDuration/>
                <UIQuestionSequenceSelector/>
            </Stack>
        </Paper>
    )
})

export default ExamByID
