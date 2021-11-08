import {observer} from "mobx-react";
import React from 'react';
import {FormControlLabel, Switch} from "@mui/material";
import {StatisticByQuestionDataStoreObject} from "../../../Store/PrivateStorage/EditorsPage/StatisticStore/StatisticByQuestionsDataStore";

export const StatisticOnlyInQSFlag = observer(() =>{
    return(
        <div>
            <FormControlLabel
                control={
                    <Switch
                        color="primary"
                        checked={StatisticByQuestionDataStoreObject.showPassesOnlyIfTheyDoneInQS}
                        onChange={(e) =>
                                StatisticByQuestionDataStoreObject.changeShowPassesOnlyIfTheyDoneInQS(e.target.checked)}
                    />
                }
                label="Только в серии вопросов"
            />
        </div>
    )
})