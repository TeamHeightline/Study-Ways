import {observer} from "mobx-react";
import {InputLabel, MenuItem, Select} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import React from "react";

export const AnswerIsTrue = observer(({answer}) =>{
    return(
        <>
            <FormControl fullWidth >
                <InputLabel sx={{pt:2}}>Ответ верный/неверный</InputLabel>
                <Select
                    fullWidth
                    variant={"filled"}
                    value={answer.isTrue}
                    onChange={(e:any) =>{answer.changeAnswerIsTrue(e.target.value)}}
                >
                    <MenuItem value="true">Верный</MenuItem>
                    <MenuItem value="false">Неверный</MenuItem>
                </Select>
            </FormControl>
        </>
    )
})