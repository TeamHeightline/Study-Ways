import React from 'react'

import {Helmet} from "react-helmet";

import {observer} from "mobx-react";
import {CardSelector} from "../Selector/UI/CardSelector";
import {useNavigate} from "react-router-dom";
import {AIRoutes} from "./AISwitch";
import {AICardSelector} from "./AISearch/UI/AICardSelector";
import useQueryParams from "../../../CustomHooks/useQueryParams";

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
            {queryParams.get("searchType") == "AISearch" &&
                <AICardSelector onCardSelect={(card_id) => {
                    navigate("/card/" + card_id)
                }}/>}
            {queryParams.get("searchType") == "DSearch" &&
                <CardSelector onCardSelect={(card_id) => {
                    navigate("/card/" + card_id)
                }}/>
            }
        </div>
    );
})
