import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {FormControlLabel, Switch} from "@mui/material";
import {answer_object_type} from "../Store/edit-answer-by-id-store";


interface IIsEditAnswerProps extends PaperProps {
    answer_object: answer_object_type
}

const IsEditAnswer = observer(({answer_object, ...props}: IIsEditAnswerProps) => {
    return (
        <FormControlLabel
            control={<Switch checked={answer_object.isOpenForEdit}
                             onChange={answer_object.changeIsOpenForEdit}/>}
            label="Расширенный редактор"
        />
    )
})

export default IsEditAnswer