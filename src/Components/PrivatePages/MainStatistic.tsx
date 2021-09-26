import {observer} from "mobx-react";
import React from "react";
import {Row, Spinner} from "react-bootstrap";
import {StatisticByQuestionsData} from "../Elements/Statistic/StatisticByQuestionsData";
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
                <StatisticByQuestionsData/>
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