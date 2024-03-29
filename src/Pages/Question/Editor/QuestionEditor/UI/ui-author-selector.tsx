import {observer} from "mobx-react";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import {MenuProps} from "./Struct";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import React from "react";
import {QuestionEditorStorage} from "../Store/QuestionEditorStorage";
import {toJS} from "mobx";
import {Select} from "@mui/material";

export const AuthorSelector = observer(() => {
    return (
        <FormControl className="col-12">
            <InputLabel id="question-theme-multiple">Авторы вопроса</InputLabel>
            <Select
                multiple
                variant="filled"
                value={QuestionEditorStorage.SelectedQuestionAuthorForSelector || []}
                onChange={(e: any) => {
                    QuestionEditorStorage.selectedQuestionAuthorsArray = e.target.value
                }}
                input={<Input/>}
                MenuProps={MenuProps}
            >
                {toJS(QuestionEditorStorage.allAuthorsForQuestion).map((author: any) => (
                    <MenuItem key={author.name + author.id} value={String(author.id)}>
                        {author.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
})