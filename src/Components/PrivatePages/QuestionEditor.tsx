import React from 'react'
import {Col, Row, Spinner} from "react-bootstrap";
import {Typography} from "@material-ui/core";
import {QuestionSelector} from "../Elements/UserTest/Editor/QuestionEditor/#QuestionSelector"
import {QuestionEditorStorage} from "../../Store/PrivateStorage/EditorsPage/QuestionEditorPage/QuestionEditorStorage";
import {observer} from "mobx-react";
import {ThemeSelector} from "../Elements/UserTest/Editor/QuestionEditor/#ThemeSelector";
import {AuthorSelector} from "../Elements/UserTest/Editor/QuestionEditor/#AuthorSelector";
import {QuestionText} from "../Elements/UserTest/Editor/QuestionEditor/#QuestionText";
import {QuestionVideoURL} from "../Elements/UserTest/Editor/QuestionEditor/#QuestionVideoURL";
import {ImageForQuestion} from "../Elements/UserTest/Editor/QuestionEditor/#ImageForQuestion";
import {QuestionPreview} from "../Elements/UserTest/Editor/QuestionEditor/#QuestionPreview";
import {QuestionSrc} from "../Elements/UserTest/Editor/QuestionEditor/#QuestionSrc";
import {SavingNotification} from "../Elements/UserTest/Editor/QuestionEditor/#SavingNotification";
import {AnswersEditor} from "../Elements/UserTest/Editor/AnswersEditor/AnswersEditor";
import {CreateNewAnswer} from "../Elements/UserTest/Editor/QuestionEditor/#CreateNewAnswer";
import {CreateNewQuestion} from "../Elements/UserTest/Editor/QuestionEditor/#CreateNewQuestion";
import {QuestionNumberOfShowingAnswers} from "../Elements/UserTest/Editor/QuestionEditor/#QuestionNumberOfShowingAnswers";

export const QuestionEditor = observer(({...props}: any) =>{
    if (!QuestionEditorStorage.allQuestionsDataHasBeenDeliver) {
        return (<Spinner animation="border" variant="success" className=" offset-6 mt-5"/>)
    }

    return (
        <div className="col-12">
            <CreateNewQuestion/>
            <Typography className="display-4 text-center mt-4" style={{fontSize: '33px'}}>Редактировать вопрос</Typography>
            <div className="col-8 offset-2 mt-3 ">
                <QuestionSelector/>
            </div>
            {QuestionEditorStorage?.questionHasBeenSelected &&
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
            {QuestionEditorStorage?.questionHasBeenSelected &&
            <Row className="mt-2">
                <Col className="col-6 ml-5">
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