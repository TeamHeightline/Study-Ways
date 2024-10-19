import React from 'react'

import {Helmet} from "react-helmet";

import {observer} from "mobx-react";
import {CardSelector} from "../Selector/UI/CardSelector";
import {useNavigate} from "react-router-dom";
import {AIRoutes} from "./AISwitch";
import {AICardSelector} from "./AISearch/UI/AICardSelector";
import useQueryParams from "../../../CustomHooks/useQueryParams";
import {Box} from "@mui/material";

export const MainCardPublicView = observer(() => {
    const navigate = useNavigate();
    const queryParams = useQueryParams();


    return (
        <div>
            <Helmet>
                <title>
                    Ресурсы
                </title>
            </Helmet>
            <AIRoutes/>
            <Box sx={{mt: 1}}>
                {queryParams.get("searchType") == "AISearch" ?
                    <AICardSelector onCardSelect={(card_id) => {
                        window.scrollTo({top: 0, behavior: 'smooth'});
                        navigate("/card/" + card_id)
                    }}/> :
                    <CardSelector onCardSelect={(card_id) => {
                        window.scrollTo({top: 0, behavior: 'smooth'});
                        navigate("/card/" + card_id)
                    }}/>}
            </Box>
        </div>
    );
})
