import {observer} from "mobx-react";
import {QuestionEditorStorage} from "../../../../../Store/PrivateStorage/EditorsPage/QuestionEditorPage/QuestionEditorStorage";
import {Button, Typography} from "@mui/material";
import {Col} from "react-bootstrap";
import React from "react";

export const ImageForQuestion = observer(() =>{
    return(
        <Col className="col-md-3  col-12">
            {QuestionEditorStorage.questionHasBeenSelected && <div>
                <Button color="primary" variant="outlined" component="label">
                    <input type="file"  hidden name="file" onChange={(fileData) => QuestionEditorStorage.uploadNewQuestionImage(fileData)} />
                    Изображение для вопроса
                </Button>
                <Typography>{ QuestionEditorStorage.QuestionImageName.length > 31 ? QuestionEditorStorage.QuestionImageName.slice(0,30) + "..." : QuestionEditorStorage.QuestionImageName}</Typography>
            </div>}
        </Col>
    )
})