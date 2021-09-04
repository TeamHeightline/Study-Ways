import {observer} from "mobx-react";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import React from "react";
import {QuestionEditorStorage} from "../../../../../Store/PrivateStorage/EditorsPage/QuestionEditorPage/QuestionEditorStorage";

export const QuestionFolders = observer(() =>{
    return(
        <div>
            <Tabs
                scrollButtons="auto"
                value={QuestionEditorStorage.activeFolder}
                onChange={(e, newValue) => QuestionEditorStorage.changeActiveFolder(newValue)}
                indicatorColor="primary"
                textColor="primary"
                centered
            >
                <Tab label="Все вопросы" />
                <Tab label="Заполненные вопросы"/>
                <Tab label="Незаполненные вопросы" />
            </Tabs>
        </div>
    )
})