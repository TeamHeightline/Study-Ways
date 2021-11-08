import {observer} from "mobx-react";
import React from 'react';
import {FormControl, MenuItem, Select, Stack, TextField, Typography} from "@mui/material";
import {Row} from "react-bootstrap";
import {QuestionEditorStorage} from "../../../../../Store/PrivateStorage/EditorsPage/QuestionEditorPage/QuestionEditorStorage";
import {isMobileHook} from "../../../../../CustomHooks/isMobileHook";

export const QuestionNumberOfShowingAnswers = observer(() =>{
    const isMobile = isMobileHook()
    console.log(QuestionEditorStorage.selectedQuestionNumberOfShowingAnswers)
    return(
        <div>
            <Stack direction={isMobile? "column": "row"}>
                <Typography className="mt-3">
                    Количество отображаемых ответов
                </Typography>
                <FormControl  variant="outlined" className="col-md-2 pl-3 col-12 ">
                    <TextField
                        select
                        label="От 2 до 12"
                        fullWidth
                        value={QuestionEditorStorage.selectedQuestionNumberOfShowingAnswers}
                        onChange={(e) => {
                            QuestionEditorStorage.selectedQuestionNumberOfShowingAnswers = String(e.target.value)
                        }}
                    >
                        <MenuItem value={"2"}>2</MenuItem>
                        <MenuItem value={"3"}>3</MenuItem>
                        <MenuItem value={"4"}>4</MenuItem>
                        <MenuItem value={"5"}>5</MenuItem>
                        <MenuItem value={"6"}>6</MenuItem>
                        <MenuItem value={"7"}>7</MenuItem>
                        <MenuItem value={"8"}>8</MenuItem>
                        <MenuItem value={"9"}>9</MenuItem>
                        <MenuItem value={"10"}>10</MenuItem>
                        <MenuItem value={"11"}>11</MenuItem>
                        <MenuItem value={"12"}>12</MenuItem>
                    </TextField>
                </FormControl>


            </Stack>
        </div>
    )
})