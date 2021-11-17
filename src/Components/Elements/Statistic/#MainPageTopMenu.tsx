import {observer} from "mobx-react";
import React from "react";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import {StatisticPageStoreObject} from "../../../Store/PrivateStorage/EditorsPage/StatisticStore/StatisticPageStore";
import {isMobileHook} from "../../../CustomHooks/isMobileHook";

export const MainPageTopMenu = observer(() =>{
    const isMobile = isMobileHook()
    return(
        <Tabs
            value={StatisticPageStoreObject.activePageOnTopMenu}
            onChange={(e, newValue) => {
                StatisticPageStoreObject.changeActivePageOnTopMenu(newValue)
                StatisticPageStoreObject.changeIsOpenQuestion(newValue === 2)
            }}
            indicatorColor="primary"
            textColor="primary"
            centered
            variant={!isMobile ? "standard" : "scrollable"}
            scrollButtons={isMobile}
        >
            <Tab label="Вопросы" />
            <Tab label="Серии вопросов"/>
            <Tab label="Все попытки"/>
        </Tabs>
    )
})