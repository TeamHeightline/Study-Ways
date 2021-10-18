import {observer} from "mobx-react";
import React from "react";
import {Row, Spinner} from "react-bootstrap";
import {StatisticByQuestionsData} from "../Elements/Statistic/StatisticByQuestionsData";
import {MainPageQuestionsForSelect} from "../Elements/Statistic/#MainPageQuestionsForSelect";
import {MainPageTopMenu} from "../Elements/Statistic/#MainPageTopMenu";
import {StatisticPageStoreObject} from "../../Store/PrivateStorage/EditorsPage/StatisticStore/StatisticPageStore";
import {MainPageQSForSelect} from "../Elements/Statistic/#MainPageQSForSelect";


export const MainStatistic = observer(() =>{
    console.log(StatisticPageStoreObject.activePageOnTopMenu)
    console.log(StatisticPageStoreObject.isOpenQuestion)

    if(!StatisticPageStoreObject.questionDataHasBeenLoaded){
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    if(StatisticPageStoreObject.activePageOnTopMenu === 2 && StatisticPageStoreObject.isOpenQuestion){
        return(
            <div className="pl-3">
                <MainPageTopMenu/>
                <StatisticByQuestionsData/>
            </div>
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
            <Row className="justify-content-around pl-5 col-12">
                {StatisticPageStoreObject.activePageOnTopMenu === 0 &&
                <MainPageQuestionsForSelect/>}
                {StatisticPageStoreObject.activePageOnTopMenu === 1 &&
                <MainPageQSForSelect/>}
            </Row>
        </div>
    )
})