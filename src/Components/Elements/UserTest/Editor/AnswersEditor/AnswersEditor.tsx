import {observer} from "mobx-react";
import React from 'react'
import {QuestionEditorStorage} from "../../../../../Store/PrivateStorage/EditorsPage/QuestionEditorPage/QuestionEditorStorage";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Collapse, Switch} from "@material-ui/core";
import {Col, Row} from "react-bootstrap";
import {AnswerText} from "./#AnswerText";
import {AnswerHelpTextV1} from "./#AnswerHelpTextV1";
import {AnswerHelpTextV2} from "./#AnswerHelpTextV2";
import {AnswerHelpTextV3} from "./#AnswerHelpTextV3";
import {AnswerVideoUrl} from "./#AnswerVideoUrl";
import {AnswerHardLevel} from "./#AnswerHardLevel";
import {AnswerIsTrue} from "./#AnswerIsTrue";
import {AnswerCheckQueue} from "./#AnswerCheckQueue";
import {AnswerImage} from "./#AnswerImage";
import {AnswerPreview} from "./#AnswerPreview";
import {AnswerSavingNotification} from "./#AnswerSavingNotification";
import {AnswerDeleteOrDisableAnswerMenu} from "./#AnswerDeleteOrDisableAnswerMenu";
import {AnswerDeleteDialog} from "./#AnswerDeleteDialog";

export const AnswersEditor = observer(() => {
    if(!QuestionEditorStorage.questionHasBeenSelected){
        return (
            <></>
        )
    }
    return(
        <>
            <Typography className="display-4 text-center mt-3 col-12" style={{fontSize: '33px'}}>Редактировать ответы</Typography>
            {QuestionEditorStorage.answers.filter(answer => answer.isDeleted === false)?.map((answer) =>{
                return(
                    <div className="mr-2 ml-2 mt-3 " key={answer.id + "AnswerKey"}>
                        <Paper elevation={3} variant="outlined" className="ml-5 mr-5">
                            <br/>
                            <Row className="ml-5">
                                <Col>
                                    <Typography variant="h6"  color="inherit">{"ID: " + answer.id + " " + answer.text}</Typography>

                                </Col>
                                <Col className="ml-auto col-1">
                                    <AnswerDeleteOrDisableAnswerMenu answer={answer}/>
                                </Col>
                            </Row>

                            <AnswerDeleteDialog answer={answer}/>

                            <FormControlLabel
                                control={<Switch checked={answer.isEditNow}
                                                 onChange={() => answer.isEditNow = !answer.isEditNow} />}
                                label="Редактировать"
                                className="ml-5"
                            />
                            <Collapse in={answer.isEditNow}>
                                <div>
                                    <Row >
                                        <Col className="mr-5 ml-5 col-5 " >
                                            <AnswerText answer={answer}/>
                                            <AnswerHelpTextV1 answer={answer}/>
                                        </Col>
                                        <Col className="col-5 offset-1 mr-5 ml-5">
                                            <AnswerHelpTextV2 answer={answer}/>
                                            <AnswerHelpTextV3 answer={answer}/>
                                        </Col>
                                    </Row>
                                    <Row className="">
                                        <Col className="mr-5 ml-5 col-5 " >
                                            <AnswerVideoUrl answer={answer}/>
                                        </Col>
                                        <Col className="col-5 offset-1 mr-5 ml-5">
                                            <Row className="ml-1">
                                                <AnswerHardLevel answer={answer}/>
                                                <AnswerIsTrue answer={answer}/>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row className="mt-2">
                                        <Col className="col-2">
                                            <AnswerCheckQueue answer={answer}/>
                                        </Col>
                                        <Col className="col-4 mt-2 ">
                                            <AnswerImage answer={answer}/>
                                        </Col>
                                        <Col className=" offset-4 col-2 mr-5 ml-auto mt-2">
                                            <AnswerSavingNotification answer={answer}/>
                                        </Col>
                                    </Row>
                                    <AnswerPreview answer={answer}/>
                                </div>
                            </Collapse>
                            <br/>
                            <br/>
                        </Paper>
                    </div>
                )
            })}
        </>
    )
})