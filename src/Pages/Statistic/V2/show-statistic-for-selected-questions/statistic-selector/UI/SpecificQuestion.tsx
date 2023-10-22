import {observer} from "mobx-react";
import React from 'react';
import {FormControl, MenuItem, TextField} from "@mui/material";
import {SASObject} from "../Store/SelectAttemptStore";

interface ISpecificQuestionProps extends React.HTMLAttributes<HTMLDivElement>{

}
export const SpecificQuestion = observer(({...props}: ISpecificQuestionProps) =>{
    return(
        <div {...props}>
            <FormControl sx={{width: 230}}>
                <TextField
                    select
                    label={"Выберите вопрос"}
                    value={SASObject?.specificQuestion}
                    onChange={SASObject?.changeSpecificQuestion}
                >
                    <MenuItem value={"-1"}>Все вопросы</MenuItem>
                    {SASObject?.arrayForQuestionSelector?.map((question) =>{
                        return(
                            <MenuItem key={"Select Question" + question.id} value={String(question.id)}>
                                {"ID: " + question.id + " " + question.text}
                            </MenuItem>
                        )
                    })}
                </TextField>
            </FormControl>
        </div>
    )
})