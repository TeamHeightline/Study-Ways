import {observer} from "mobx-react";
import {TextField} from "@material-ui/core";
import React from "react";

export const AnswerHelpTextV1 = observer(({answer, ...props}) =>{
    return(
        <div {...props}>
            <TextField
                variant={"outlined"}
                className="mt-2"
                key={answer.id + "helpTextv1"}
                id="standard-multiline-flexible"
                label="Подсказка для легкого уровня сложности"
                multiline
                fullWidth
                rowsMax={7}
                value={answer.helpTextv1}
                onChange={(e: any) => {
                    answer.helpTextv1 = e.target.value
                }}
            />
        </div>
    )
})