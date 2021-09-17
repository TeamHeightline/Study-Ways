import {observer} from "mobx-react";
import React from "react";
import {Card, CardActionArea, Typography} from "@material-ui/core";

export const MainPageQuestionsForSelect = observer(({processedStore}) =>{
    return(
        <React.Fragment>
            {processedStore?.QuestionArrayForDisplay
                ?.map((question: any) =>{
                    return(
                        <Card className="mt-2" key={question.id} style={{width: 400, height: 160, textAlign: "center"}}
                              variant="outlined">
                            <CardActionArea style={{height: "100%"}}
                                            onClick={() => {
                                                processedStore.changeSelectedQuestionID(question?.id)
                                                processedStore.changeIsOpenQuestion(true)
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