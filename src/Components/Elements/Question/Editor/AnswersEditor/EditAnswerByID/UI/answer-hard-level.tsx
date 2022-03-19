import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {InputLabel, MenuItem, Select} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import {answer_object_type} from "../Store/edit-answer-by-id-store";


interface IAnswerHardLevelProps extends PaperProps {
    answer_object: answer_object_type

}

const AnswerHardLevel = observer(({answer_object, ...props}: IAnswerHardLevelProps) => {
    return (
        <FormControl fullWidth>
            <InputLabel>Сложность ответа</InputLabel>
            <Select
                value={answer_object.getField("hardLevelOfAnswer")}
                onChange={answer_object.changeField("hardLevelOfAnswer")}
            >
                <MenuItem value="EASY">Очевидный</MenuItem>
                <MenuItem value="MEDIUM">Нормальный</MenuItem>
                <MenuItem value="HARD">Каверзный</MenuItem>
            </Select>
        </FormControl>
    )
})

export default AnswerHardLevel