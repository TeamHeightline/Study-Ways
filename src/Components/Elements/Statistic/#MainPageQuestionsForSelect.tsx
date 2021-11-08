import {observer} from "mobx-react";
import React from "react";
import {Card, CardActionArea, Typography} from "@mui/material";
import {StatisticPageStoreObject} from "../../../Store/PrivateStorage/EditorsPage/StatisticStore/StatisticPageStore";

export const MainPageQuestionsForSelect = observer(() =>{
    return(
        <React.Fragment>
            {StatisticPageStoreObject?.QuestionArrayForDisplay
                ?.map((question: any) =>{
                    return(
                        <Card className="mt-2" key={question.id} style={{width: 380, height: 160, textAlign: "center"}}
                              variant="outlined">
                            <CardActionArea style={{height: "100%"}}
                                            onClick={() => {
                                                StatisticPageStoreObject.changeSelectedQuestionID(question?.id)
                                                StatisticPageStoreObject.changeIsOpenQuestion(true)
                                            }}>
                                <Typography>
                                    {"ID: " + question.id}
                                </Typography>
                                <Typography>
                                    {question?.text}
                                </Typography>
                            </CardActionArea>
                        </Card>
                    )
                })}
        </React.Fragment>
    )
})