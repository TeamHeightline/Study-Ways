import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Card, CardActionArea, Grid, Paper, Stack, Tooltip, Typography} from "@mui/material";
import {IQuestionPreviewData} from "../../../../../../ServerLayer/Types/question.type";


interface IUIQuestionMiniViewByDataProps extends PaperProps{
    questionData: IQuestionPreviewData
}

const UIQuestionMiniViewByData = observer(({questionData, ...props}: IUIQuestionMiniViewByDataProps) =>{
    return(
        <Grid item xs={12} md={3} sx={{minHeight: 180}} {...props}>
            <Card variant={"outlined"} sx={{height: "100%"}}>
                <CardActionArea sx={{height: "100%"}}>
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
        </Grid>
    )
})

export default UIQuestionMiniViewByData
