import {observer} from "mobx-react";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import {MenuProps} from "./Struct";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import React from "react";
import {QuestionEditorStorage} from "../../../../../Store/PrivateStorage/EditorsPage/QuestionEditorPage/QuestionEditorStorage";
import {toJS} from "mobx";
import {Select} from "@mui/material";

export const AuthorSelector = observer(()=>{
    return(
        <FormControl className="col-12">
            <InputLabel id="question-theme-multiple">Авторы вопросов</InputLabel>
            {QuestionEditorStorage.allQuestionsDataHasBeenDeliver && QuestionEditorStorage.SelectedQuestionAuthorForSelector&&
            <Select
                multiple
                variant="filled"
                defaultValue={"undefined"}
                value={QuestionEditorStorage.SelectedQuestionAuthorForSelector || ["undefined"]}
                onChange={(e: any) => {
                    QuestionEditorStorage.selectedQuestionAuthorsArray = e.target.value
                }}
                input={<Input/>}
                MenuProps={MenuProps}
            >
                <MenuItem  value={"undefined"}>
                    Не выбран
                </MenuItem>
                {QuestionEditorStorage.allQuestionsDataHasBeenDeliver &&
                toJS(QuestionEditorStorage.allAuthorsForQuestion).map((author: any) => (
                    <MenuItem key={author.name + author.id} value={author.id}>
                        {author.name}
                    </MenuItem>
                ))}
            </Select>}
        </FormControl>
    )
})