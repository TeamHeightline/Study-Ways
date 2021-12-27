import {observer} from "mobx-react";
import {
    QuestionEditorStorage,
    variantsOfStateOfSave
} from "../../../../../Store/PrivateStorage/EditorsPage/QuestionEditorPage/QuestionEditorStorage";
import {Col} from "react-bootstrap";
import { Alert } from '@mui/material';
import React from "react";

export const SavingNotification = observer(() =>{
    return(
        <>
            {QuestionEditorStorage.questionHasBeenSelected &&
            <Col>
                <Alert variant="outlined"
                       severity={QuestionEditorStorage.stateOfSave == variantsOfStateOfSave.SAVED ? "success":
                           QuestionEditorStorage.stateOfSave == variantsOfStateOfSave.SAVING? "info": "error"}>
                    {QuestionEditorStorage.stateOfSave == variantsOfStateOfSave.SAVED? "Вопрос сохранен" :
                        QuestionEditorStorage.stateOfSave == variantsOfStateOfSave.SAVING? "Вопрос не сохранен":
                            "Ошибка при сохранение"}
                </Alert>
            </Col>}
        </>
    )
})