import React, {useEffect} from 'react';
import {Button, CircularProgress, MenuItem, Select, Stack, Typography} from "@mui/material";
import {observer} from "mobx-react";
import {QuestionPageStorage} from "./Store/QuestionPageStore";
import {toJS} from "mobx";
import {useNavigate} from "react-router-dom";

export const MainUserQuestionPage = observer(() => {
    useEffect(() => QuestionPageStorage.getQuestionData(), [])

    const navigate = useNavigate();

    function handleStartQuestion() {
        if (!QuestionPageStorage.selectedQuestionID) {
            return
        }
        navigate('/iq/' + QuestionPageStorage.selectedQuestionID)
    }


    if (!QuestionPageStorage.dataHasBeenDelivered) {
        return (
            <Stack alignItems={"center"}>
                <CircularProgress/>
            </Stack>
        )
    }

    return (
        <div>
            <Stack alignItems={"center"} sx={{pt: 4}}>
                <div style={{maxWidth: 400, width: '100%'}}>
                    <Stack direction={"column"} alignItems={"center"}>
                        <Typography variant={"h4"}>
                            Выберите вопрос
                        </Typography>
                    </Stack>

                    <Select
                        sx={{mt: 2}}
                        fullWidth
                        value={QuestionPageStorage.selectedQuestionID}
                        onChange={QuestionPageStorage.changeSelectedQuestionID}>
                        {toJS(QuestionPageStorage.questionsData).map((question) => {
                            return (<MenuItem key={question?.id}
                                              value={question?.id}>
                                {"ID: " + question?.id + " " + question?.text}
                            </MenuItem>)
                        })}
                    </Select>
                    <Button fullWidth variant="contained" color="primary" sx={{mt: 2}}
                            size={"large"}
                            disabled={!QuestionPageStorage.selectedQuestionID}
                            onClick={handleStartQuestion}>
                        Начать тест
                    </Button>
                </div>
            </Stack>
        </div>
    )
})
