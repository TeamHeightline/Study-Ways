import {observer} from "mobx-react";
import {TextField} from "@material-ui/core";
import React from "react";
import {toJS} from "mobx";

export const AnswerText = observer(({answer})=>{
    return(
        <>
            <TextField
                className="mt-2"
                key={answer.id + "text"}
                id="standard-multiline-flexible"
                label="Текст ответа"
                multiline
                fullWidth
                rowsMax={7}
                value={answer.text}
                onChange={(e: any) =>{
                    answer.text = e.target.value
                }}
            />
        </>
    )
})