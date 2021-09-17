import {observer} from "mobx-react";
import React from "react";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import {StatisticPageStoreObject} from "../../../Store/PrivateStorage/EditorsPage/StatisticStore/StatisticPageStore";

export const MainPageTopMenu = observer(() =>{
    return(
        <Tabs
            scrollButtons="auto"
            value={StatisticPageStoreObject.activePageOnTopMenu}
            onChange={(e, newValue) => StatisticPageStoreObject.changeActivePageOnTopMenu(newValue)}
            indicatorColor="primary"
            textColor="primary"
            centered
        >
            <Tab label="Вопросы" />
            <Tab label="Серии вопросов"/>
        </Tabs>
    )
})