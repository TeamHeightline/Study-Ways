import {observer} from "mobx-react";
import React from "react";
import {Grid, InputAdornment, TextField} from "@material-ui/core";
import {AccountCircle} from "@material-ui/icons";
import {StatisticByQuestionDataStoreObject} from "../../../Store/PrivateStorage/EditorsPage/QuestionStatisticStore/StatisticByQuestionDataStore";

export const StatisticSearchByUserName= observer(() =>{
    return(
        <div>
            <Grid container>
                <Grid item xs={12} md={2} style={{marginLeft: 48}}>
                    <TextField
                        value={StatisticByQuestionDataStoreObject.searchingUserName}
                        onChange={(e) =>
                            StatisticByQuestionDataStoreObject.changeSearchingUserName(e.target.value)}
                        label="Имя пользователя" fullWidth variant="outlined"
                               InputProps={{
                                   startAdornment: (
                                       <InputAdornment position="start">
                                           <AccountCircle />
                                       </InputAdornment>
                                   ),
                               }}/>
                </Grid>
            </Grid>
        </div>
    )
})