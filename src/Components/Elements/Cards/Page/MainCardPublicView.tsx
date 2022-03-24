import React from 'react'

import {Helmet} from "react-helmet";

import {observer} from "mobx-react";
import {CardSelector} from "../Selector/UI/CardSelector";
import {useHistory} from "react-router-dom";
import {AISwitch} from "./AISwitch";
import {AICardSelector} from "./AISearch/UI/AICardSelector";
import useQueryParams from "../../../../CustomHooks/useQueryParams";

export const MainCardPublicView = observer(() => {
    const history = useHistory();
    const queryParams = useQueryParams();


    return (
        <div>
            <Helmet>
                <title>
                    Ресурсы
                </title>
            </Helmet>
            <AISwitch/>
            {queryParams.get("searchType") == "AISearch" &&
                <AICardSelector onCardSelect={(card_id) => {
                    history.push("/card/" + card_id)
                }}/>}
            {queryParams.get("searchType") == "DSearch" &&
                <CardSelector onCardSelect={(card_id) => {
                    history.push("/card/" + card_id)
                }}/>
            }
        </div>
    );
})