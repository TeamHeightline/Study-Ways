import {observer} from "mobx-react";
import React from 'react';
import {Sequences} from "../../QuestionSequence/Selector/UI/Sequences";
import {Redirect, Route, Switch, useHistory, useRouteMatch} from "react-router-dom";
import {Finder} from "./question-finder/UI/Finder";


interface IStatisticV2Props extends React.HTMLAttributes<HTMLDivElement>{

}
export const StatisticV2 = observer(({...props}: IStatisticV2Props) =>{
    const history = useHistory();
    const { path } = useRouteMatch();

    return(
        <Switch>
            <Route  path={`${path}/qs/:id`}
                    render={(props) =>
                        <Finder mode={"qs"} {...props}/>}/>
            <Route  path={`${path}/qs`}>
                <Sequences onSelectQS={(qs_id) => history.push(path + "/qs/" + qs_id)}/>
            </Route>
            <Redirect to={`${path}/qs`}/>
        </Switch>
    )
})