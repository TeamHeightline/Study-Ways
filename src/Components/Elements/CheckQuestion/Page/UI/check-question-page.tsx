import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Paper} from "@mui/material";
import {Route, Routes} from "react-router-dom";
import SelectQuestionAndOpenIt from "./select-question-and-open-it";
import CheckQuestionByURL from "../../CheckQuestionByURL/UI/check-question-by-url";


interface ICheckQuestionPageProps extends PaperProps {

}

const CheckQuestionPage = observer(({...props}: ICheckQuestionPageProps) => {
    return (
        <Paper elevation={0} {...props} sx={{pl: 4}}>
            <Routes>
                <Route path={`/question/:id`} element={<div><CheckQuestionByURL/></div>}/>
                <Route path={`/*`} element={<div><SelectQuestionAndOpenIt/></div>}/>
            </Routes>
        </Paper>
    )
})

export default CheckQuestionPage