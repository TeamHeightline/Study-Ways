import {observer} from "mobx-react";
import {TextField} from "@mui/material";
import React from "react";

export const AnswerHelpTextV3 = observer(({answer, ...props}) =>{
    return (
        <div {...props}>
            <TextField
                variant={"outlined"}
                className="mt-2"
                key={answer.id + "helpTextv3"}
                id="standard-multiline-flexible"
                label="Подсказка для усложненного уровня"
                multiline
                fullWidth
                maxRows={7}
                // style={{width: "50vw"}}
                value={answer.helpTextv3}
                onChange={(e: any) => {
                    answer.helpTextv3 = e.target.value
                }}
            />
        </div>
    );
})