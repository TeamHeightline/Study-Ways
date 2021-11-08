import {observer} from "mobx-react";
import {FormHelperText, InputLabel} from "@mui/material";
import Input from "@mui/material/Input";
import FormControl from "@mui/material/FormControl";
import React from "react";

export const AnswerCheckQueue = observer(({answer}) =>{
    return <>
        <FormControl className="col-12">
            <InputLabel htmlFor="formatted-text-mask-input">Очередь проверки</InputLabel>
            <Input
                value={answer.checkQueue}
                onChange={(e) => {
                    answer.checkQueue = e.target.value.replace(/[^\d]/g, '')
                }}
                name="textmask"
                id="formatted-text-mask-input"

            />
            <FormHelperText>Чем меньше число, тем выше приоритет</FormHelperText>
        </FormControl>
    </>;
})