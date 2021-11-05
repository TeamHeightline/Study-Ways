import {observer} from "mobx-react";
import {InputLabel, MenuItem, Select} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import React from "react";

export const AnswerIsTrue = observer(({answer}) =>{
    return(
        <>
            <FormControl className="col-12">
                <InputLabel id="demo-simple-select-label">Ответ верный/неверный</InputLabel>
                <Select
                    variant={"filled"}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
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