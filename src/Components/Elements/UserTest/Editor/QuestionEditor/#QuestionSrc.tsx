import {observer} from "mobx-react";
import {QuestionEditorStorage} from "../../../../../Store/PrivateStorage/EditorsPage/QuestionEditorPage/QuestionEditorStorage";
import {Col} from "react-bootstrap";
import {Typography} from "@material-ui/core";
import React from "react";

export const QuestionSrc = observer(() =>{
    return(
        <>
            {QuestionEditorStorage.questionHasBeenSelected &&
            <Col className="text-center mt-2 col-6">
                <Typography variant="body2" color="textSecondary" component="p">
                    {"Ссылка на прохождение вопроса  - "}
                    <strong>https://www.sw-university.com/iq/{QuestionEditorStorage.selectedQuestionID}</strong>
                </Typography>
            </Col>}
        </>
    )
})