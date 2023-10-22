// @ts-nocheck
import React, {useEffect, useState} from 'react';
import {observer} from "mobx-react";
import {QuestionPlayerStore} from "../Store/QuestionPlayerStore";
import UiQuestionData from "./ui-question-data";
import {Box, CircularProgress, Stack} from '@mui/material';

import {useLocation, useParams} from "react-router-dom";
import {RequireLogInAlert} from "../../../../SharedComponents/Notifications/RequireLogInAlert";
import {UserStorage} from "../../../../Store/UserStore/UserStore";

import UiCreateAnswerErrorReport from "./ui-create-answer-error-report";
import UISelectHardLevel from "./ui-select-hard-level";
import UIAnswers from "./ui-answers";
import UIStatistic from "./ui-statistic";
import UIHelpText from "./ui-help-text";
import UIAnswerReportSuccessSavedMessage from "./ui-answer-report-success-saved-message";


export const QuestionByID = observer((props: any) => {
    const slug = useLocation();

    const {id} = useParams()

    const [questionStore, setQuestionStore] = useState(new QuestionPlayerStore(null, undefined))

    useEffect(() => {
        if (slug?.search === "?exam=true") {
            questionStore?.changeIsUseExamMode(true)
        }

        questionStore?.changeQuestionId(id ? id : props?.id)
    }, [props, id])

    useEffect(() => {
        questionStore?.loadQuestionDataFromServer()
    }, [props?.id])

    useEffect(() => {
        if (questionStore?.questionHasBeenCompleted) {
            if (props?.questionHasBeenCompleted) {
                props?.questionHasBeenCompleted(true)
            }
        }
    }, [questionStore?.questionHasBeenCompleted, props?.id])

    const restartQuestion = () => {
        const questionID = id ? id : props?.id
        setQuestionStore(new QuestionPlayerStore(null, questionID))
    }

    if (!UserStorage.isLogin) {
        return <RequireLogInAlert requireShow/>
    }

    if (!questionStore?.answersArray?.length) {
        return (
            <Stack alignItems={"center"}>
                <CircularProgress/>
            </Stack>
        )
    }

    if (!questionStore?.questionHasBeenStarted) {
        return (
            <UISelectHardLevel questionStore={questionStore}/>
        )
    }

    if (questionStore?.questionHasBeenCompleted || questionStore?.isAcceptDefeat) {
        return (
            <UIStatistic questionStore={questionStore} restartQuestion={restartQuestion}/>
        )
    }

    return (
        <Box>
            <UiQuestionData
                ignoreAspectRatio={true}
                onChange1={(e) => {
                    questionStore?.changeHardLevelOfHelpText(e.target.value)
                }}
                onClick1={() => questionStore?.checkErrors()}
                height={window.innerHeight}
                width={window.innerWidth - 100}
                urlHasBeenPassed={true}
                questionText={questionStore?.questionText}
                questionImgUrl={questionStore?.questionImageUrl}
                onAcceptDefeat={() => questionStore.onAcceptDefeat()}
            />
            <UIHelpText questionStore={questionStore}/>
            <UiCreateAnswerErrorReport questionStore={questionStore}/>
            <UIAnswerReportSuccessSavedMessage questionStore={questionStore}/>
            <UIAnswers questionStore={questionStore}/>
        </Box>
    );
})
