import {observer} from "mobx-react";
import React from "react";
import {Button} from "@material-ui/core";
import {Row, Spinner} from "react-bootstrap";
import {StatisticByQuestionData} from "../Elements/Statistic/StatisticByQuestionData";
import {MainPageQuestionsForSelect} from "../Elements/Statistic/#MainPageQuestionsForSelect";
import {MainPageTopMenu} from "../Elements/Statistic/#MainPageTopMenu";
import {StatisticPageStoreObject} from "../../Store/PrivateStorage/EditorsPage/StatisticStore/StatisticPageStore";
import {MainPageQSForSelect} from "../Elements/Statistic/#MainPageQSForSelect";


export const MainStatistic = observer(() =>{
    if(!StatisticPageStoreObject.questionDataHasBeenLoaded){
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    if(StatisticPageStoreObject.isOpenQuestion){
        return (
            <div className="pl-3">
                <Button
                    className="ml-md-5 mt-4  col-12 col-lg-2 mr-2"
                    variant="outlined" color="primary"
                    onClick={() => {StatisticPageStoreObject.changeIsOpenQuestion(false)}}>
                    Назад
                </Button>
                <StatisticByQuestionData/>
            </div>
        )
    }

    return(
        <div>
            <MainPageTopMenu/>
            <Row className="justify-content-around ml-4">
                {StatisticPageStoreObject.activePageOnTopMenu === 0 &&
                <MainPageQuestionsForSelect/>}
                {StatisticPageStoreObject.activePageOnTopMenu === 1 &&
                <MainPageQSForSelect/>}
            </Row>
        </div>
    )
})