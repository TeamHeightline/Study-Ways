import React, {useEffect} from 'react'
import {Card, CardActionArea, CircularProgress, Grid, Stack, Typography} from "@mui/material";
import {QuestionEditorStorage} from "../Store/QuestionEditorStorage";
import {observer} from "mobx-react";
import {CreateNewQuestion} from "./CreateNewQuestion";
import {EditQuestionByID} from "./EditQuestionByID";
import {QuestionFolders} from "./QuestionFolders";
import Paper from "@mui/material/Paper";

export const QuestionEditor = observer(() => {
    useEffect(() => {
        QuestionEditorStorage.loadQuestionAuthorsAndThemes()
        QuestionEditorStorage.loadBasicQuestionData()
    }, [])

    if (QuestionEditorStorage.loadingQuestionData || (!QuestionEditorStorage.questionHasBeenSelected && QuestionEditorStorage.loadingBasicQuestionData)) {
        return (<Stack alignItems={"center"}><CircularProgress/></Stack>)
    }
    if (QuestionEditorStorage.questionHasBeenSelected) {
        return (
            <EditQuestionByID/>
        )
    }
    return (
        <Paper elevation={0} sx={{pl: 4}}>
            <CreateNewQuestion/>
            <QuestionFolders/>
            <Grid container spacing={4} justifyContent="space-evenly">
                {QuestionEditorStorage?.QuestionArrayForDisplay
                    ?.map((question: any) => {
                        return (
                            <Grid item key={question.id + "Question"}>
                                <Card key={question.id}
                                      style={{width: 350, height: 160, textAlign: "center"}}
                                      variant="outlined">
                                    <CardActionArea style={{height: "100%"}}
                                                    onClick={() => {
                                                        QuestionEditorStorage.selectQuestionClickHandler(question.id)
                                                    }}>
                                        <Typography>
                                            {"ID: " + question.id}
                                        </Typography>
                                        <Typography>
                                            {question?.text}
                                        </Typography>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        )
                    })}
            </Grid>
        </Paper>
    )
})