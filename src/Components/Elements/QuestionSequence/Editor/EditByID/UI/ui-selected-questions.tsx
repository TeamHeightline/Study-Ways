import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Button, Grid} from "@mui/material";
import editQSStore from "../store/edit-question-sequence-sore";
import UIQuestionMiniViewByData from "./ui-question-mini-view-by-data";
import DeleteIcon from '@mui/icons-material/Delete';

interface IUiSelectedQuestionsProps extends PaperProps {

}

const UiSelectedQuestions = observer(({...props}: IUiSelectedQuestionsProps) => {
    return (
        <Grid container spacing={10} sx={{mt: 2, pb: 4}} alignItems="stretch">
            {editQSStore?.qsData?.sequence_data?.sequence?.map((questionID: string, questionIndex) => {
                    const questionData = editQSStore?.allQuestions
                        .find((questionObj) => questionObj.id == questionID)
                    if (questionData) {
                        return (
                            <UIQuestionMiniViewByData
                                onClickOnCard={() => editQSStore.checkQuestionID = questionID}
                                questionData={questionData}
                                key={questionData.id}
                                actionButton={
                                    <Button
                                        onClick={() => editQSStore.removeSelectedQuestion(questionIndex)}
                                        sx={{mt: 1}}
                                        variant={"outlined"}
                                        color={"secondary"}
                                        startIcon={<DeleteIcon/>}
                                    >
                                        Удалить
                                    </Button>}
                            />
                        )
                    } else {
                        return <div/>
                    }
                }
            )}
        </Grid>
    )
})

export default UiSelectedQuestions
