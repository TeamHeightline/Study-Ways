import {observer} from "mobx-react";
import {
    QuestionEditorStorage
} from "../Store/QuestionEditorStorage";
import {TextField} from "@mui/material";
import React from "react";

export const QuestionText = observer(() => {
    return (
        <TextField
            id="standard-multiline-flexible"
            label="Текст вопроса"
            multiline
            fullWidth
            autoFocus
            variant="outlined"
            rows={3}
            // style={{width: "50vw"}}
            value={QuestionEditorStorage.selectedQuestionText}
            onChange={(e) => {
                QuestionEditorStorage.selectedQuestionText = e.target.value
            }}
        />
    );
})