import React, {useEffect} from 'react';
import {Card, CardActionArea, Step, StepLabel, Stepper, Typography} from "@material-ui/core";
import {observer} from "mobx-react";
import {QSPlayerStore} from "../../../../Store/PublicStorage/QSPage/QuestionSequencePlayer/QSPlayerStore";
import { Row, Spinner} from "react-bootstrap";
import DCPCImageQuestion from "../../UserTest/ImageQuestion/DCPCImageQuestion";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {Alert} from "@material-ui/lab";

import {EventTracker} from '@devexpress/dx-react-chart';
import { Animation } from '@devexpress/dx-react-chart';
import {
    Chart,
    BarSeries,
    Title,
    ArgumentAxis,
    ValueAxis,
} from '@devexpress/dx-react-chart-material-ui';
import {useLocation} from "react-router-dom";


const processedStore = new QSPlayerStore()

const useStyles = makeStyles(() =>
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

    const slug = useLocation();
    useEffect(() =>{
        if(slug.search === "?exam=true"){
            processedStore.isUseExamMode = true
        }
        processedStore.setQSID(props.match.params.id)
    }, [props])

    const classes = useStyles();
    if(!processedStore.allDataNasBeenLoaded){
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    // console.log(processedStore.questionsStoreArray[processedStore.selectedQuestionIndex]?.ArrayForShowAnswerPoints)
    return(
        <div>
            <Typography className="display-4 text-center mt-4" style={{fontSize: '33px'}}>{processedStore.name}</Typography>
            <div style={{overflowY: "scroll"}}>
                <Stepper nonLinear alternativeLabel activeStep={processedStore.selectedQuestionIndex}>
                    {processedStore?.questionsStoreArray?.map((question, qIndex) => (
                        <Step key={qIndex}>
                            <StepLabel>
                                <Card style={{width: 400, height: 160, marginLeft: 65,
                                borderColor: processedStore.questionsStoreArray[qIndex]?.questionHasBeenCompleted ? "#2296F3": ""}} variant="outlined">
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
            {!processedStore.questionsStoreArray[processedStore.selectedQuestionIndex]?.questionHasBeenCompleted ?
            <div>
                <div >
                    {processedStore.selectedQuestionIndex !== null &&
                    <DCPCImageQuestion
                        onChange1={(e) => {processedStore.questionsStoreArray[processedStore.selectedQuestionIndex]?.changeHardLevelOfHelpText(e.target.value)}}
                        onClick1={() => processedStore.questionsStoreArray[processedStore.selectedQuestionIndex]?.checkErrors()}
                        className="col-11 justify-content-center"
                        height={window.innerHeight}
                        width={window.innerWidth -100}
                        urlHasBeenPassed={true}
                        questionText={processedStore.questionsStoreArray[processedStore.selectedQuestionIndex]?.questionText}
                        questionImgUrl={processedStore.questionsStoreArray[processedStore.selectedQuestionIndex]?.questionImageUrl}
                        />}
                </div>
                {processedStore.questionsStoreArray[processedStore.selectedQuestionIndex]?.oneTimeCheckError &&
                processedStore.questionsStoreArray[processedStore.selectedQuestionIndex]?.IndexOfMostWantedError !== -1 &&
                    <div>
                        <Alert severity="warning" variant="outlined" className="mt-2">
                            {processedStore.questionsStoreArray[processedStore.selectedQuestionIndex]?.HelpTextForShow}
                        </Alert>
                    </div>
                }


                <div style={{overflowY: "scroll"}}>
                    <Row style={{width:  processedStore.questionsStoreArray[processedStore.selectedQuestionIndex]?.answersArray.length * 410}}>
                        {processedStore.selectedQuestionIndex !== null && processedStore.questionsStoreArray[processedStore.selectedQuestionIndex]?.answersArray &&
                            <Row>
                                {processedStore.questionsStoreArray[processedStore.selectedQuestionIndex]?.answersArray.map((answer, aIndex) =>{
                                    return(
                                        <Card  key={aIndex} variant="outlined" elevation={2} className={classes.root}
                                              style={{backgroundColor: processedStore.questionsStoreArray[processedStore.selectedQuestionIndex]?.selectedAnswers?.has(answer?.id)? "#2296F3" : "",}}
                                                 onClick={() =>{
                                                     processedStore.questionsStoreArray[processedStore.selectedQuestionIndex].selectAnswerHandleChange(answer.id)
                                                 }}>
                                        <CardActionArea>
                                            {answer.answerImageUrl?
                                                <CardMedia
                                                    style={{opacity: processedStore.questionsStoreArray[processedStore.selectedQuestionIndex]?.selectedAnswers?.has(answer?.id)? 0.5 : 1}}
                                                    className={answer?.answerText? classes.media : classes.fullHeightMedia}
                                                    image={answer?.answerImageUrl}
                                                />: null}
                                            {answer?.answerText &&
                                            <CardContent className="mb-5">
                                                <Typography variant="body1" color="textSecondary" component="p" className="mb-5 pb-5">
                                                    {answer?.answerText}
                                                </Typography>
                                            </CardContent>}
                                        </CardActionArea>
                                    </Card>)
                                })}

                            </Row>}
                    </Row>
                </div>
            </div>:
                <div>
                  <Alert severity="info" variant="filled" className="mt-2">
                      {"Вы прошли этот вопрос.     " + "Количество попыток - " + processedStore.questionsStoreArray[processedStore.selectedQuestionIndex].numberOfPasses}
                  </Alert>
                    <Row className="justify-content-around mt-2">
                            <Chart data={processedStore.questionsStoreArray[processedStore.selectedQuestionIndex]?.ArrayForShowNumberOfWrongAnswers}>
                                <Title text="Количество ошибок на каждой из попыток" />
                                <ArgumentAxis />
                                <ValueAxis showGrid={false} />
                                <BarSeries
                                    barWidth={300}
                                    valueField="numberOfWrongAnswers"
                                    argumentField="numberOfPasses"
                                />
                                <EventTracker />
                                <Animation />
                            </Chart>
                            <Chart data={processedStore.questionsStoreArray[processedStore.selectedQuestionIndex]?.ArrayForShowAnswerPoints}>
                                <BarSeries
                                    valueField="answerPoints"
                                    argumentField="numberOfPasses"
                                />
                                <ArgumentAxis/>
                                <ValueAxis/>
                                <Title text="Количество баллов на каждой из попыток" />
                                <Animation />
                            </Chart>
                    </Row>

                </div> }

            </div>

    )
})