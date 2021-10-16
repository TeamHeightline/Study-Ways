import {observer} from "mobx-react";
import {Button, Typography} from "@material-ui/core";
import {QuestionEditorStorage} from "../../../../../Store/PrivateStorage/EditorsPage/QuestionEditorPage/QuestionEditorStorage";
import {Col, Row} from "react-bootstrap";
import {QuestionText} from "./#QuestionText";
import {QuestionVideoURL} from "./#QuestionVideoURL";
import {ThemeSelector} from "./#ThemeSelector";
import {AuthorSelector} from "./#AuthorSelector";
import {QuestionNumberOfShowingAnswers} from "./#QuestionNumberOfShowingAnswers";
import {ImageForQuestion} from "./#ImageForQuestion";
import {QuestionSrc} from "./#QuestionSrc";
import {SavingNotification} from "./#SavingNotification";
import {QuestionPreview} from "./#QuestionPreview";
import {AnswersEditor} from "../AnswersEditor/AnswersEditor";
import {CreateNewAnswer} from "./#CreateNewAnswer";
import React from "react";

export const EditQuestionByID = observer(() =>{
    return(
        <div>
            <Button
                className="ml-5 col-12 col-md-2 mt-2"
                variant="outlined" color="primary" onClick={() => {
                QuestionEditorStorage?.changeQuestionHasBeenSelected(false)
            }}>
                Назад
            </Button>
            <Typography className="display-4 text-center mt-4" style={{fontSize: '33px'}}>Редактировать вопрос</Typography>
            {QuestionEditorStorage?.questionHasBeenSelected &&
            <Row className="mt-3">
                <Col className="col-md-6 col-11 ml-5">
                    <div>
                        <QuestionText/>
                        <QuestionVideoURL/>
                    </div>
                </Col>
                <Col className="col-md-4  col-10 offset-md-1">
                    <div>
                        <ThemeSelector/>
                        <AuthorSelector/>
                    </div>
                </Col>
            </Row>}
            {QuestionEditorStorage?.questionHasBeenSelected &&
            <Row className="mt-2">
                <Col className="col-md-6 col-12 ml-md-5 ml-4 pr-5 pr-md-0">
                    <QuestionNumberOfShowingAnswers/>
                </Col>
            </Row>}
            <Row className="mt-2">
                <ImageForQuestion/>
                <QuestionSrc/>
                <SavingNotification/>
            </Row>
            <QuestionPreview/>
            <AnswersEditor/>
            <CreateNewAnswer/>
            <br/>
            <br/>
        </div>
    )
})