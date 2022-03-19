import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Paper} from "@mui/material";
import QuestionSelector from "../../../Question/Selector/UI/question-selector";
import {useHistory, useRouteMatch} from "react-router-dom";


interface ISelectQuestionAndOpenItProps extends PaperProps {

}

const SelectQuestionAndOpenIt = observer(({...props}: ISelectQuestionAndOpenItProps) => {
    const history = useHistory()
    const {path} = useRouteMatch();

    function openQuestionOnSelect(question_id: string) {
        history.push(path + "question/" + question_id)
    }

    return (
        <Paper elevation={0} {...props}>
            <QuestionSelector onQuestionSelect={openQuestionOnSelect}/>
        </Paper>
    )
})

export default SelectQuestionAndOpenIt