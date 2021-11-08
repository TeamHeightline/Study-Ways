import {observer} from "mobx-react";
import React from "react";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import {StatisticPageStoreObject} from "../../../Store/PrivateStorage/EditorsPage/StatisticStore/StatisticPageStore";

export const MainPageTopMenu = observer(() =>{
    return(
        <Tabs
            scrollButtons="auto"
            value={StatisticPageStoreObject.activePageOnTopMenu}
            onChange={(e, newValue) => {
                StatisticPageStoreObject.changeActivePageOnTopMenu(newValue)
                StatisticPageStoreObject.changeIsOpenQuestion(newValue === 2)
            }}
            indicatorColor="primary"
            textColor="primary"
            centered
        >
            <Tab label="Вопросы" />
            <Tab label="Серии вопросов"/>
            <Tab label="Все попытки"/>
        </Tabs>
    )
})