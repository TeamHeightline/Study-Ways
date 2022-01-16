import {observer} from "mobx-react";
import React from 'react';
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import {isMobileHook} from "../../../../../../CustomHooks/isMobileHook";
import {useHistory, useRouteMatch} from "react-router-dom";

interface IFinderTabsProps extends React.HTMLAttributes<HTMLDivElement>{
}
export const FinderTabs = observer(({...props}: IFinderTabsProps) =>{
    const isMobile = isMobileHook()
    const history = useHistory();
    const { path } = useRouteMatch();
    return(
        <div {...props}>
            <Tabs
                indicatorColor="primary"
                textColor="primary"
                centered
                variant={!isMobile ? "standard" : "scrollable"}
                scrollButtons={isMobile}
            >
                <Tab label="Серии вопросов" onClick={()=> history.push(path + "/qs")}/>
                <Tab label="Все попытки" onClick={()=> history.push(path + "/all")}/>
            </Tabs>

        </div>
    )
})