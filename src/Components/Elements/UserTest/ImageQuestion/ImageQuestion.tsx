// https://image-store-iot-experemental.s3.amazonaws.com/question-images/2021/04/11/img020.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA5QESEDVQVQN6BL4P%2F20210411%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20210411T134742Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=25b7888a08c977a1b910e1feced0f9996ee5863d7b20686a4106c02580e4a777

import React, {useEffect} from 'react';
import {observer} from "mobx-react";
import {SameQuestionPlayer} from "../../../../Store/PublicStorage/QSPage/QuestionSequencePlayer/SameQuestionPlayer";
import {Row, Spinner} from "react-bootstrap";
import DCPCImageQuestion from "./DCPCImageQuestion";
import {Alert} from "@material-ui/lab";
import {Card, CardActionArea, Typography} from "@material-ui/core";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import {ArgumentAxis, BarSeries, Chart, SplineSeries, Title, ValueAxis} from "@devexpress/dx-react-chart-material-ui";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {useLocation} from "react-router-dom";

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

const processedStore = new SameQuestionPlayer(null, 85)

export const ImageQuestion = observer((props: any) => {
        const slug = useLocation();
        const classes = useStyles();
        useEffect(() => {
            if(slug?.search === "?exam=true"){
                processedStore?.changeIsUseExamMode(true)
            }

            processedStore?.changeQuestionId(props?.match?.params?.id? props?.match?.params?.id : props?.id)
        }, [props])

        useEffect(()=> {
            if(processedStore?.questionHasBeenCompleted){
                props?.questionHasBeenCompleted(true)
            }
        }, [processedStore?.questionHasBeenCompleted, props?.id])

        if(!processedStore?.answersArray?.length) {
            return (
                <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
            )
        }
        return(
            <div>
                {!processedStore?.questionHasBeenCompleted ?
                <div>
                    <DCPCImageQuestion
                        ignoreAspectRatio={true}
                        onChange1={(e) => {processedStore?.changeHardLevelOfHelpText(e.target.value)}}
                        onClick1={() => processedStore?.checkErrors()}
                        className="col-11 justify-content-center"
                        height={window.innerHeight}
                        width={window.innerWidth -100}
                        urlHasBeenPassed={true}
                        questionText={processedStore?.questionText}
                        questionImgUrl={processedStore?.questionImageUrl}
                    />

                    {processedStore?.oneTimeCheckError &&
                    processedStore?.IndexOfMostWantedError !== -1 &&
                    <div>
                        <Alert severity="warning" variant="outlined" className="mt-2">
                            {processedStore?.HelpTextForShow}
                        </Alert>
                    </div>
                    }

                    <div style={{overflowX: "scroll"}}>
                        <Row style={{width:  processedStore?.answersArray.length * 410}}>
                            {processedStore?.answersArray &&
                            <Row>
                                {processedStore?.answersArray.map((answer, aIndex) =>{
                                    return(
                                        <Card  key={aIndex} variant="outlined" elevation={2} className={classes.root}
                                               style={{backgroundColor: processedStore?.selectedAnswers?.has(answer?.id)? "#2296F3" : "",}}
                                               onClick={() =>{
                                                   processedStore.selectAnswerHandleChange(answer.id)
                                               }}>
                                            <CardActionArea>
                                                {answer.answerImageUrl?
                                                    <CardMedia
                                                        style={{opacity: processedStore?.selectedAnswers?.has(answer?.id)? 0.5 : 1}}
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
                </div>
                :
                    <div>
                        <Alert severity="info" variant="filled" className="mt-2">
                    {"Вы прошли этот вопрос.     " + "Количество попыток - " + processedStore?.numberOfPasses}
                        </Alert>
                        <Row className="justify-content-around mt-2">
                            <Chart data={processedStore?.ArrayForShowNumberOfWrongAnswers}>
                                <Title text="Количество ошибок на каждой из попыток" />
                                <ArgumentAxis showGrid={true}/>
                                <ValueAxis/>
                                <BarSeries
                                    valueField="numberOfWrongAnswers"
                                    argumentField="numberOfPasses"
                                />
                                <SplineSeries
                                    valueField="numberOfWrongAnswers"
                                    argumentField="numberOfPasses"
                                />
                            </Chart>
                            <Chart  data={processedStore?.ArrayForShowAnswerPoints}>
                                <BarSeries
                                    valueField="answerPoints"
                                    argumentField="numberOfPasses"
                                />
                                <SplineSeries
                                    valueField="answerPoints"
                                    argumentField="numberOfPasses"
                                />
                                <ArgumentAxis showGrid={true} />
                                <ValueAxis />
                                <Title text="Количество баллов на каждой из попыток" />
                            </Chart>
                        </Row>
                    </div> }

            </div>
        )
})