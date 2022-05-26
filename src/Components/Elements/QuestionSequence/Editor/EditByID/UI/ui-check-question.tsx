import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Dialog, Paper} from "@mui/material";
import editQSStore from "../store/edit-question-sequence-sore";
import CheckQuestionByID from "../../../../CheckQuestion/CheckQuestionByID/UI/check-question-by-id";


interface IUICheckQuestionProps extends PaperProps {

}

const UICheckQuestion = observer(({...props}: IUICheckQuestionProps) => {
    return (
        <Paper elevation={0} {...props}>
            <Dialog
                open={editQSStore.checkQuestionID != null}
                onClose={() => editQSStore.checkQuestionID = null}
                fullWidth={true}
                maxWidth={'lg'}
            >
                {editQSStore.checkQuestionID &&
                    <CheckQuestionByID question_id={editQSStore.checkQuestionID}/>}
            </Dialog>
        </Paper>
    )
})

export default UICheckQuestion
