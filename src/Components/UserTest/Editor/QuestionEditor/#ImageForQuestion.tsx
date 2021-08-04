import {observer} from "mobx-react";
import {QuestionEditorStorage} from "../../../../Store/PrivateStorage/EditorsPage/QuestionEditorPage/QuestionEditorStorage";
import {Button} from "@material-ui/core";
import {Col} from "react-bootstrap";
import React from "react";

export const ImageForQuestion = observer(() =>{
    return(
        <Col className="col-3 ml-5">
            {QuestionEditorStorage.questionHasBeenSelected && <div>
                <Button color="primary" variant="outlined" component="label">
                    <input type="file"  hidden name="file" onChange={(fileData) => QuestionEditorStorage.uploadNewQuestionImage(fileData)} />
                    Изображение для вопроса
                </Button>
                {QuestionEditorStorage.QuestionImageName}
            </div>}
        </Col>
    )
})