import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Card, CardActionArea, Grid, Paper, Stack, Tooltip, Typography} from "@mui/material";
import {IQuestionPreviewData} from "../../../../../Shared/ServerLayer/Types/question.type";


interface IUIQuestionMiniViewByDataProps extends PaperProps {
    questionData: IQuestionPreviewData,
    onClickOnCard: any,
    actionButton: any
}

const UIQuestionMiniViewByData = observer(({
                                               questionData,
                                               actionButton,
                                               onClickOnCard,
                                               ...props
                                           }: IUIQuestionMiniViewByDataProps) => {
    return (
        <Grid item xs={12} md={3} sx={{minHeight: 180}} {...props}>
            <Paper elevation={0} sx={{height: "100%"}}>
                <Card variant={"outlined"} sx={{height: "100%"}}>
                    <CardActionArea sx={{height: "100%"}} onClick={onClickOnCard}>
                        <Stack alignItems={"center"}>
                            <Stack direction={"column"} sx={{p: 2}} spacing={1}>
                                <Typography variant={"h6"} align={"center"}>
                                    № {questionData?.id} {questionData?.questionAuthor?.fullName}
                                </Typography>
                                <Tooltip title={questionData?.text || ""}>
                                    <Typography variant={"body1"} align={"center"}>
                                        {questionData?.text.slice(0, 150)}
                                    </Typography>
                                </Tooltip>
                                <Typography variant={"body2"} align={"center"}>
                                    {questionData?.themeString}
                                </Typography>
                            </Stack>
                        </Stack>
                    </CardActionArea>
                </Card>
                {actionButton}
            </Paper>
        </Grid>
    )
})

export default UIQuestionMiniViewByData
