import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Chip, Paper} from "@mui/material";
import {EditAnswerByIdStore} from "../Store/edit-answer-by-id-store";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ClearIcon from '@mui/icons-material/Clear';

interface ITitleIsTrueProps extends PaperProps {
    answer_object: EditAnswerByIdStore

}

const TitleIsTrue = observer(({answer_object, ...props}: ITitleIsTrueProps) => {
    const isTrue = answer_object.answer_object?.isTrue == "true"
    return (
        <Paper elevation={0} {...props}>
            <Chip
                icon={isTrue ? <CheckCircleIcon/> : <ClearIcon/>}
                label={isTrue ? "Верный" : "Неверный"}
                color={isTrue ? "primary" : "secondary"}
                onClick={answer_object.changeIsTrue}
            />
        </Paper>
    )
})

export default TitleIsTrue