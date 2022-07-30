import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Checkbox, FormControlLabel, FormHelperText, Paper} from "@mui/material";
import {EditAnswerByIdStore} from "../Store/edit-answer-by-id-store";


interface IAnswerIsRequiredProps extends PaperProps {
    answer_object: EditAnswerByIdStore

}

const AnswerIsRequired = observer(({answer_object, ...props}: IAnswerIsRequiredProps) => {
    return (
        <Paper elevation={0} {...props}>
            <FormControlLabel

                control={
                    <Checkbox
                        checked={answer_object.answer_object?.isRequired}
                        onChange={answer_object.changeIsRequired}
                        color="primary"
                    />
                }
                label="Обязательный вариант"
            />
            <FormHelperText>Случайные наборы ответов всегда будут содержать этот ответ</FormHelperText>

        </Paper>
    )
})

export default AnswerIsRequired