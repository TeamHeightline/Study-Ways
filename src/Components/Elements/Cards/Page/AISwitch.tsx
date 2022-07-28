import {observer} from "mobx-react";
import React from 'react';
import Switch from '@mui/material/Switch';
import {Stack, Typography} from "@mui/material";
import {Navigate, Route, Routes, useLocation, useNavigate} from "react-router-dom";
import useQueryParams from "../../../../CustomHooks/useQueryParams";


interface IAIRoutesProps extends React.HTMLAttributes<HTMLDivElement> {

}


export const AIRoutes = observer(({...props}: IAIRoutesProps) => {
    const navigate = useNavigate();
    const {pathname} = useLocation();
    const queryParams = useQueryParams();


    const handleOnChange = (e) => {
        if (!e.target.checked) {
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
                <Typography>
                    AI поиск
                </Typography>
                <Switch checked={!(searchType === "AISearch")}
                        color="secondary" onChange={handleOnChange}/>
                <Typography>
                    Обычный поиск
                </Typography>
            </Stack>
        </div>
    )
})
