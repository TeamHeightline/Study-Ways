import {observer} from "mobx-react";
import {QuestionEditorStorage} from "../../../../Store/PrivateStorage/EditorsPage/QuestionEditorPage/QuestionEditorStorage";
import {TextField} from "@material-ui/core";
import React from "react";

export const QuestionText = observer(() =>{
    return(
        <TextField
            id="standard-multiline-flexible"
            label="Текст вопроса"
            multiline
            fullWidth
            rowsMax={4}
            // style={{width: "50vw"}}
            value={QuestionEditorStorage.selectedQuestionText}
            onChange={(e) => {
                QuestionEditorStorage.selectedQuestionText = e.target.value
            }}
        />
    )
})