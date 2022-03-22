import React, {useEffect} from 'react';
import {
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
import {QuestionByID} from "../Elements/Question/QuestionByID/QuestionByID";
import {observer} from "mobx-react";
import {QuestionPageStorage} from "../../Store/PublicStorage/QuestionPage/QuestionPageStore";
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
                    <Paper
                        sx={{p: 2, pr: 3, pl: 3}}
                        variant="outlined"
                        style={{maxWidth: "500px"}}>
                        <Stack direction={"column"} alignItems={"center"}>
                            <Typography variant={"h4"}>
                                Выберите вопрос и уровень сложности
                            </Typography>
                        </Stack>
                        <FormControlLabel
                            sx={{pt: 2}}
                            control={
                                <Switch
                                    checked={QuestionPageStorage.useSearchByThemeOrAuthor}
                                    onChange={QuestionPageStorage.changeUseSearchByThemeOrAuthor}
                                    name="checkedB"
                                    color="primary"/>}
                            label="Искать по темам или авторам"/>
                        <Collapse in={QuestionPageStorage.useSearchByThemeOrAuthor} sx={{pb: 1}}>
                            <FormControl variant="outlined" fullWidth size="small">
                                <InputLabel>Автор</InputLabel>
                                <Select
                                    value={QuestionPageStorage.selectedAuthorID}
                                    onChange={QuestionPageStorage.changeSelectedAuthorID}
                                    label="Автор"
                                >
                                    {toJS(QuestionPageStorage.authorsForSelect).map((author) => {
                                        return (<MenuItem key={author.id + "AuthorSelect"}
                                                          value={author.id}>{author.name}</MenuItem>)
                                    })}
                                </Select>
                            </FormControl>
                            <FormControl variant="outlined" fullWidth size="small" sx={{mt: 1}}>
                                <InputLabel>Тема</InputLabel>
                                <Select
                                    value={QuestionPageStorage.selectedThemeID}
                                    onChange={QuestionPageStorage.changeSelectedTheme}
                                    label="Тема">
                                    {toJS(QuestionPageStorage.themesForSelect).map((theme) => {
                                        return (<MenuItem key={theme.id + "ThemesSelect"}
                                                          value={theme.id}>{theme.name}</MenuItem>)
                                    })}
                                </Select>
                            </FormControl>
                        </Collapse>
                        <FormControl variant="outlined" fullWidth sx={{mt: 1}}>
                            <InputLabel>Вопрос</InputLabel>
                            <Select
                                value={QuestionPageStorage.selectedQuestionID}
                                onChange={QuestionPageStorage.changeSelectedQuestionID}
                                label="Вопрос">
                                {toJS(QuestionPageStorage.QuestionsAfterSelectTheme).map((question) => {
                                    return (<MenuItem key={question?.id + "questionSelect"}
                                                      value={question?.id}>
                                        {"ID: " + question?.id + " " + question?.text}
                                    </MenuItem>)
                                })}
                            </Select>
                        </FormControl>
                        <Button fullWidth variant="contained" color="primary" sx={{mt: 2}}
                                onClick={QuestionPageStorage.startQuestion}>
                            Начать тест
                        </Button>
                    </Paper>
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
        <Stack direction={"column"}>
            <Button
                fullWidth
                sx={{maxWidth: 300}}
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