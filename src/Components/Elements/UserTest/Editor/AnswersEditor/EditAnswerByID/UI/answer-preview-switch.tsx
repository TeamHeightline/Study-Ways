import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Paper, Switch} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import {answer_object_type} from "../Store/edit-answer-by-id-store";


interface IAnswerPreviewSwitchProps extends PaperProps {
    answer_object: answer_object_type
}

const AnswerPreviewSwitch = observer(({answer_object, ...props}: IAnswerPreviewSwitchProps) => {
    const changeIsShowAnswerPreview = () => {
        answer_object.isShowAnswerPreview = !answer_object.isShowAnswerPreview
    }
    return (
        <Paper elevation={0} {...props}>
            <FormControlLabel
                control={<Switch color="primary"
                                 checked={answer_object.isShowAnswerPreview}
                                 onChange={changeIsShowAnswerPreview}/>}
                label="Включить предпросмотр"
            />
        </Paper>
    )
})

export default AnswerPreviewSwitch