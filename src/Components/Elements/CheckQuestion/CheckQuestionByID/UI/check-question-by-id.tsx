import {observer} from "mobx-react";
import React, {useState} from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Grid, Paper, Stack} from "@mui/material";
import GoBackButton from "./go-back-button";
import {CheckQuestionByIdStore} from "../Store/check-question-by-id-store";
import CheckQuestionTitle from "./qcheck-question-title";
import {QuestionNanoViewByIdStore} from "../../../Question/QuestionNanoViewByID/Store/question-nano-view-by-id-store";
import QuestionTextAndImage from "./question-text-and-image";
import CheckAnswerIndex from "../CheckAnswerByID/UI";


interface ICheckQuestionByIDProps extends PaperProps {
    question_id: string
}

const CheckQuestionByID = observer(({question_id, ...props}: ICheckQuestionByIDProps) => {
    const [CQStore] = useState(new CheckQuestionByIdStore(question_id))
    const [QuestionDataStore] = useState(new QuestionNanoViewByIdStore(Number(question_id)))
    return (
        <Paper elevation={0} {...props} sx={{pt: 2}}>
            <GoBackButton/>
            <Stack alignItems={"center"}>
                <CheckQuestionTitle CQStore={CQStore} QuestionDataStore={QuestionDataStore}/>
            </Stack>
            <Grid
                sx={{pt: 2}}
                container
                justifyContent={"center"}
                alignItems="center">
                <Grid item xs={12} md={6}>
                    <QuestionTextAndImage QuestionDataStore={QuestionDataStore}/>
                </Grid>
            </Grid>
            <Grid container justifyContent={"center"}>
                <Grid item xs={12} md={8}>
                    {CQStore?.answersIDArray?.map((answerID, answerIndex) => {
                        return (
                            <Stack direction={"column"} key={"CheckAnswer" + answerID}>
                                <CheckAnswerIndex answerID={answerID} answerIndex={answerIndex}/>
                            </Stack>
                        )
                    })}
                </Grid>
            </Grid>
        </Paper>
    )
})

export default CheckQuestionByID