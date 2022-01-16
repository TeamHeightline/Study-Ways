import {observer} from "mobx-react";
import React from 'react';
import {Sequences} from "../../QuestionSequence/Selector/UI/Sequences";
import {Redirect, Route, Switch, useHistory, useRouteMatch} from "react-router-dom";
import {Finder} from "./question-finder/UI/Finder";
import {FinderTabs} from "./question-finder/UI/FinderTabs";


export const StatisticV2 = observer(() =>{
    const history = useHistory();
    const { path } = useRouteMatch();

    return(
        <div>
            <FinderTabs/>
            <Switch>
                <Route  path={`${path}/qs/:id`}
                        render={(props) =>
                            <Finder mode={"qs"} {...props}/>}/>
                <Route  path={`${path}/all`}
                        render={(props) =>
                            <Finder mode="all" {...props}/>}/>

                <Route  path={`${path}/qs`}>
                    <Sequences onSelectQS={(qs_id) => history.push(path + "/qs/" + qs_id)}/>
                </Route>
                <Redirect to={`${path}/qs`}/>
            </Switch>
        </div>
    )
})