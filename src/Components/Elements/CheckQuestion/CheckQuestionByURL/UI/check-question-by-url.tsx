import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Paper} from "@mui/material";
import {RouteComponentProps} from "react-router-dom";
import CheckQuestionByID from "../../CheckQuestionByID/UI/check-question-by-id";

interface RouteProps {
    id: string
}

interface ICheckQuestionByURLProps extends PaperProps, RouteComponentProps<RouteProps> {

}

const CheckQuestionByURL = observer(({...props}: ICheckQuestionByURLProps) => {
    const question_id_from_url = props.match.params.id;
    return (
        <Paper elevation={0} {...props}>
            <CheckQuestionByID question_id={question_id_from_url}/>
        </Paper>
    )
})

export default CheckQuestionByURL