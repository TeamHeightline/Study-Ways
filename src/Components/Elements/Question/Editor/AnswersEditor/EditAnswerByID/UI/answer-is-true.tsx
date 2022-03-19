import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {InputLabel, MenuItem, Select} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import {answer_object_type} from "../Store/edit-answer-by-id-store";


interface IAnswerIsTrueProps extends PaperProps {
    answer_object: answer_object_type

}

const AnswerIsTrue = observer(({answer_object, ...props}: IAnswerIsTrueProps) => {
    return (
        <FormControl fullWidth>
            <InputLabel sx={{pt: 2}}>Ответ верный/неверный</InputLabel>
            <Select
                fullWidth
                variant={"filled"}
                value={answer_object.isTrue}
                onChange={answer_object.changeIsTrue}
            >
                <MenuItem value="true">Верный</MenuItem>
                <MenuItem value="false">Неверный</MenuItem>
            </Select>
        </FormControl>
    )
})

export default AnswerIsTrue