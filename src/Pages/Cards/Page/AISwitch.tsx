import {observer} from "mobx-react";
import React from 'react';
import Switch from '@mui/material/Switch';
import {Stack, ToggleButton, ToggleButtonGroup, Typography} from "@mui/material";
import {Navigate, Route, Routes, useLocation, useNavigate} from "react-router-dom";
import useQueryParams from "../../../Shared/CustomHooks/useQueryParams";

import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SearchIcon from '@mui/icons-material/Search';

interface IAIRoutesProps extends React.HTMLAttributes<HTMLDivElement> {

}


export const AIRoutes = observer(({...props}: IAIRoutesProps) => {
    const navigate = useNavigate();
    const {pathname} = useLocation();
    const queryParams = useQueryParams();


    const handleOnChange = (e, value) => {
        console.log(value)
        if (value === "AISearch") {
            navigate(pathname + "?searchType=AISearch")
        } else {
            navigate(pathname + "?searchType=DSearch")
        }
    }
    const searchType = queryParams.get("searchType")

    if (!queryParams.get("searchType")) {
        return (
            <Routes>
                <Route
                    path="*"
                    element={<Navigate to={`${pathname}?searchType=AISearch`} replace/>}
                />
            </Routes>)
    }
    return (
        <div {...props}>
            <Stack direction={"row"} alignItems={"center"} justifyContent={"center"}>
                <ToggleButtonGroup
                    color="primary"
                    value={searchType}
                    exclusive
                    onChange={handleOnChange}
                >
                    <ToggleButton value="AISearch">
                        <AutoAwesomeIcon/>
                        AI поиск
                    </ToggleButton>
                    <ToggleButton value="DSearch">
                        <SearchIcon/>
                        Обычный поиск
                    </ToggleButton>
                </ToggleButtonGroup>
            </Stack>
        </div>
    )
})
