// https://image-store-iot-experemental.s3.amazonaws.com/question-images/2021/04/11/img020.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA5QESEDVQVQN6BL4P%2F20210411%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20210411T134742Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=25b7888a08c977a1b910e1feced0f9996ee5863d7b20686a4106c02580e4a777

import React, {useEffect, useState} from 'react';
import {observer} from "mobx-react";
import {SameQuestionPlayer} from "../../../../Store/PublicStorage/QSPage/QuestionSequencePlayer/SameQuestionPlayer";
import {Row, Spinner} from "react-bootstrap";
import DCPCImageQuestion from "./DCPCImageQuestion";
import {Alert, Stack} from '@mui/material';
import {Button, Card, CardActionArea, Grid, MenuItem, Select, Typography} from "@mui/material";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import {ArgumentAxis, BarSeries, Chart, SplineSeries, Title, ValueAxis} from "@devexpress/dx-react-chart-material-ui";
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import {useLocation} from "react-router-dom";
import {isMobileHook} from "../../../../CustomHooks/isMobileHook";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            width: 385,
            height: 400,
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

export const ImageQuestion = observer((props: any) => {
    const slug = useLocation();
    const classes = useStyles();
    const isMobile = isMobileHook()

    const [processedStore, setProcessedStore] = useState(new SameQuestionPlayer(null, undefined))

    useEffect(() => {
        if (slug?.search === "?exam=true") {
            processedStore?.changeIsUseExamMode(true)
        }

        processedStore?.changeQuestionId(props?.match?.params?.id ? props?.match?.params?.id : props?.id)
    }, [props])

    useEffect(() => {
        if (processedStore?.questionHasBeenCompleted) {
            if (props?.questionHasBeenCompleted) {
                props?.questionHasBeenCompleted(true)
            }
        }
    }, [processedStore?.questionHasBeenCompleted, props?.id])

    const restartQuestion = () => {
        const questionID = props?.match?.params?.id ? props?.match?.params?.id : props?.id
        setProcessedStore(new SameQuestionPlayer(null, questionID))
    }

    if (!processedStore?.answersArray?.length) {
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    return (
        <Stack justifyContent={"center"} direction={"column"}>
            {!processedStore?.questionHasBeenStarted &&
                <Grid container justifyContent="center" alignItems="center"
                      style={{height: isMobile ? window.innerHeight - 100 : window.innerHeight - 300}}>
                    <Grid item xs={12} md={3}>
                        <Card variant="outlined" style={{padding: 12}}>
                            <Typography align={"center"} variant="h5">
                                Перед началом вопроса выберете уровень сложности:
                            </Typography>
                            <Select
                                style={{marginTop: 12}}
                                defaultValue={"0"}
                                fullWidth
                                label={""}
                                onChange={(e) => processedStore?.changeHardLevelOfHelpText(e.target.value)}
                                variant="outlined">
                                <MenuItem value={"0"}>Легкий</MenuItem>
                                <MenuItem value={"1"}>Средний</MenuItem>
                                <MenuItem value={"2"}>Сложный</MenuItem>
                            </Select>
                            <Button
                                onClick={() => processedStore.startQuestion()}
                                style={{marginTop: 12}} fullWidth variant="contained" color="primary">
                                Начать вопрос
                            </Button>
                        </Card>
                    </Grid>
                </Grid>
            }
            {(!processedStore?.questionHasBeenCompleted && !processedStore?.isAcceptDefeat) ?
                processedStore?.questionHasBeenStarted &&
                <div>
                    <DCPCImageQuestion
                        ignoreAspectRatio={true}
                        onChange1={(e) => {
                            processedStore?.changeHardLevelOfHelpText(e.target.value)
                        }}
                        onClick1={() => processedStore?.checkErrors()}
                        height={window.innerHeight}
                        width={window.innerWidth - 100}
                        urlHasBeenPassed={true}
                        questionText={processedStore?.questionText}
                        questionImgUrl={processedStore?.questionImageUrl}
                        onAcceptDefeat={() => processedStore.onAcceptDefeat()}
                    />

                    {processedStore?.oneTimeCheckError &&
                        processedStore?.IndexOfMostWantedError !== -1 &&
                        <div>
                            <Alert severity="error" variant="filled" className="mt-2">
                                {processedStore?.HelpTextForShow}
                            </Alert>
                        </div>
                    }

                    <div style={{overflowX: "scroll"}}>
                        {/*<Row style={{width:  processedStore?.answersArray.length * 410}}>*/}
                        <Stack
                            style={{width: isMobile ? "" : processedStore?.answersArray.length * 410}}>
                            {processedStore?.answersArray &&
                                <Stack direction={isMobile ? "column" : "row"} spacing={2}
                                       sx={{height: isMobile ? processedStore?.answersArray * 410 : "", pt: 2}}>
                                    {processedStore?.answersArray.map((answer, aIndex) => {
                                        return (
                                            <Card key={aIndex} variant="outlined" className={classes.root}
                                                  style={{backgroundColor: processedStore?.selectedAnswers?.has(answer?.id) ? "#2296F3" : "",}}
                                                  onClick={() => {
                                                      processedStore.selectAnswerHandleChange(answer.id)
                                                  }}>
                                                <CardActionArea>
                                                    {!answer.isImageDeleted && answer.answerImageUrl ?
                                                        <CardMedia
                                                            style={{opacity: processedStore?.selectedAnswers?.has(answer?.id) ? 0.5 : 1}}
                                                            className={answer?.answerText ? classes.media : classes.fullHeightMedia}
                                                            image={answer?.answerImageUrl}
                                                        /> : null}
                                                    {answer?.answerText &&
                                                        <CardContent className="mb-5">
                                                            <Typography variant="body1" color="textSecondary"
                                                                        component="p" className="mb-5 pb-5">
                                                                {answer?.answerText}
                                                            </Typography>
                                                        </CardContent>}
                                                </CardActionArea>
                                            </Card>)
                                    })}

                                </Stack>}
                        </Stack>
                    </div>
                </div>
                : processedStore?.questionHasBeenStarted &&
                <div>
                    <Alert severity={processedStore?.isAcceptDefeat ? "error" : "info"} variant="filled"
                           className="mt-2">
                        {processedStore?.isAcceptDefeat ? "Вы сдались.     " +
                            "Количество попыток - " + processedStore?.numberOfPasses :
                            "Вы прошли этот вопрос.     " +
                            "Количество попыток - " + processedStore?.numberOfPasses}
                    </Alert>
                    <Stack alignItems={"center"} sx={{pt: 2}}>
                        <Button variant={"contained"} color="primary" onClick={restartQuestion}>
                            Пройти тест заново
                        </Button>
                    </Stack>
                    <Row className="justify-content-around mt-2">
                        <Chart data={processedStore?.ArrayForShowNumberOfWrongAnswers}>
                            <Title text="Количество ошибок на каждой из попыток"/>
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
                        <Chart data={processedStore?.ArrayForShowAnswerPoints}>
                            <BarSeries
                                valueField="answerPoints"
                                argumentField="numberOfPasses"
                            />
                            <SplineSeries
                                valueField="answerPoints"
                                argumentField="numberOfPasses"
                            />
                            <ArgumentAxis showGrid={true}/>
                            <ValueAxis/>
                            <Title text="Количество баллов на каждой из попыток"/>
                        </Chart>
                    </Row>
                </div>}

        </Stack>
    );
})