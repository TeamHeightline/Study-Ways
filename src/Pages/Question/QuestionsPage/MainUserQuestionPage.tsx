import React, {useEffect} from 'react';
import {
    Alert,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Typography
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Collapse from "@mui/material/Collapse";
import {QuestionByID} from "../QuestionByID/UI/QuestionByID";
import {observer} from "mobx-react";
import {QuestionPageStorage} from "./Store/QuestionPageStore";
import {toJS} from "mobx";

export const MainUserQuestionPage = observer(() => {
    useEffect(() => QuestionPageStorage.getQuestionData(), [])

    if (!QuestionPageStorage.questionsData) {
        return (
            <Stack alignItems={"center"}>
                <CircularProgress/>
            </Stack>
        )
    }
    if (!QuestionPageStorage.isOpenQuestionPlayer) {
        return (
            <div>
                <Stack alignItems={"center"} sx={{pt: 4}}>
                    <div style={{maxWidth: 400, width: '100%'}}>
                        <Stack direction={"column"} alignItems={"center"}>
                            <Typography variant={"h4"}>
                                Выберите вопрос
                            </Typography>
                        </Stack>
                        <FormControl variant="outlined" fullWidth sx={{mt: 2}}>
                            <InputLabel>Вопрос</InputLabel>
                            <Select
                                value={QuestionPageStorage.selectedQuestionID}
                                onChange={QuestionPageStorage.changeSelectedQuestionID}
                                label="Вопрос">
                                {toJS(QuestionPageStorage.questionsData).map((question) => {
                                    return (<MenuItem key={question?.id}
                                                      value={question?.id}>
                                        {"ID: " + question?.id + " " + question?.text}
                                    </MenuItem>)
                                })}
                            </Select>
                        </FormControl>
                        <Button fullWidth variant="contained" color="primary" sx={{mt: 2}}
                                size={"large"}
                                onClick={QuestionPageStorage.startQuestion}>
                            Начать тест
                        </Button>
                    </div>
                </Stack>
            </div>
        )
    }
    if (!QuestionPageStorage.dataHasBeenDelivered) {
        return (
            <Stack alignItems={"center"}>
                <CircularProgress/>
            </Stack>
        )
    }
    return (
        <Stack direction={"column"} sx={{pl: {md: 4}}}>
            <Button
                fullWidth
                sx={{maxWidth: 300, mb: 1}}
                variant="outlined" color="primary"
                onClick={() => {
                    QuestionPageStorage.closeQuestion()
                }}>
                Назад
            </Button>
            <QuestionByID id={QuestionPageStorage.selectedQuestionID}
                          helpLevel={QuestionPageStorage.helpLevel}/>
        </Stack>)

})
