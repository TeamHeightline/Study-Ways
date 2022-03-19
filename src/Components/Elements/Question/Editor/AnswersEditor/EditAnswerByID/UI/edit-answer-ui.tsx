import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Paper, Stack} from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import AnswerDeleteDialog from "./answer-delete-dialog";
import AnswerTitle from "./answer-title";
import AnswerPreviewSwitch from "./answer-preview-switch";
import IsEditAnswer from "./is-edit-answer";
import AnswerContent from "./answer-content";
import AnswerPreview from "./answer-preview";
import {answer_object_type} from "../Store/edit-answer-by-id-store";
import {isMobileHook} from "../../../../../../../CustomHooks/isMobileHook";


interface IEditAnswerUIProps extends PaperProps {
    answerStore: answer_object_type
    answer_index?: number
}

const EditAnswerUI = observer(({answerStore, answer_index, ...props}: IEditAnswerUIProps) => {
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
                <Paper elevation={0} sx={{pl: 2}}>
                    <AnswerTitle answer_object={answerStore} answer_index={answer_index}/>
                    <Stack
                        direction={isMobile ? "column" : "row"}
                        alignItems={"start"}>
                        <AnswerPreviewSwitch answer_object={answerStore}/>
                        <IsEditAnswer answer_object={answerStore}/>
                    </Stack>
                    <AnswerContent answer_object={answerStore}/>
                    <AnswerPreview answer_object={answerStore}/>
                </Paper>
            </Paper>
        </Paper>
    )
})

export default EditAnswerUI