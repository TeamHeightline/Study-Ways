import {observer} from "mobx-react";
import {Checkbox, FormControlLabel, FormHelperText} from "@mui/material";
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
                label="Обязательный вариант"
            />
            <FormHelperText>Случайные наборы ответов всегда будут содержать этот ответ</FormHelperText>


        </div>
    )
})