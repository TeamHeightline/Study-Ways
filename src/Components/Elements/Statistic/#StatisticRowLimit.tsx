import {observer} from "mobx-react";
import React from 'react';
import {Slider, Typography} from "@material-ui/core";
import {StatisticByQuestionDataStoreObject} from "../../../Store/PrivateStorage/EditorsPage/StatisticStore/StatisticByQuestionsDataStore";
const marks = [
    {
        value: 100,
        label: '100',
    },
    {
        value: 200,
        label: '200',
    },
    {
        value: 300,
        label: '300',
    },
    {
        value: 400,
        label: '400',
    },
    {
        value: 500,
        label: '500',
    },
    {
        value: 600,
        label: '600',
    },
    {
        value: 700,
        label: '700',
    },
];

export const StatisticRowLimit = observer(() =>{
    return(
        <div>
            <Typography gutterBottom>
                Максимальное число строк
            </Typography>
            <Slider marks={marks} color="primary"
                    value={StatisticByQuestionDataStoreObject.rowLimit}
                    onChange={(e, value) =>
                        StatisticByQuestionDataStoreObject.changeRowLimit(value)}
                    defaultValue={50}
                    min={50} max={700} />
        </div>
    )
})