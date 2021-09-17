import {observer} from "mobx-react";
import React from "react";
import {QuestionStatisticPageStoreObject} from "../../Store/PrivateStorage/EditorsPage/QuestionStatisticStore/QuestionStatisticPageStore";
import {Button} from "@material-ui/core";
import {Row, Spinner} from "react-bootstrap";
import {StatisticByQuestionData} from "../Elements/Statistic/StatisticByQuestionData";
import {MainPageQuestionsForSelect} from "../Elements/Statistic/#MainPageQuestionsForSelect";

const processedStore = QuestionStatisticPageStoreObject

export const MainStatistic = observer(() =>{
    if(!processedStore.questionDataHasBeenLoaded){
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    if(processedStore.isOpenQuestion){
        return (
            <div className="pl-3">
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
                <MainPageQuestionsForSelect {...{processedStore}}/>
            </Row>
        </div>
    )
})