import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Grid, Paper} from "@mui/material";
import editQSStore from "../store/edit-question-sequence-sore";
import UIQuestionMiniViewByData from "./ui-question-mini-view-by-data";


interface IUIAllQuestionsProps extends PaperProps {

}

const UIAllQuestions = observer(({...props}: IUIAllQuestionsProps) => {
    return (
        <Paper elevation={0} {...props}>
            <Grid container spacing={10} rowSpacing={5} sx={{pt: 2}} alignItems="stretch">
                {editQSStore.QuestionsForSelect.map((questionData) => {
                    return (
                        <UIQuestionMiniViewByData
                            onClick={() => editQSStore.addSelectedQuestion(questionData.id)}
                            questionData={questionData}
                            key={questionData.id}/>
                    )
                })}
            </Grid>
        </Paper>
    )
})

export default UIAllQuestions
