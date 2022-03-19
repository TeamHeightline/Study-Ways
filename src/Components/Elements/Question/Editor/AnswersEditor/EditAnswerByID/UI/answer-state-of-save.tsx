import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Alert, Paper} from "@mui/material";
import {answer_object_type} from "../Store/edit-answer-by-id-store";


interface IAnswerStateOfSaveProps extends PaperProps {
    answer_object: answer_object_type

}

const AnswerStateOfSave = observer(({answer_object, ...props}: IAnswerStateOfSaveProps) => {
    return (
        <Paper elevation={0} {...props}>
            <Alert variant="outlined" severity={answer_object.stateOfSave ? "success" : "info"}>
                {answer_object.stateOfSave ? "Ответ сохранен" : "Ответ не сохранен"}
            </Alert>
        </Paper>
    )
})

export default AnswerStateOfSave