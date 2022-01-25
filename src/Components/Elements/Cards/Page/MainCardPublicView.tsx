import React from 'react'

import {observer} from "mobx-react";
import {CardSelector} from "../Selector/UI/CardSelector";
import {Redirect, Route, Switch, useHistory, useRouteMatch} from "react-router-dom";
import {AISwitch} from "./AISwitch";
import {AICardSelector} from "./AISearch/UI/AICardSelector";

export const MainCardPublicView = observer(() => {
    const history = useHistory();
    const { path } = useRouteMatch();

    return (
        <div >
            <AISwitch/>
            <Switch>
                <Route  path={`${path}/DSearch`}
                        render={() =>
                            <CardSelector onCardSelect={(card_id) => {
                                history.push("/card/" + card_id)
                            }}/>}/>
                <Route  path={`${path}/AISearch`}
                        render={() =>
                            <AICardSelector onCardSelect={(card_id) => {
                                history.push("/card/" + card_id)
                            }}/>}/>

            </Switch>
            <Redirect to={`${path}/AISearch`}/>
        </div>
    );
})