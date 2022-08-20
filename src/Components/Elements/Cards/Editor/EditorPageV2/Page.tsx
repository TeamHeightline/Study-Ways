import Paper from "@mui/material/Paper/Paper";
import {observer} from "mobx-react";
import React from 'react';
import {CardSelector} from "../../Selector/UI/CardSelector";
import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import {EditCardByUrl} from "./EditCardByUrl";

interface IEditorPageProps extends React.HTMLAttributes<HTMLDivElement> {

}

export const EditorPage = observer(({...props}: IEditorPageProps) => {
    const navigate = useNavigate();
    const {pathname} = useLocation();
    return (
        <Paper elevation={0} sx={{pl: 4}} {...props}>
            <Routes>
                <Route path={`/card/:id`}
                       element={<EditCardByUrl  {...props}/>}/>

                <Route path={`/*`}
                       element={<CardSelector
                           showCreateNewCard={true}
                           mode={"onlyCreatedByMe"}
                           onCardSelect={(card_id) => navigate(`card/` + card_id)}/>}/>

            </Routes>
        </Paper>
    )
})
