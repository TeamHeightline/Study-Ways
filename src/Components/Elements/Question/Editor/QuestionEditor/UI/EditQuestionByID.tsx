import {observer} from "mobx-react";
import {Button, Grid, Stack, Typography} from "@mui/material";
import {QuestionEditorStorage} from "../Store/QuestionEditorStorage";
import {QuestionText} from "./ui-text";
import {UiNumberOfShowingAnswers} from "./ui-number-of-showing-answers";
import {ImageForQuestion} from "./ui-image-for-question";
import {QuestionSrc} from "./ui-question-src";
import {SavingNotification} from "./ui-saving-notification";
import {UiQuestionPreview} from "./ui-question-preview";
import {AnswersEditor} from "../../AnswersEditor/EditAnswerByID/UI/AnswersEditor";
import {CreateNewAnswer} from "./ui-create-new-answer";
import React, {useEffect} from "react";
import {isMobileHook} from "../../../../../../CustomHooks/isMobileHook";
import UiAdditionalActions from "./ui-additional-actions";
import ConnectedThemeSelector from "./ui-connected-theme-selector";
import {useNavigate} from "react-router-dom";

interface IEditQuestionByIDProps {
    questionID?: string
}

export const EditQuestionByID = observer(({questionID}: IEditQuestionByIDProps) => {
    const isMobile = isMobileHook()
    const navigate = useNavigate()

    useEffect(() => {
        QuestionEditorStorage.loadQuestionAuthorsAndThemes()
    }, [])

    useEffect(() => {
        if (questionID) {
            QuestionEditorStorage.selectQuestionClickHandler(Number(questionID))
        }
    }, [questionID])

    return (
        <div style={{paddingLeft: isMobile ? 0 : 40, paddingRight: 10}}>
            <Button
                sx={{maxWidth: 300, mt: 1}}
                fullWidth
                variant="outlined" color="primary"
                disabled={QuestionEditorStorage.unsavedFlag}
                onClick={() => {
                    navigate(-1)
                }}>
                Назад
            </Button>

            <Grid container justifyContent={"center"}>
                <Grid item xs={isMobile ? 12 : 11}>
                    <Stack alignItems={"center"} sx={{pb: 2}}>
                        <Typography variant={"h2"}>Редактор вопроса</Typography>
                    </Stack>
                    {QuestionEditorStorage?.questionHasBeenSelected &&
                        <Grid container columnSpacing={8} rowSpacing={2}>
                            <Grid item xs={12} md={6}>
                                <QuestionText/>
                            </Grid>
                            {QuestionEditorStorage?.AuthorsAndThemesHasBeenLoaded &&
                                <Grid alignItems={"start"} item xs={12} md={6} container rowSpacing={2}>
                                    <Stack direction={isMobile ? "column" : "row"}
                                           justifyContent={isMobile ? undefined : "start"}
                                           alignItems={"center"}
                                           spacing={isMobile ? 0 : 2}
                                           sx={{width: "100%"}}>
                                        <UiNumberOfShowingAnswers/>
                                        <UiAdditionalActions/>
                                    </Stack>

                                    <Grid item xs={12} md={6} sx={{p: 0}}>
                                        <ConnectedThemeSelector/>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <div/>
                                        {/*<AuthorSelector/>*/}
                                    </Grid>
                                </Grid>}
                        </Grid>
                    }
                    <Stack
                        direction={{xs: 'column', sm: 'row'}}
                        justifyContent={"space-between"}
                        className="mt-2"
                        spacing={isMobile ? 0 : 2}>
                        <ImageForQuestion/>
                        <QuestionSrc/>
                        <SavingNotification/>
                    </Stack>
                    <UiQuestionPreview/>
                </Grid>
            </Grid>

            <AnswersEditor/>
            <Grid container justifyContent={"center"}>
                <Grid item xs={isMobile ? 12 : 9}>
                    <CreateNewAnswer/>
                </Grid>
            </Grid>
            <br/>
            <br/>
        </div>
    )
})
