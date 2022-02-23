import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {TextField} from "@mui/material";
import {answer_object_type} from "../Store/edit-answer-by-id-store";


interface IAnswerVideoURLProps extends PaperProps {
    answer_object: answer_object_type

}

const AnswerVideoURL = observer(({answer_object, ...props}: IAnswerVideoURLProps) => {
    return (
        <TextField
            label="Ссылка на видео-ответ"
            fullWidth
            maxRows={7}
            value={answer_object.getField("videoUrl")}
            onChange={answer_object.changeField("videoUrl")}
        />
    )
})

export default AnswerVideoURL