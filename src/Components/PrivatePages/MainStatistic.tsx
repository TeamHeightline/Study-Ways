import {observer} from "mobx-react";
import React from "react";
import {QuestionStatisticPageStoreObject} from "../../Store/PrivateStorage/EditorsPage/QuestionStatisticStore/QuestionStatisticPageStore";
import {Button, Card, CardActionArea, Typography} from "@material-ui/core";
import {Row, Spinner} from "react-bootstrap";
import {StatisticByQuestionData} from "../Elements/Statistic/StatisticByQuestionData";

const processedStore = QuestionStatisticPageStoreObject

export const MainStatistic = observer(() =>{
    if(!processedStore.questionDataHasBeenLoaded){
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    if(processedStore.isOpenQuestion){
        return (
            <div className="pl-5">
                <Button
                    className="ml-md-5 mt-4  col-12 col-lg-2 mr-2"
                    variant="outlined" color="primary"
                    onClick={() => {processedStore.changeIsOpenQuestion(false)}}>
                    Назад
                </Button>
                <StatisticByQuestionData/>
            </div>
        )
    }

    return(
        <div>
            <Row className="justify-content-around">
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
            </Row>
        </div>
    )
})