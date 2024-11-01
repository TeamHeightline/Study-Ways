import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {ClickAwayListener, Paper, Stack, Typography} from "@mui/material";
import {EditAnswerByIdStore} from "../Store/edit-answer-by-id-store";
import {isMobileHook} from "../../../../../../Shared/CustomHooks/isMobileHook";
import TitleOnlyInExam from "./title-only-in-exam";
import TitleIsRequired from "./title-is-required";
import TitleEditableText from "./title-editable-text";
import TitleIsTrue from "./title-is-true";
import TitleHardLevel from "./title-hard-level";
import AnswerImage from "./answer-image";
import TitleIsSaved from "./title-is-saved";
import TitleSimpleActions from "./title-simple-actions";
import AnswerStatistic from "./answer-statistic";


interface IAnswerTitleProps extends PaperProps {
    answer_object: EditAnswerByIdStore,
    answer_index?: number
}

const AnswerTitle = observer(({answer_object, answer_index, ...props}: IAnswerTitleProps) => {
    const isMobile = isMobileHook()
    const answerNumber = Number(answer_index) + 1

    return (
        <Paper elevation={0} {...props}>
            <ClickAwayListener onClickAway={answer_object.stopTextEditingInSimpleMode}>
                <div>
                    <Stack direction={"row"} justifyContent="space-between">
                        <Stack direction={"row"} spacing={2} alignItems={"center"}>
                            <Typography variant={isMobile ? "body1" : "h6"}
                                        color="inherit">
                                {"№ " + answerNumber}
                            </Typography>
                            <TitleIsSaved answer_object={answer_object}/>
                        </Stack>
                        <TitleSimpleActions answer_object={answer_object}/>
                        {/*<AnswerDeleteOrDisableAnswerMenu answer={answer}/>*/}
                    </Stack>
                    <TitleEditableText answer_object={answer_object}/>
                    <Stack direction={isMobile ? "column" : "row"} justifyContent={"space-between"}>
                        <Stack direction={isMobile ? "column" : "row"} spacing={1} sx={{pt: 1}}>
                            <TitleOnlyInExam answer_object={answer_object}/>
                            <TitleIsRequired answer_object={answer_object}/>
                            <TitleHardLevel answer_object={answer_object}/>
                            <TitleIsTrue answer_object={answer_object}/>
                            <AnswerStatistic answer_id={Number(answer_object.answer_id)}/>
                        </Stack>
                        <AnswerImage answer_object={answer_object}/>
                    </Stack>
                </div>
            </ClickAwayListener>
        </Paper>
    )
})

export default AnswerTitle
