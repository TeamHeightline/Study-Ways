// @ts-nocheck
import React, {useEffect, useState} from 'react';
import {observer} from "mobx-react";
import {QuestionPlayerStore} from "../Store/QuestionPlayerStore";
import UiQuestionData from "./ui-question-data";
import {Alert, CircularProgress, Stack} from '@mui/material';

import {useLocation} from "react-router-dom";
import {RequireLogInAlert} from "../../../../PublicPages/Notifications/RequireLogInAlert";
import {UserStorage} from "../../../../../Store/UserStore/UserStore";

import UiCreateAnswerErrorReport from "./ui-create-answer-error-report";
import UISelectHardLevel from "./ui-select-hard-level";
import UIAnswers from "./ui-answers";
import UIStatistic from "./ui-statistic";


export const QuestionByID = observer((props: any) => {
    const slug = useLocation();

    const [questionStore, setQuestionStore] = useState(new QuestionPlayerStore(null, undefined))

    useEffect(() => {
        if (slug?.search === "?exam=true") {
            questionStore?.changeIsUseExamMode(true)
        }

        questionStore?.changeQuestionId(props?.match?.params?.id ? props?.match?.params?.id : props?.id)
    }, [props])

    useEffect(() => {
        if (questionStore?.questionHasBeenCompleted) {
            if (props?.questionHasBeenCompleted) {
                props?.questionHasBeenCompleted(true)
            }
        }
    }, [questionStore?.questionHasBeenCompleted, props?.id])

    const restartQuestion = () => {
        const questionID = props?.match?.params?.id ? props?.match?.params?.id : props?.id
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
        <Stack justifyContent={"center"} direction={"column"}>
            <div>
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

                {questionStore?.oneTimeCheckError &&
                    questionStore?.IndexOfMostWantedError !== -1 &&
                    <div>
                        <Alert severity="error" variant="filled" sx={{mt: 1}}>
                            {questionStore?.HelpTextForShow}
                        </Alert>
                    </div>
                }
                <UiCreateAnswerErrorReport questionStore={questionStore}/>
                <UIAnswers questionStore={questionStore}/>
            </div>
        </Stack>
    );
})
