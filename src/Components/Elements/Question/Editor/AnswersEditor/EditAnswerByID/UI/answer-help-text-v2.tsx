import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {TextField} from "@mui/material";
import {EditAnswerByIdStore} from "../Store/edit-answer-by-id-store";


interface IAnswerHelpTextV2Props extends PaperProps {
    answer_object: EditAnswerByIdStore

}

const AnswerHelpTextV2 = observer(({answer_object, ...props}: IAnswerHelpTextV2Props) => {
    return (
        <TextField
            variant={"outlined"}
            label="Подсказка для стандартного уровня сложности"
            multiline
            fullWidth
            maxRows={7}
            value={answer_object.getField("helpTextv2")}
            onChange={answer_object.changeField("helpTextv2")}
        />
    )
})

export default AnswerHelpTextV2