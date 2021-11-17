import {observer} from "mobx-react";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import React from "react";
import {QuestionEditorStorage} from "../../../../../Store/PrivateStorage/EditorsPage/QuestionEditorPage/QuestionEditorStorage";
import {isMobileHook} from "../../../../../CustomHooks/isMobileHook";

export const QuestionFolders = observer(() =>{
    const isMobile = isMobileHook()
    return(
        <div>
            <Tabs


                value={QuestionEditorStorage.activeFolder}
                onChange={(e, newValue) => QuestionEditorStorage.changeActiveFolder(newValue)}
                indicatorColor="primary"
                textColor="primary"
                variant={!isMobile ? "standard" : "scrollable"}
                centered
                scrollButtons={isMobile}
            >
                <Tab label="Все" />
                <Tab label="Заполненные"/>
                <Tab label="Незаполненные" />
            </Tabs>
        </div>
    )
})