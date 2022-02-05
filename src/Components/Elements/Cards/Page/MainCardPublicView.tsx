import React from 'react'

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
        <div >
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
            {/*<Switch>*/}
            {/*    <Route  path={`${path}/DSearch`}*/}
            {/*            render={() =>*/}
            {/*                <CardSelector onCardSelect={(card_id) => {*/}
            {/*                    history.push("/card/" + card_id)*/}
            {/*                }}/>}/>*/}
            {/*    <Route  path={`${path}/AISearch`}*/}
            {/*            render={() =>*/}
            {/*                <AICardSelector onCardSelect={(card_id) => {*/}
            {/*                    history.push("/card/" + card_id)*/}
            {/*                }}/>}/>*/}

            {/*</Switch>*/}
            {/*<Redirect to={`${path}?searchType=AISearch`}/>*/}
        </div>
    );
})