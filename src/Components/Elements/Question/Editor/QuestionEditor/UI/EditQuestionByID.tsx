import {observer} from "mobx-react";
import {Button, Grid, Stack, Typography} from "@mui/material";
import {QuestionEditorStorage} from "../Store/QuestionEditorStorage";
import {QuestionText} from "./QuestionText";
import {QuestionNumberOfShowingAnswers} from "./QuestionNumberOfShowingAnswers";
import {ImageForQuestion} from "./ImageForQuestion";
import {QuestionSrc} from "./QuestionSrc";
import {SavingNotification} from "./SavingNotification";
import {QuestionPreview} from "./QuestionPreview";
import {AnswersEditor} from "../../AnswersEditor/EditAnswerByID/UI/AnswersEditor";
import {CreateNewAnswer} from "./CreateNewAnswer";
import React, {useEffect} from "react";
import {isMobileHook} from "../../../../../../CustomHooks/isMobileHook";
import AdditionalActions from "./AdditionalActions";
import ConnectedThemeSelector from "./ConnectedThemeSelector";
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
                                        <QuestionNumberOfShowingAnswers/>
                                        <AdditionalActions/>
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
                    <QuestionPreview/>
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