import {observer} from "mobx-react";
import {InputLabel, MenuItem, Select} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import React from "react";

export const AnswerHardLevel = observer(({answer}) =>{
    return(
        <>
            <FormControl className="col-12">
                <InputLabel id="demo-simple-select-label">Сложность ответа</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={answer.hardLevelOfAnswer}
                    onChange={(e: any) =>{
                        answer.hardLevelOfAnswer = e.target.value}}
                >
                    <MenuItem value="EASY">Очевидный</MenuItem>
                    <MenuItem value="MEDIUM">Нормальный</MenuItem>
                    <MenuItem value="HARD">Каверзный</MenuItem>
                </Select>
            </FormControl>
        </>
    )
})