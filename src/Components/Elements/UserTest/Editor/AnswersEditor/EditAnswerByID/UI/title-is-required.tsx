import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Chip, Paper} from "@mui/material";
import {answer_object_type} from "../Store/edit-answer-by-id-store";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

interface ITitleIsRequiredProps extends PaperProps {
    answer_object: answer_object_type

}

const TitleIsRequired = observer(({answer_object, ...props}: ITitleIsRequiredProps) => {
    const isRequired = answer_object.answer_object?.isRequired
    return (
        <Paper elevation={0} {...props}>
            <Chip
                onClick={answer_object.changeIsRequired}
                variant="outlined"
                icon={isRequired ? <CheckBoxIcon/> : <CheckBoxOutlineBlankIcon/>}
                color={isRequired ? "error" : undefined}
                label={isRequired ? "Обязательный вариант" : "Необязательный вариант"}
            />
        </Paper>
    )
})

export default TitleIsRequired