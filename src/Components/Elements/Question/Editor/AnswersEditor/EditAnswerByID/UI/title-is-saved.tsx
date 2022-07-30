import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {CircularProgress, Paper} from "@mui/material";
import {EditAnswerByIdStore} from "../Store/edit-answer-by-id-store";


interface ITitleIsSavedProps extends PaperProps {
    answer_object: EditAnswerByIdStore
}

const TitleIsSaved = observer(({answer_object, ...props}: ITitleIsSavedProps) => {
    return (
        <Paper elevation={0} {...props}>
            {!answer_object.stateOfSave &&
                <CircularProgress size={20}/>
            }
        </Paper>
    )
})

export default TitleIsSaved