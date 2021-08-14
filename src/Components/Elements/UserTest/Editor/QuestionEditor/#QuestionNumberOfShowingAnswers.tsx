import {observer} from "mobx-react";
import React from 'react';
import {FormControl, MenuItem, Select, Typography} from "@material-ui/core";
import {Row} from "react-bootstrap";
import {QuestionEditorStorage} from "../../../../../Store/PrivateStorage/EditorsPage/QuestionEditorPage/QuestionEditorStorage";

export const QuestionNumberOfShowingAnswers = observer(() =>{
    console.log(QuestionEditorStorage.selectedQuestionNumberOfShowingAnswers)
    return(
        <div>
            <Row className="ml-2">
                <Typography className="mt-3">
                    Количество отображаемых ответов
                </Typography>
                <FormControl  variant="outlined" className="col-2 ml-3">
                    <Select
                        className="col-12"
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
                    </Select>
                </FormControl>


            </Row>
        </div>
    )
})