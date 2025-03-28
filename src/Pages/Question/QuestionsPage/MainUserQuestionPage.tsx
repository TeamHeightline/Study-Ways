import React, {useEffect} from 'react';
import {Button, Card, CardActionArea, CircularProgress, Grid, MenuItem, Select, Stack, Typography} from "@mui/material";
import {observer} from "mobx-react";
import {QuestionPageStorage} from "./Store/QuestionPageStore";
import {toJS} from "mobx";
import {useNavigate} from "react-router-dom";

export const MainUserQuestionPage = observer(() => {
    useEffect(() => QuestionPageStorage.getQuestionData(), [])

    const navigate = useNavigate();


    if (!QuestionPageStorage.dataHasBeenDelivered) {
        return (
            <Stack alignItems={"center"}>
                <CircularProgress/>
            </Stack>
        )
    }

    return (
        <div>
            <Stack direction={"column"} alignItems={"center"}>
                <Typography variant={"h4"}>
                    Выберите вопрос
                </Typography>
            </Stack>
            <Grid container spacing={2} justifyContent="space-between" sx={{mt: 1, p: 1}}>
                {toJS(QuestionPageStorage.questionsData).map((question) => {
                    return (
                        <Grid item key={question.id} sx={{width: "100%",}} xs={12} md={4} lg={3}>
                            <Card
                                sx={{height: 160, width: "100%", overflow: 'hidden', borderRadius: '20px'}}
                            >
                                <CardActionArea sx={{p: 3}}
                                                onClick={() => navigate("/iq/" + question.id)}>
                                    <div style={{
                                        height: 112,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}>
                                        <Typography>
                                            {"ID: " + question.id}
                                        </Typography>
                                        <Typography>
                                            {question?.text}
                                        </Typography>
                                    </div>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    )
                })}
            </Grid>
        </div>
    )
})
