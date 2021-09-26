import {observer} from "mobx-react";
import React from 'react';
import {FormControlLabel, Switch} from "@material-ui/core";
import {StatisticByQuestionDataStoreObject} from "../../../Store/PrivateStorage/EditorsPage/StatisticStore/StatisticByQuestionsDataStore";

export const StatisticOnlyExamMode = observer(() =>{
    return(
        <div>
            <FormControlLabel control={
                <Switch
                    value={StatisticByQuestionDataStoreObject?.showPassesOnlyInActiveExamMode}
                    onChange={e => StatisticByQuestionDataStoreObject?.changeShowPassesOnlyInActiveExamMode(e.target.checked)}
                    color="primary"
                />
            } label="Только режим экзамена" />
        </div>
    )
})