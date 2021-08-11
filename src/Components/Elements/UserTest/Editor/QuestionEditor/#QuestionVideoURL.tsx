import {observer} from "mobx-react";
import {TextField} from "@material-ui/core";
import {QuestionEditorStorage} from "../../../../../Store/PrivateStorage/EditorsPage/QuestionEditorPage/QuestionEditorStorage";
import FormControl from "@material-ui/core/FormControl";
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