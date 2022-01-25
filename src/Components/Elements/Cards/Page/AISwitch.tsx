import {observer} from "mobx-react";
import React from 'react';
import Switch from '@mui/material/Switch';
import {Stack, Typography} from "@mui/material";
import {useHistory, useRouteMatch} from "react-router-dom";

interface IAISwitchProps extends React.HTMLAttributes<HTMLDivElement>{

}


export const AISwitch = observer(({...props}: IAISwitchProps) =>{
    const history = useHistory()
    const { path } = useRouteMatch();
    const handleOnChange = (e) =>{
        if(e.target.checked){
            history.push(path + "/AISearch")
        } else {
            history.push(path + "/DSearch")
        }
    }
    return(
        <div {...props}>
            <Stack  direction={"row"}  alignItems={"center"} justifyContent={"center"}>
                <Typography>
                    Алгоритмический поиск
                </Typography>
                <Switch  defaultChecked color="secondary" onChange={handleOnChange}/>
                <Typography>
                    Персонализированный поиск
                </Typography>
            </Stack>
        </div>
    )
})