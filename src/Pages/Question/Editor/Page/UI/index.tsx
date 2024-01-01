import React, {useEffect} from 'react'
import {Badge, Card, CardActionArea, Grid, Stack, Typography} from "@mui/material";
import {observer} from "mobx-react";
import {UiCreateNewQuestion} from "./ui-create-new-question";
import Paper from "@mui/material/Paper";
import {RootState, useAppDispatch} from "../../../../../ReduxStore/RootStore";
import {loadAuthorsThunk, loadQuestionsThunk} from "../redux-store/AsyncActions";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import HideNotFilledQuestions from "./ui-hide-not-filled-questions";
import UIOrderingByCreatedAt from "./ui-ordering-by-created-at";
import UICreateNewQuestionDialog from "./ui-create-new-question-dialog";
import AuthorSelector from "./author-selector";
import {UserStorage} from "../../../../../Store/UserStore/UserStore";

export const Index = observer(() => {
    const dispatch = useAppDispatch()
    const ordering_by_created_at = useSelector((state: RootState) => state?.questionEditorPage?.ordering_by_created_at)
    const show_only_filled_questions = useSelector((state: RootState) => state?.questionEditorPage?.show_only_filled_questions)
    const questions = useSelector((state: RootState) => state?.questionEditorPage?.questions)
    const author_filter = useSelector((state: RootState) => state?.questionEditorPage?.author_filter)

    const navigate = useNavigate()


    useEffect(() => {
        dispatch(loadQuestionsThunk({ordering_by_created_at, show_only_filled_questions}))
        dispatch(loadAuthorsThunk())
    }, [])

    useEffect(() => {
        dispatch(loadQuestionsThunk({ordering_by_created_at, show_only_filled_questions}))
    }, [show_only_filled_questions, ordering_by_created_at])

    const filtered_questions = author_filter === "all" ? questions :
        author_filter === "my" ? questions?.filter((question) => question?.created_by_id === UserStorage.user_data?.id) :
            questions?.filter((question) => String(question?.created_by_id) === author_filter)

    return (
        <Paper elevation={0}>
            <UICreateNewQuestionDialog/>
            <Grid container justifyContent={"center"} sx={{mt: 2}}>
                <Grid item xs={12} md={10}>

                    <Stack direction={"column"} alignItems={"center"}>
                        <UiCreateNewQuestion/>
                    </Stack>
                    {/*<QuestionFolders/>*/}
                    <Stack sx={{mt: 1}} direction={"row"} justifyContent={"space-between"}>
                        <AuthorSelector/>
                        <Stack alignItems={"start"}>
                            <UIOrderingByCreatedAt/>
                            <HideNotFilledQuestions/>
                        </Stack>
                    </Stack>
                    <Grid container spacing={4} justifyContent="space-between" sx={{mt: 1}}>
                        {filtered_questions?.map((question) =>
                            <Grid item key={question.id} sx={{maxWidth: 350, width: "100%",}}>
                                <Badge color="secondary" badgeContent={question.sumOfAnswersReports}
                                       sx={{width: "100%"}}
                                >
                                    <Card
                                        style={{height: 160, textAlign: "center", width: "100%"}}
                                        variant="outlined">
                                        <CardActionArea style={{height: "100%"}}
                                                        onClick={() => navigate("selected/" + question.id)}>
                                            <Typography>
                                                {"ID: " + question.id}
                                            </Typography>
                                            <Typography>
                                                {question?.text}
                                            </Typography>
                                        </CardActionArea>
                                    </Card>
                                </Badge>
                            </Grid>
                        )}
                    </Grid>

                </Grid>
            </Grid>
        </Paper>
    )
})
