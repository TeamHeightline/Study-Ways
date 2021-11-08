import {observer} from "mobx-react";
import {TextField} from "@mui/material";
import {QuestionEditorStorage} from "../../../../../Store/PrivateStorage/EditorsPage/QuestionEditorPage/QuestionEditorStorage";
import FormControl from "@mui/material/FormControl";
import React from "react";

export const QuestionVideoURL = observer(() =>{
    return(
        <FormControl className="col-12">
            <TextField
                id="standard-basic"
                label="Ссылка на видео-вопрос"
                value={QuestionEditorStorage.selectedQuestionVideoUrl}
                onChange={(e) => {
                    QuestionEditorStorage.selectedQuestionVideoUrl = e.target.value
                }}/>
        </FormControl>
    )
})