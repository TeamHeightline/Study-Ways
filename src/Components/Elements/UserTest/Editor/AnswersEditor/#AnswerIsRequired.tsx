import {observer} from "mobx-react";
import {Checkbox, FormControlLabel} from "@material-ui/core";
import React from "react";

export const AnswerIsRequired = observer(({answer}) =>{
    return(
        <div>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={answer.isRequired}
                        onChange={e => answer.changeIsRequired(e.target.checked)}
                        color="primary"
                    />
                }
                label="Отображать всегда"
            />
        </div>
    )
})