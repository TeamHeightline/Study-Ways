import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {TextField} from "@mui/material";
import {EditAnswerByIdStore} from "../Store/edit-answer-by-id-store";


interface IAnswerTextProps extends PaperProps {
    answer_object: EditAnswerByIdStore
}

const AnswerText = observer(({answer_object, ...props}: IAnswerTextProps) => {
    return (
        <TextField
            variant={"filled"}
            label="ТЕКСТ ОТВЕТА"
            autoFocus
            multiline
            fullWidth
            maxRows={7}
            value={answer_object.getField("text")}
            onChange={answer_object.changeField("text")}
        />
    )
})

export default AnswerText