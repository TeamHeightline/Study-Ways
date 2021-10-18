import {observer} from "mobx-react";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import React from "react";
import {QuestionEditorStorage} from "../../../../../Store/PrivateStorage/EditorsPage/QuestionEditorPage/QuestionEditorStorage";
import {isMobileHook} from "../../../../../CustomHooks/isMobileHook";

export const QuestionFolders = observer(() =>{
    const isMobile = isMobileHook()
    return(
        <div>
            <Tabs

                // scrollButtons="auto"
                value={QuestionEditorStorage.activeFolder}
                onChange={(e, newValue) => QuestionEditorStorage.changeActiveFolder(newValue)}
                indicatorColor="primary"
                textColor="primary"
                // centered
                variant={!isMobile ? "standard" : "scrollable"}
                // scrollButtons="auto"
                centered
                scrollButtons={!isMobile? "off": 'on'}
            >
                <Tab label="Все" />
                <Tab label="Заполненные"/>
                <Tab label="Незаполненные" />
            </Tabs>
        </div>
    )
})