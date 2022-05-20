import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Grid, Paper} from "@mui/material";
import editQSStore from "../store/edit-question-sequence-sore";
import UIQuestionMiniViewByData from "./ui-question-mini-view-by-data";


interface IUiSelectedQuestionsProps extends PaperProps{

}

const UiSelectedQuestions = observer(({...props}: IUiSelectedQuestionsProps) =>{
    return(
        <Grid container spacing={10} rowSpacing={5} sx={{mt: 2}} alignItems="stretch">
            {editQSStore?.qsData?.sequence_data?.sequence?.map((questionID: string, questionIndex) => {
                    const questionData = editQSStore?.allQuestions
                        .find((questionObj) => questionObj.id == questionID)
                    if (questionData) {
                        return (
                            <UIQuestionMiniViewByData
                                onClick={() => editQSStore.removeSelectedQuestion(questionIndex)}
                                questionData={questionData}
                                key={questionData.id}/>
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
