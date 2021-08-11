import {observer} from "mobx-react";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import {MenuProps} from "./Struct";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import React from "react";
import {QuestionEditorStorage} from "../../../../../Store/PrivateStorage/EditorsPage/QuestionEditorPage/QuestionEditorStorage";
import {toJS} from "mobx";

export const ThemeSelector = observer(()=>{
    return(
        <FormControl className="col-12 ml-5">
            <InputLabel id="question-theme-multiple">Темы вопросов</InputLabel>
            <Select
                labelId="demo-mutiple-name-label"
                id="demo-mutiple-name"
                multiple
                value={QuestionEditorStorage.SelectedQuestionThemesForSelector}
                onChange={(e: any) => {
                    console.log(e.target.value)
                    QuestionEditorStorage.selectedQuestionThemesArray = e.target.value
                }}
                input={<Input/>}
                MenuProps={MenuProps}
            >
                {QuestionEditorStorage.allQuestionsDataHasBeenDeliver &&
                toJS(QuestionEditorStorage.allThemesForQuestion).map((theme: any) => (
                    <MenuItem key={theme.name + theme.id} value={theme.id}>
                        {theme.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
})