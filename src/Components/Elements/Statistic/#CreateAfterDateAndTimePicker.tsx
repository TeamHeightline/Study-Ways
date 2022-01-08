import {observer} from "mobx-react";
import React from 'react';
import {DateTimePicker} from "@mui/lab";
import {TextField} from "@mui/material";
import {
    StatisticByQuestionDataStoreObject
} from "../../../Store/PrivateStorage/EditorsPage/StatisticStore/StatisticByQuestionsDataStore";

interface CreateAfterDateAndTimePickerProps extends React.HTMLAttributes<HTMLDivElement>{

}
export const CreateAfterDateAndTimePicker = observer(({...props}: CreateAfterDateAndTimePickerProps) =>{

    return(
        <div {...props}>
            <DateTimePicker
                label="Время, после которого отображать"
                value={StatisticByQuestionDataStoreObject.timeBeforeAttempt}
                onChange={StatisticByQuestionDataStoreObject.changeTimeBeforeAttempt}
                renderInput={(params) => <TextField {...params} />}
            />
        </div>
    )
})