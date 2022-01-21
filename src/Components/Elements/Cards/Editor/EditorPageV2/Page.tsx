import Paper from "@mui/material/Paper/Paper";
import {observer} from "mobx-react";
import React from 'react';
import {CardSelector} from "../../Selector/UI/CardSelector";
import {Redirect, Route, Switch, useHistory, useRouteMatch} from "react-router-dom";
import {EditCardByUrl} from "./EditCardByUrl";

interface IEditorPageProps extends React.HTMLAttributes<HTMLDivElement>{

}
export const EditorPage = observer(({...props}: IEditorPageProps) =>{
    const history = useHistory();
    const { path } = useRouteMatch();
    return(
        <Paper elevation={0} sx={{pl:4}} {...props}>
            <Switch>
                <Route  path={`${path}/select`}
                        render={() => <CardSelector
                            showCreateNewCard={true}
                            mode={"onlyCreatedByMe"}
                            onCardSelect={(card_id)=>history.push(`${path}/card/`+card_id )} />}/>
                <Route  path={`${path}/card/:id`}
                        render={(props) =>
                            <EditCardByUrl  {...props}/>}/>
                <Redirect to={`${path}/select`}/>
            </Switch>
        </Paper>
    )
})