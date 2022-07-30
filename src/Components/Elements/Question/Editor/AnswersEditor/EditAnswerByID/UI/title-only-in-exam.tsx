import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Chip, Paper} from "@mui/material";
import {EditAnswerByIdStore} from "../Store/edit-answer-by-id-store";
import SchoolIcon from "@mui/icons-material/School";
import ArchitectureIcon from "@mui/icons-material/Architecture";


interface ITitleRequireTagProps extends PaperProps {
    answer_object: EditAnswerByIdStore

}

const TitleOnlyInExam = observer(({answer_object, ...props}: ITitleRequireTagProps) => {
    const onlyInExam = answer_object.answer_object?.onlyForExam
    return (
        <Paper elevation={0} {...props}>
            <Chip
                variant="outlined"
                onClick={answer_object.changeOnlyForExam}
                icon={onlyInExam ? <SchoolIcon/> : <ArchitectureIcon/>}
                color={onlyInExam ? "primary" : "warning"}
                label={onlyInExam ? "Только для экзамена" : "Отображается в тренировочном режиме"}
            />
        </Paper>
    )
})

export default TitleOnlyInExam