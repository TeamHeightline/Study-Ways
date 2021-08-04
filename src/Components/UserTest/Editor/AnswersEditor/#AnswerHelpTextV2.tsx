import {observer} from "mobx-react";
import {TextField} from "@material-ui/core";
import React from "react";

export const AnswerHelpTextV2 = observer(({answer}) =>{
    return(
        <>
            <TextField
                className="mt-2"
                key={answer.id + "helpTextv2"}
                id="standard-multiline-flexible"
                label="Подсказка для стандартного уровня сложности"
                multiline
                fullWidth
                rowsMax={7}
                // style={{width: "50vw"}}
                value={answer.helpTextv2}
                onChange={(e: any) => {
                    answer.helpTextv2 = e.target.value
                }}
            />
        </>
    )
})