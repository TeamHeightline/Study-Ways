import {observer} from "mobx-react";
import React, {useState} from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Paper} from "@mui/material";
import {CheckAnswerByIdStore} from "../Store/check-answer-by-id-store";
import CheckAnswerUI from "./ui";


interface ICheckAnswerIndexProps extends PaperProps {
    answerID: string,
    answerIndex: number
}

const CheckAnswerIndex = observer(({answerID, answerIndex, ...props}: ICheckAnswerIndexProps) => {
    const [answerStore] = useState(new CheckAnswerByIdStore(answerID))
    return (
        <Paper elevation={0} {...props}>
            <CheckAnswerUI answerStore={answerStore} answerIndex={answerIndex}/>
        </Paper>
    )
})

export default CheckAnswerIndex