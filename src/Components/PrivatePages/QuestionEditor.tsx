import React from 'react'
import {Row, Spinner} from "react-bootstrap";
import {Card, CardActionArea, Typography} from "@material-ui/core";
import {QuestionEditorStorage} from "../../Store/PrivateStorage/EditorsPage/QuestionEditorPage/QuestionEditorStorage";
import {observer} from "mobx-react";
import {CreateNewQuestion} from "../Elements/UserTest/Editor/QuestionEditor/#CreateNewQuestion";
import {EditQuestionByID} from "../Elements/UserTest/Editor/QuestionEditor/EditQuestionByID";
import {QuestionFolders} from "../Elements/UserTest/Editor/QuestionEditor/#QuestionFolders";

export const QuestionEditor = observer(({...props}: any) =>{
    if (!QuestionEditorStorage.allQuestionsDataHasBeenDeliver) {
        return (<Spinner animation="border" variant="success" className=" offset-6 mt-5"/>)
    }
    if(QuestionEditorStorage.questionHasBeenSelected){
        return (
            <EditQuestionByID/>
        )
    }
    return (
        <div className="col-12">
            <CreateNewQuestion/>
            <QuestionFolders/>
            <Row className="justify-content-around">
                {QuestionEditorStorage?.QuestionArrayForDisplay
                    ?.map((question: any) =>{
                    return(
                        <Card className="mt-2" key={question.id} style={{width: 400, height: 160, textAlign: "center"}}
                              variant="outlined">
                            <CardActionArea style={{height: "100%"}}
                                            onClick={() => {
                                                QuestionEditorStorage.selectorHandleChange(question, question)
                                            }}>
                                <Typography>
                                    {"ID: " + question.id}
                                </Typography>
                                <Typography>
                                    {question?.text}
                                </Typography>
                            </CardActionArea>
                        </Card>
                    )
                })}
            </Row>
        </div>
    )
})