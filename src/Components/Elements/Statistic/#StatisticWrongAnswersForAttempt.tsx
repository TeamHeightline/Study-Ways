import {observer} from "mobx-react";
import React from "react";
import {Row} from "react-bootstrap";
import {toJS} from "mobx";
import {StatisticByQuestionDataStoreObject} from "../../../Store/PrivateStorage/EditorsPage/QuestionStatisticStore/StatisticByQuestionDataStore";
import {Card, CardActionArea, Typography} from "@material-ui/core";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";


export const StatisticWrongAnswersForAttempt = observer(({row, attempt, classes, aIndex}) =>{
    return(
        <div>
            <div style={{overflowX: "scroll"}}>
                <Row style={{width:  toJS(row[10][Number(attempt.numberOfPasses) -1])?.numberOfWrongAnswers.length * 410}}>
                    {toJS(row[10][Number(attempt.numberOfPasses) -1])?.numberOfWrongAnswers?.map((errorAnswer) =>{
                        const answerObjectStorage = StatisticByQuestionDataStoreObject?.answersArrayDataStore.find((answer) => Number(answer.id) == Number(errorAnswer))
                        return(
                            <div key={errorAnswer + "Error Answer Key" + attempt.numberOfPasses + "DetailStatisticKey"}>
                                <Card  key={aIndex} variant="outlined" elevation={2} className={classes.root}
                                       style={{borderColor: answerObjectStorage.isTrue? "#2296F3" : "#f50057",}}
                                >
                                    <CardActionArea>
                                        {answerObjectStorage?.answerImageUrl &&
                                        <CardMedia
                                            // style={{opacity: processedStore?.selectedAnswers?.has(answer?.id)? 0.5 : 1}}
                                            className={answerObjectStorage?.answerText? classes.media : classes.fullHeightMedia}
                                            image={answerObjectStorage?.answerImageUrl}
                                        />}
                                        {answerObjectStorage?.answerText &&
                                        <CardContent className="mb-5">
                                            <Typography variant="body1" color="textSecondary" component="p" className="mb-5 pb-5">
                                                {answerObjectStorage?.answerText}
                                            </Typography>
                                        </CardContent>}
                                    </CardActionArea>
                                </Card>
                            </div>
                        )
                    })}
                </Row>
            </div>
        </div>
    )
})