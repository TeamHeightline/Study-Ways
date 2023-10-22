import {observer} from "mobx-react";
import React from 'react';
import {FormControlLabel, Switch} from "@mui/material";
import {SASObject} from "../Store/SelectAttemptStore";

interface IQSModeProps extends React.HTMLAttributes<HTMLDivElement>{

}
export const QSMode = observer(({...props}: IQSModeProps) =>{
    return(
        <div {...props}>
            <FormControlLabel
                sx={{pl:1}}
                control={
                    <Switch
                        color="primary"
                        checked={SASObject?.onlyInQs}
                        onChange={(e) => SASObject.onlyInQs = e.target.checked}
                    />
                }
                label="Только в серии вопросов"
            />
        </div>
    )
})