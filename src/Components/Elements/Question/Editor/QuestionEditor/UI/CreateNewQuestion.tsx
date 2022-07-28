import {observer} from "mobx-react";
import {QuestionEditorStorage} from "../Store/QuestionEditorStorage";
import {Button} from "@mui/material";
import React from "react";

export const CreateNewQuestion = observer(() => {
    return (
        <>
            <Button variant="outlined" color="primary" fullWidth
                    size="large" onClick={() => {
                QuestionEditorStorage.createNewQuestion()
            }}>
                Создать новый вопрос
            </Button>
        </>
    )
})