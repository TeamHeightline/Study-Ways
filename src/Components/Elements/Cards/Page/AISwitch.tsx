import {observer} from "mobx-react";
import React from 'react';
import Switch from '@mui/material/Switch';
import {Stack, Typography} from "@mui/material";
import {useHistory, useRouteMatch, Redirect} from "react-router-dom";
import useQueryParams from "../../../../CustomHooks/useQueryParams";


interface IAISwitchProps extends React.HTMLAttributes<HTMLDivElement> {

}


export const AISwitch = observer(({...props}: IAISwitchProps) => {
    const history = useHistory()
    const {path} = useRouteMatch();
    const queryParams = useQueryParams();


    const handleOnChange = (e) => {
        if (!e.target.checked) {
            history.push(path + "?searchType=AISearch")
        } else {
            history.push(path + "?searchType=DSearch")
        }
    }
    const searchType = queryParams.get("searchType")

    if (!queryParams.get("searchType")) {
        return (<Redirect to={`${path}?searchType=AISearch`}/>)
    }
    return (
        <div {...props}>
            <Stack direction={"row"} alignItems={"center"} justifyContent={"center"}>
                <Typography>
                    Персонализированный поиск
                </Typography>
                <Switch checked={!(searchType === "AISearch")}
                        color="secondary" onChange={handleOnChange}/>
                <Typography>
                    Алгоритмический поиск
                </Typography>
            </Stack>
        </div>
    )
})