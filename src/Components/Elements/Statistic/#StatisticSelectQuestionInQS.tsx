import {observer} from "mobx-react";
import {FormControl, MenuItem, Select} from "@material-ui/core";
import {StatisticByQuestionDataStoreObject} from "../../../Store/PrivateStorage/EditorsPage/StatisticStore/StatisticByQuestionsDataStore";
import {StatisticPageStoreObject} from "../../../Store/PrivateStorage/EditorsPage/StatisticStore/StatisticPageStore";
import React from 'react';
export const StatisticSelectQuestionInQS = observer(() =>{
    return(
        <div>
            <FormControl fullWidth style={{marginTop: 0, marginRight: 0}}>
                <Select
                    variant="outlined"
                    value={StatisticByQuestionDataStoreObject?.selectedQuestionOnPage}
                    onChange={(e) => StatisticByQuestionDataStoreObject?.changeSelectedQuestionOnPage(e.target.value)}
                >
                    <MenuItem value={"-1"}>Все вопросы</MenuItem>
                    {StatisticPageStoreObject?.questionsDataForSelectedQS?.map((question) =>{
                        return(
                            <MenuItem key={"Select Question" + question.id} value={String(question.id)}>
                                {"ID: " + question.id + " " + question.text}</MenuItem>
                        )
                    })}
                    {StatisticPageStoreObject?.activePageOnTopMenu === 2 &&
                    StatisticPageStoreObject?.allDetailQuestionStatistic?.map((question) =>{
                        return(
                            <MenuItem key={"Select Question" + question.id} value={String(question.id)}>
                                {"ID: " + question.id + " " + question.text}</MenuItem>
                        )
                    })}
                </Select>
            </FormControl>
        </div>
    )
})