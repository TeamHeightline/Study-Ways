import React, {useEffect, useState} from 'react';
import {Card, CardActionArea, Step, StepLabel, Stepper, Typography} from "@material-ui/core";
import {observer} from "mobx-react";
import {QSPlayerStore} from "../../../../Store/PublicStorage/QSPage/QuestionSequencePlayer/QSPlayerStore";
import {Col, Row, Spinner} from "react-bootstrap";
import DCPCImageQuestion from "../../UserTest/ImageQuestion/DCPCImageQuestion";
import DCAnswers from "../../UserTest/ImageQuestion/DCAnswers";
import ImageAnswerNode from "../../UserTest/ImageAnswerNode";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

const processedStore = new QSPlayerStore()

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            width: 385,
            height: 400,
            marginLeft: 20,
            marginTop: 20
        },
        media: {
            height: 240,
        },
        fullHeightMedia: {
            height: 400
        },

        details: {
            display: 'flex',
            flexDirection: 'column',
        },
        content: {
            flex: '1 0 auto',
        },
        cover: {
            width: 151,
        },


    }),
);

export  const  QSPlayerByID = observer(({...props}: any) =>{
    useEffect(() =>{processedStore.setQSID(20)}, [props?.questionSequenceID])
    const classes = useStyles();
    if(!processedStore.allDataNasBeenLoaded){
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    return(
        <div>
            <Typography className="display-4 text-center mt-4" style={{fontSize: '33px'}}>{processedStore.name}</Typography>
            <div style={{overflowY: "scroll"}}>
                <Stepper nonLinear alternativeLabel activeStep={processedStore.selectedQuestionIndex}>
                    {processedStore?.questionsStoreArray?.map((question, qIndex) => (
                        <Step key={qIndex}>
                            <StepLabel>
                                <Card style={{width: 400, height: 160, marginLeft: 65}} variant="outlined">
                                    <CardActionArea style={{height: "100%"}}
                                                    onClick={() => processedStore.changeSelectedQuestionIndex(qIndex)}>
                                        <Typography>
                                            {question?.questionText}
                                        </Typography>
                                    </CardActionArea>
                                </Card>
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </div>
            <div >
                {processedStore.selectedQuestionIndex !== null &&
                <DCPCImageQuestion
                    className="col-11 justify-content-center"
                    height={window.innerHeight}
                    width={window.innerWidth -100}
                    urlHasBeenPassed={true}
                    questionText={processedStore.questionsStoreArray[processedStore.selectedQuestionIndex].questionText}
                    questionImgUrl={processedStore.questionsStoreArray[processedStore.selectedQuestionIndex].questionImageUrl}
                    />}
            </div>
            <div style={{overflowY: "scroll"}}>
                <Row style={{width:  processedStore.questionsStoreArray[processedStore.selectedQuestionIndex]?.answersArray.length * 410}}>
                    {processedStore.selectedQuestionIndex !== null && processedStore.questionsStoreArray[processedStore.selectedQuestionIndex]?.answersArray &&
                        <Row>
                            {processedStore.questionsStoreArray[processedStore.selectedQuestionIndex]?.answersArray.map((answer, aIndex) =>{
                                return(
                                    <Card  key={aIndex} variant="outlined" elevation={2} className={classes.root}
                                          style={{backgroundColor: processedStore.questionsStoreArray[processedStore.selectedQuestionIndex]?.selectedAnswers?.has(answer?.id)? "#71c3ef" : ""}}
                                             onClick={() =>{
                                                 processedStore.questionsStoreArray[processedStore.selectedQuestionIndex].selectAnswerHandleChange(answer.id)
                                             }}>
                                    <CardActionArea>
                                        {answer.answerImageUrl?
                                            <CardMedia
                                                style={{opacity: processedStore.questionsStoreArray[processedStore.selectedQuestionIndex]?.selectedAnswers?.has(answer?.id)? 0.5 : 1}}
                                                className={answer.answerText? classes.media : classes.fullHeightMedia}
                                                image={answer.answerImageUrl}
                                            />: null}
                                        {answer.answerText &&
                                        <CardContent className="mb-5">
                                            <Typography variant="body1" color="textSecondary" component="p" className="mb-5 pb-5">
                                                {answer.answerText}
                                            </Typography>
                                        </CardContent>}
                                    </CardActionArea>
                                </Card>)
                            })}

                        </Row>}
                </Row>
            </div>
        </div>
    )
})