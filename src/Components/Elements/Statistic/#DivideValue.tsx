import {observer} from "mobx-react";
import React from 'react';
import {InputAdornment, TextField} from "@mui/material";
import {StatisticPageStoreObject} from "../../../Store/PrivateStorage/EditorsPage/StatisticStore/StatisticPageStore";

interface IDivideValueProps extends React.HTMLAttributes<HTMLDivElement>{

}
export const DivideValue = observer(({...props}: IDivideValueProps) =>{
    return(
        <div {...props}>
            <TextField
                id="outlined-number"
                label="Коэффициент"
                type="number"
                onChange={StatisticPageStoreObject.changeDivideValue}
                value={StatisticPageStoreObject.divideValueForTextField}
                InputProps={{
                    startAdornment: <InputAdornment position="start">0.</InputAdornment>,
                }}
            />
        </div>
    )
})