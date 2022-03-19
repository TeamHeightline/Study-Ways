import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Paper} from "@mui/material";
import {Route, Switch, useRouteMatch} from "react-router-dom";
import SelectQuestionAndOpenIt from "./select-question-and-open-it";
import CheckQuestionByURL from "../../CheckQuestionByURL/UI/check-question-by-url";


interface ICheckQuestionPageProps extends PaperProps {

}

const CheckQuestionPage = observer(({...props}: ICheckQuestionPageProps) => {
    const {path} = useRouteMatch();
    return (
        <Paper elevation={0} {...props} sx={{pl: 4}}>
            <Switch>
                <Route path={`${path}/question/:id`} component={CheckQuestionByURL}/>
                <Route path={`${path}/`} component={SelectQuestionAndOpenIt}/>
            </Switch>
        </Paper>
    )
})

export default CheckQuestionPage