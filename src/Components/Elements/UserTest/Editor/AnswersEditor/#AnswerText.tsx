import {observer} from "mobx-react";
import {TextField} from "@material-ui/core";
import React from "react";

export const AnswerText = observer(({answer})=>{
    return(
        <>
            <TextField
                variant={"filled"}
                className="mt-2"
                key={answer.id + "text"}
                id="standard-multiline-flexible"
                label="ТЕКСТ ОТВЕТА"
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