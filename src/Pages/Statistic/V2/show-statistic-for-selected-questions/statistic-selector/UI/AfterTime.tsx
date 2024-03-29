import {observer} from "mobx-react";
import React from 'react';
import {TextField} from "@mui/material";
import {SASObject} from "../Store/SelectAttemptStore";
import {DateTimePicker} from '@mui/x-date-pickers/DateTimePicker';

interface IAfterTimeProps extends React.HTMLAttributes<HTMLDivElement> {

}

export const AfterTime = observer(({...props}: IAfterTimeProps) => {
    return (
        <div {...props}>
            <DateTimePicker
                label="Время, после которого отображать"
                value={SASObject.afterTime}
                onChange={SASObject.changeAfterTime}
                renderInput={(params) => <TextField {...params} />}
            />
        </div>
    )
})