import {Box, Divider, IconButton, LinearProgress, Stack, Tooltip, Typography} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";
import {observer} from "mobx-react";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import RemoveIcon from "@mui/icons-material/Remove";
import ReportIcon from "@mui/icons-material/Report";
import React from "react";
import {QuestionPlayerStore} from "../Store/QuestionPlayerStore";

interface IUIUserMarkAndActionButtonsProps extends BoxProps {
    questionStore: QuestionPlayerStore,
    answerID: number,
    answerIndex: number
}


const UIUserMarkAndActionButtons = observer(({
                                                 questionStore,
                                                 answerIndex,
                                                 answerID,
                                                 ...props
                                             }: IUIUserMarkAndActionButtonsProps) => {
    return (
        <Box {...props}>


            <LinearProgress
                color={
                    questionStore?.selectedAnswers?.has(answerID) ? "primary" :
                        questionStore.userMarks[answerIndex] === "false" ? "secondary" :
                            questionStore.userMarks[answerIndex] === "unknown" ? "warning" : "inherit"
                }
                variant="determinate"
                value={100}
                sx={{mt: 1}}/>
            <Typography variant="caption" color="textSecondary">
                Пометки для себя (не учитываются при проверке)
            </Typography>
            <Stack direction={"row"} spacing={1}>
                <Stack direction={"row"}>
                    <Tooltip
                        title={"Пометить для себя как ответ в котором не уверен"}>
                        <IconButton
                            onClick={() => questionStore.onUnknownButtonClick(answerIndex)}>
                            <QuestionMarkIcon fontSize={"small"}/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={"Пометить для себя как неверный ответ"}>
                        <IconButton
                            onClick={() => questionStore.onQuestionButtonClick(answerIndex)}>
                            <RemoveIcon fontSize={"small"}/>
                        </IconButton>
                    </Tooltip>
                </Stack>
                <Divider orientation="vertical" flexItem/>
                <Tooltip title={"Сообщить об ошибке в ответе"}>
                    <IconButton
                        onClick={() => questionStore.onReportAnswerButtonClick(answerIndex)}>
                        <ReportIcon fontSize={"small"}/>
                    </IconButton>
                </Tooltip>
            </Stack>
        </Box>
    )
})

export default UIUserMarkAndActionButtons;