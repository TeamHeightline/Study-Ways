import { Autocomplete } from '@mui/material';
import {TextField} from "@mui/material";
import React from "react";
import {observer} from "mobx-react";
import {QuestionEditorStorage} from "../../../../../Store/PrivateStorage/EditorsPage/QuestionEditorPage/QuestionEditorStorage";

export const QuestionSelector = observer(() =>{
    return(
        <Autocomplete
            id="combo-box-demo"
            fullWidth
            options={QuestionEditorStorage?.allQuestionsDataForSelector}
            getOptionLabel={(option: any) => option?.text}
            renderInput={(params) => <TextField {...params} label="Вопрос" variant="outlined"/>}
            onChange={(e, questionData) => {
                QuestionEditorStorage.selectorHandleChange(e, questionData)
            }}
        />)
    })
