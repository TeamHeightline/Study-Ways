import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Checkbox, FormControlLabel, Paper} from "@mui/material";
import {EditAnswerByIdStore} from "../Store/edit-answer-by-id-store";


interface IAnswerOnlyInExamProps extends PaperProps {
    answer_object: EditAnswerByIdStore

}

const AnswerOnlyInExam = observer(({answer_object, ...props}: IAnswerOnlyInExamProps) => {
    return (
        <Paper elevation={0} {...props}>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={!answer_object.answer_object?.onlyForExam}
                        onChange={answer_object.changeOnlyForExam}
                        color="primary"
                    />
                }
                label="Отображать в режиме подготовки"
            />
        </Paper>
    )
})

export default AnswerOnlyInExam