import {observer} from "mobx-react";
import {InputLabel, MenuItem, Select} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import React from "react";

export const AnswerIsTrue = observer(({answer}) =>{
    return(
        <>
            <FormControl style={{width: 220}} className="ml-2" >
                <InputLabel id="demo-simple-select-label">Ответ верный/неверный</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={answer.isTrue}
                    onChange={(e:any) =>{answer.isTrue = e.target.value}}
                >
                    <MenuItem value="true">Верный</MenuItem>
                    <MenuItem value="false">Неверный</MenuItem>
                </Select>
            </FormControl>
        </>
    )
})