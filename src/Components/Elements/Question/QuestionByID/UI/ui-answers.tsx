import {
    Box,
    Card,
    CardActionArea,
    Divider,
    IconButton,
    LinearProgress,
    Stack,
    Tooltip,
    Typography
} from "@mui/material";
import {BoxProps} from "@mui/material/Box/Box";
import {observer} from "mobx-react";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import RemoveIcon from "@mui/icons-material/Remove";
import ReportIcon from "@mui/icons-material/Report";
import React from "react";
import {QuestionPlayerStore} from "../Store/QuestionPlayerStore";
import {isMobileHook} from "../../../../../CustomHooks/isMobileHook";

interface IUIAnswersProps extends BoxProps {
    questionStore: QuestionPlayerStore
}


const UIAnswers = observer(({questionStore, ...props}: IUIAnswersProps) => {
    const isMobile = isMobileHook();
    return (
        <Box {...props}>
            <div style={{overflowX: "scroll"}}>
                {/*<Row style={{width:  questionStore?.answersArray.length * 410}}>*/}
                <Stack
                    style={{width: isMobile ? "" : questionStore?.answersArray.length * 410}}>
                    {questionStore?.answersArray &&
                        <Stack direction={isMobile ? "column" : "row"} spacing={2}
                               sx={{height: isMobile ? questionStore?.answersArray * 410 : "", pt: 2}}>
                            {questionStore?.answersArray.map((answer, aIndex) => {
                                return (
                                    <Box sx={{mb: 2}}>
                                        <Card key={aIndex} variant="outlined"
                                              sx={{
                                                  backgroundColor: questionStore?.selectedAnswers?.has(answer?.id) ? "#2296F3" : "",
                                                  display: 'flex',
                                                  width: 385,
                                                  height: 400,
                                              }}
                                              onClick={() => {
                                                  questionStore.selectAnswerHandleChange(answer.id)
                                              }}>
                                            <CardActionArea>
                                                {!answer.isImageDeleted && answer.answerImageUrl ?
                                                    <CardMedia
                                                        style={{opacity: questionStore?.selectedAnswers?.has(answer?.id) ? 0.5 : 1}}
                                                        sx={{height: answer?.answerText ? 240 : 400}}
                                                        image={answer?.answerImageUrl}
                                                    /> : null}
                                                {answer?.answerText &&
                                                    <CardContent sx={{mb: 2}}>
                                                        <Typography variant="body1" color="textSecondary"
                                                                    component="p" sx={{pb: 2}}>
                                                            {answer?.answerText}
                                                        </Typography>
                                                    </CardContent>}
                                            </CardActionArea>
                                        </Card>

                                        <LinearProgress
                                            color={
                                                questionStore?.selectedAnswers?.has(answer?.id) ? "primary" :
                                                    questionStore.userMarks[aIndex] === "false" ? "secondary" :
                                                        questionStore.userMarks[aIndex] === "unknown" ? "warning" : "inherit"
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
                                                        onClick={() => questionStore.onUnknownButtonClick(aIndex)}>
                                                        <QuestionMarkIcon fontSize={"small"}/>
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title={"Пометить для себя как неверный ответ"}>
                                                    <IconButton
                                                        onClick={() => questionStore.onQuestionButtonClick(aIndex)}>
                                                        <RemoveIcon fontSize={"small"}/>
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                            <Divider orientation="vertical" flexItem/>
                                            <Tooltip title={"Сообщить об ошибке в ответе"}>
                                                <IconButton sx={{}}>
                                                    <ReportIcon fontSize={"small"}/>
                                                </IconButton>
                                            </Tooltip>


                                        </Stack>

                                    </Box>)
                            })}

                        </Stack>}
                </Stack>
            </div>
        </Box>
    )
})

export default UIAnswers;