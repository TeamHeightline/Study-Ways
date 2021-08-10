import {observer} from "mobx-react";
import React from "react";
import {Alert} from "@material-ui/lab";

export const AnswerSavingNotification = observer(({answer}) =>{
    return(
        <>
            <Alert variant="outlined" severity={answer.stateOfSave ? "success": "info"}>
                {answer.stateOfSave? "Ответ сохранен" : "Ответ не сохранен"}
            </Alert>
        </>
    )
})