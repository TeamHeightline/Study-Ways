import {observer} from "mobx-react";
import {QuestionEditorStorage} from "../../../../Store/PrivateStorage/EditorsPage/QuestionEditorPage/QuestionEditorStorage";
import {Button} from "@material-ui/core";
import React from "react";

export const CreateNewQuestion = observer(() =>{
    return(
        <>
            <Button variant="outlined" color="primary" className="col-12 mt-3 justify-content-center"
                    size="large" onClick={() => {QuestionEditorStorage.createNewQuestion()}}>
                Создать новый вопрос
            </Button>
        </>
    )
})