import {observer} from "mobx-react";
import React, {useEffect} from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Grid, Paper} from "@mui/material";
import QSSObject from "../Store/question-selector-store";
import QuestionNanoViewByID from "../../QuestionNanoViewByID/UI/question-nano-view-by-id";
import AuthorSelector from "./authors-selector";
import QuestionPagination from "./question-pagination";


interface IQuestionSelectorProps extends PaperProps {
    onQuestionSelect: (question_id: string) => void
}

const QuestionSelector = observer(({onQuestionSelect, ...props}: IQuestionSelectorProps) => {
    useEffect(() => QSSObject.loadMyQuestionsIDArray(), [])
    useEffect(() => QSSObject.loadUsersWithQuestion(), [])
    return (
        <Paper elevation={0} {...props} >
            <AuthorSelector/>
            <Grid container spacing={4} justifyContent="space-between" sx={{pr: 3, pl: 3, pt: 3}}>
                {QSSObject?.QuestionsIDArrayForDisplay.map((question_id) => {
                    return (
                        <Grid
                            onClick={() => onQuestionSelect(question_id)}
                            item
                            key={"Question" + question_id}>
                            <QuestionNanoViewByID question_id={Number(question_id)}/>
                        </Grid>
                    )
                })}
            </Grid>
            <QuestionPagination/>
        </Paper>
    )
})

export default QuestionSelector