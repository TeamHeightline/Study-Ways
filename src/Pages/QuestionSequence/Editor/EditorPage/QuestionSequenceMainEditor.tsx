import React, {useState} from 'react'
import {useMutation, useQuery} from "@apollo/client";
import {Mutation, QuestionSequenceNode} from "../../../../SchemaTypes";
import {
    CREATE_QUESTION_SEQUENCE,
    GET_MY_QUESTION_SEQUENCE,
    question_sequence_struct
} from "../Struct"
import {Button, Card, CardActionArea, Chip, CircularProgress, Grid, Paper, Stack, Typography} from "@mui/material";
import {sort} from "fast-sort";
import EditQuestionSequenceUI from "../EditByID/UI/edit-question-sequence-ui";

export default function QuestionSequenceMainEditor() {
    const {
        data: question_sequence_data,
        refetch: refetch_question_sequence_data
    } = useQuery<any, null>(GET_MY_QUESTION_SEQUENCE)
    const [isEditNow, setIsEditNow] = useState(false)
    const [activeEditSequenceID, setActiveEditSequenceID] = useState<number>(0)
    const [createQuestionSequence] = useMutation<Mutation, { sequenceData: any }>(CREATE_QUESTION_SEQUENCE, {
        variables: {
            sequenceData: question_sequence_struct
        },
        onCompleted: () => {
            refetch_question_sequence_data()
        }
    })
    const sequenceArray: QuestionSequenceNode[] = sort<QuestionSequenceNode>(question_sequence_data?.me?.questionsequenceSet)
        .desc((sequence) => sequence?.id)

    if (!question_sequence_data) {
        return (
            <Stack alignItems={"center"}>
                <CircularProgress/>
            </Stack>
        )
    }
    if (isEditNow) {
        return (
            <EditQuestionSequenceUI
                qsID={String(activeEditSequenceID)}
                onChange={(data) => {
                    if (data === "goBack") {
                        refetch_question_sequence_data()
                        setIsEditNow(false)
                    }
                }}
            />
            // <QuestionSequenceEditByID
            //     sequence={question_sequence_data?.me?.questionsequenceSet
            //         ?.find((sequence) => Number(sequence.id) === Number(activeEditSequenceID))}
            //     onChange={(data) => {
            //         if (data === "goBack") {
            //             refetch_question_sequence_data()
            //             setIsEditNow(false)
            //         }
            //     }}/>
        )
    }
    return (
        <Paper elevation={0}>
            <Grid container justifyContent="center">
                <Grid item xs={12} md={8}>
                    <Button variant="outlined" color="primary" fullWidth sx={{mt: 2}}
                            size="large" onClick={() => {
                        createQuestionSequence()
                        setTimeout(refetch_question_sequence_data, 2000)
                    }}
                    >
                        Создать новую серию вопросов
                    </Button>
                    <Grid container spacing={4} sx={{pt: 2}}>
                        {sequenceArray?.map((sequence) => {
                            return (
                                <Grid item xs={12} md={6}>
                                    <Card variant="outlined" key={sequence?.id + "SequenceKey"}
                                          onClick={async () => {
                                              await setActiveEditSequenceID(Number(sequence.id))
                                              await setTimeout(setIsEditNow, 500, true)
                                          }
                                          }>
                                        <CardActionArea>
                                            <Stack direction={"column"} spacing={0.5} sx={{p: 2}}>
                                                <Typography variant="h6" color="textSecondary">
                                                    <strong>
                                                        {"ID: " + sequence?.id}
                                                    </strong>
                                                </Typography>
                                                <Typography variant={"body1"}>
                                                    {"Название: " + sequence?.name}
                                                </Typography>
                                                <Typography variant={"body1"}>
                                                    {"Описание: " + sequence?.description}
                                                </Typography>
                                                <Grid container spacing={1}>
                                                    {sequence?.sequenceData?.sequence?.map((question, qIndex) => {
                                                        return (
                                                            <Grid item xs={"auto"}
                                                                  key={sequence?.id + "SequenceKey" + qIndex + "QuestionKey"}>
                                                                <Chip label={question} variant={"outlined"}/>
                                                            </Grid>
                                                        )
                                                    })}
                                                </Grid>
                                            </Stack>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            )
                        })}
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    )
}
