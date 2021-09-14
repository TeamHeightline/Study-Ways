import {observer} from "mobx-react";
import {QuestionEditorStorage} from "../../../../../Store/PrivateStorage/EditorsPage/QuestionEditorPage/QuestionEditorStorage";
import {Col} from "react-bootstrap";
import {Typography} from "@material-ui/core";
import React from "react";

export const QuestionSrc = observer(() =>{
    return(
        <>
            {QuestionEditorStorage.questionHasBeenSelected &&
            <Col className="text-center mt-2 col-md-6 col-12">
                <Typography variant="body2" color="textSecondary" component="p">
                    {"Режим обучения  - "}
                    <strong>https://www.sw-university.com/iq/{QuestionEditorStorage.selectedQuestionID}</strong>
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    {"Режим экзамена  - "}
                    <strong>https://www.sw-university.com/iq/{QuestionEditorStorage.selectedQuestionID}?exam=true</strong>
                </Typography>
            </Col>}
        </>
    )
})