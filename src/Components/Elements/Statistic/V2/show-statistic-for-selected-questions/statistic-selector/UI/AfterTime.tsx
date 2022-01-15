import {observer} from "mobx-react";
import React from 'react';
import {TextField} from "@mui/material";
import {DateTimePicker} from "@mui/lab";
import {SASObject} from "../Store/SelectAttemptStore";

interface IAfterTimeProps extends React.HTMLAttributes<HTMLDivElement>{

}
export const AfterTime = observer(({...props}: IAfterTimeProps) =>{
    return(
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