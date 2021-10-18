import {observer} from "mobx-react";
import React from "react";
import {InputAdornment, TextField} from "@material-ui/core";
import {AccountCircle} from "@material-ui/icons";
import {StatisticByQuestionDataStoreObject} from "../../../Store/PrivateStorage/EditorsPage/StatisticStore/StatisticByQuestionsDataStore";
import {toJS} from "mobx";

export const StatisticSearchByUserName= observer(() =>{
    return(
            <TextField
                value={toJS(StatisticByQuestionDataStoreObject.searchingUserName)}
                onChange={ async(e) =>
                    StatisticByQuestionDataStoreObject.changeSearchingUserName(e.target.value)}
                label="Имя пользователя" fullWidth variant="outlined"
                       InputProps={{
                           startAdornment: (
                               <InputAdornment position="start">
                                   <AccountCircle />
                               </InputAdornment>
                           ),
                       }}/>
    )
})