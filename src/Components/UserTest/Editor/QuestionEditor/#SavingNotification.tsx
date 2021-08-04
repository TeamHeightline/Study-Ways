import {observer} from "mobx-react";
import {QuestionEditorStorage} from "../../../../Store/PrivateStorage/EditorsPage/QuestionEditorPage/QuestionEditorStorage";
import {Col} from "react-bootstrap";
import {Alert} from "@material-ui/lab";
import React from "react";

export const SavingNotification = observer(() =>{
    return(
        <>
            {QuestionEditorStorage.questionHasBeenSelected &&
            <Col className="mr-1">
                <Alert severity={QuestionEditorStorage.stateOfSave ? "success": "info"}>
                    {QuestionEditorStorage.stateOfSave? "Вопрос сохранен" : "Вопрос не сохранен"}
                </Alert>
            </Col>}
        </>
    )
})