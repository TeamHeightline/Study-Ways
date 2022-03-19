import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Alert, Paper} from "@mui/material";
import {CheckAnswerByIdStore} from "../Store/check-answer-by-id-store";


interface IUIHelpTextV3Props extends PaperProps {
    answerStore: CheckAnswerByIdStore

}

const UIHelpTextV3 = observer(({answerStore, ...props}: IUIHelpTextV3Props) => {
    return (
        <Paper elevation={0} {...props}>
            <Alert severity={"error"} variant={"outlined"}>
                {answerStore.answerData?.helpTextv3}
            </Alert>
        </Paper>
    )
})

export default UIHelpTextV3