import {observer} from "mobx-react";
import React, {useEffect} from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Paper, Stack} from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import AnswerDeleteDialog from "./answer-delete-dialog";
import AnswerTitle from "./answer-title";
import AnswerPreviewSwitch from "./answer-preview-switch";
import IsEditAnswer from "./is-edit-answer";
import AnswerContent from "./answer-content";
import AnswerPreview from "./answer-preview";
import {EditAnswerByIdStore} from "../Store/edit-answer-by-id-store";
import {isMobileHook} from "../../../../../../Shared/CustomHooks/isMobileHook";
import UIAnswerErrorsButton from "./answer-errors-button";
import AnswerErrorDialog from "./answe-error-dialog";
import AnswerErrorClosedMessage from "./answer-error-closed-message";


interface IEditAnswerUIProps extends PaperProps {
    answerStore: EditAnswerByIdStore
    answer_index?: number
}

const EditAnswerUI = observer(({answerStore, answer_index, ...props}: IEditAnswerUIProps) => {

    useEffect(() => {
        answerStore.loadAnswerErrorMessage()

    }, [answerStore.answer_id,])
    const isMobile = isMobileHook()

    if (!answerStore.isAnswerDataLoaded) {
        return (
            <Paper variant="outlined">
                <Skeleton variant={"rectangular"} sx={{minHeight: 150}}/>
            </Paper>
        )
    }
    if (answerStore.answer_object?.isDeleted) {
        return <div/>
    }
    return (
        <Paper elevation={0} {...props} sx={{pt: 2}}>
            <Paper variant="outlined" sx={{pt: 2, pb: 2, pr: 2, pl: 2}}>
                <AnswerDeleteDialog answer_object={answerStore}/>
                <AnswerErrorClosedMessage answer_object={answerStore}/>
                <Paper elevation={0} sx={{pl: 2}}>
                    <AnswerTitle answer_object={answerStore} answer_index={answer_index}/>
                    <Stack direction={["column", "row"]} justifyContent={"space-between"}>
                        <Stack
                            direction={isMobile ? "column" : "row"}
                            alignItems={"start"}>
                            <AnswerPreviewSwitch answer_object={answerStore}/>
                            <IsEditAnswer answer_object={answerStore}/>
                        </Stack>
                        <UIAnswerErrorsButton answer_object={answerStore}/>
                    </Stack>
                    <AnswerContent answer_object={answerStore}/>
                    <AnswerPreview answer_object={answerStore}/>
                    <AnswerErrorDialog answer_object={answerStore}/>
                </Paper>
            </Paper>
        </Paper>
    )
})

export default EditAnswerUI
