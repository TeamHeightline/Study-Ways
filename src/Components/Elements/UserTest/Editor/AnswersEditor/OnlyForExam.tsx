import {observer} from "mobx-react";
import React from 'react';
import {AnswerStorageType} from "../../../../../Store/PrivateStorage/EditorsPage/QuestionEditorPage/AnswersStorage";
import {Checkbox, FormControlLabel} from "@mui/material";

interface IOnlyForExamProps extends React.HTMLAttributes<HTMLDivElement>{
    answer: AnswerStorageType
}
export const OnlyForExam = observer(({answer, ...props}: IOnlyForExamProps) =>{
    return(
        <div {...props}>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={!answer.onlyForExam}
                        onChange={() => answer.changeOnlyForExam()}
                        color="primary"
                    />
                }
                label="Отображать в режиме подготовки"
            />
        </div>
    )
})