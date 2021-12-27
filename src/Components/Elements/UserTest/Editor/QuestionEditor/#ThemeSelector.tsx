import {observer} from "mobx-react";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Input from "@mui/material/Input";
import {MenuProps} from "./Struct";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import React from "react";
import {QuestionEditorStorage} from "../../../../../Store/PrivateStorage/EditorsPage/QuestionEditorPage/QuestionEditorStorage";
import {toJS} from "mobx";

export const ThemeSelector = observer(()=>{
    console.log()
    return(
        <FormControl className="col-12">
            <InputLabel id="question-theme-multiple">Темы вопроса</InputLabel>
            <Select
                labelId="demo-mutiple-name-label"
                id="demo-mutiple-name"
                variant="outlined"
                multiple
                value={QuestionEditorStorage.SelectedQuestionThemesForSelector}
                onChange={(e: any) => {
                    QuestionEditorStorage.selectedQuestionThemesArray = e.target.value
                }}
                input={<Input/>}
                MenuProps={MenuProps}
            >

                {toJS(QuestionEditorStorage.allThemesForQuestion).map((theme: any) => (
                    <MenuItem key={theme.name + theme.id} value={String(theme.id)}>
                        {theme.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
})