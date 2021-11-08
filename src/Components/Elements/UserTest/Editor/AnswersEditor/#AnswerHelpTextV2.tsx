import {observer} from "mobx-react";
import {TextField} from "@mui/material";
import React from "react";

export const AnswerHelpTextV2 = observer(({answer}) =>{
    return <>
        <TextField
            variant={"outlined"}
            className="mt-2"
            key={answer.id + "helpTextv2"}
            id="standard-multiline-flexible"
            label="Подсказка для стандартного уровня сложности"
            multiline
            fullWidth
            maxRows={7}
            // style={{width: "50vw"}}
            value={answer.helpTextv2}
            onChange={(e: any) => {
                answer.helpTextv2 = e.target.value
            }}
        />
    </>;
})