import {observer} from "mobx-react";
import {TextField} from "@mui/material";
import React from "react";

export const AnswerText = observer(({answer}) => {
    return <>
        <TextField
            variant={"filled"}
            className="mt-2"
            key={answer.id + "text"}
            id="standard-multiline-flexible"
            label="ТЕКСТ ОТВЕТА"
            multiline
            fullWidth
            maxRows={7}
            value={answer.text}
            onChange={answer.changeAnswerText}
        />
    </>;
})