import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Chip, Grid, Paper} from "@mui/material";
import {CheckQuestionByIdStore} from "../Store/check-question-by-id-store";
import Typography from "@mui/material/Typography";
import {NanoQuestionStoreType} from "../../../Question/QuestionNanoViewByID/Store/question-nano-view-by-id-store";


interface ICheckQuestionTitleProps extends PaperProps {
    CQStore: CheckQuestionByIdStore,
    QuestionDataStore: NanoQuestionStoreType
}

const CheckQuestionTitle = observer(({CQStore, QuestionDataStore, ...props}: ICheckQuestionTitleProps) => {
    return (
        <Paper elevation={0} {...props}>
            <Typography variant={"h2"}>Проверка вопроса №{CQStore.question_id}</Typography>
            <Grid container justifyContent={"end"}>
                <Grid item>
                    <Chip label={QuestionDataStore.owner_username}/>
                </Grid>
            </Grid>
        </Paper>
    )
})

export default CheckQuestionTitle
