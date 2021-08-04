import React from 'react'
import {Col, Row, Spinner} from "react-bootstrap";
import {Button, Container} from "@material-ui/core";
import {QuestionSelector} from "./#QuestionSelector"
import {QuestionEditorStorage} from "../../../../Store/PrivateStorage/EditorsPage/QuestionEditorPage/QuestionEditorStorage";
import {observer} from "mobx-react";
import {ThemeSelector} from "./#ThemeSelector";
import {AuthorSelector} from "./#AuthorSelector";
import {QuestionText} from "./#QuestionText";
import {QuestionVideoURL} from "./#QuestionVideoURL";
import {ImageForQuestion} from "./#ImageForQuestion";
import {QuestionPreview} from "./#QuestionPreview";
import {QuestionSrc} from "./#QuestionSrc";
import {SavingNotification} from "./#SavingNotification";
import {AnswersEditor} from "../AnswersEditor/AnswersEditor";
import {CreateNewAnswer} from "./#CreateNewAnswer";
import {CreateNewQuestion} from "./#CreateNewQuestion";

export const QuestionEditor = observer(({...props}: any) =>{
    if (!QuestionEditorStorage.allQuestionsDataHasBeenDeliver) {
        return (<Spinner animation="border" variant="success" className=" offset-6 mt-5"/>)
    }

    return (
        <div className="col-12">
            <CreateNewQuestion/>
            <div className="display-4 text-center mt-4" style={{fontSize: '33px'}}>Редактировать вопрос</div>
            <div className="col-8 offset-2 mt-3 ">
                <QuestionSelector/>
            </div>
            {QuestionEditorStorage.questionHasBeenSelected &&
            <Row className="mt-3">
                <Col className="col-md-6 col-11  ml-5">
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