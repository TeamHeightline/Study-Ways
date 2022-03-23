import React, {useEffect} from 'react';
import {
    Alert,
    Button,
    Card,
    CardActionArea,
    CircularProgress,
    Grid,
    MenuItem,
    Select,
    Stack,
    Step,
    StepLabel,
    Stepper,
    Typography
} from "@mui/material";
import {observer} from "mobx-react";
import {QSPlayerStore} from "../../../../Store/PublicStorage/QSPage/QuestionSequencePlayer/QSPlayerStore";
import {Row} from "react-bootstrap";
import DCPCImageQuestion from "../../Question/QuestionByID/DCPCImageQuestion";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import {usePageVisibility} from 'react-page-visibility';

import {ArgumentAxis, BarSeries, Chart, SplineSeries, Title, ValueAxis} from '@devexpress/dx-react-chart-material-ui';
import {useLocation} from "react-router-dom";
import '../../../../index.css'
import {isMobileHook} from "../../../../CustomHooks/isMobileHook";
import {MainDirection} from "../../Direction/UI/MainDirection";
import {toJS} from "mobx";
import {LogInNotification} from "../../../PublicPages/Login/LogInNotification";


const processedStore = new QSPlayerStore()

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

export const QSPlayerByID = observer(({...props}: any) => {

    const slug = useLocation();
    useEffect(() => {
        if (slug.search === "?exam=true") {
            processedStore.isUseExamMode = true
        }
        processedStore.setQSID(props?.match?.params?.id ? props?.match?.params?.id : props?.id)
    }, [props])
    const isMobile = isMobileHook()

    const isVisible = usePageVisibility()

    const classes = useStyles();

    useEffect(() => {
        if (processedStore.isUseExamMode && !isVisible) {
            processedStore.activeQuestionStoreInstance.onAcceptDefeat()
        }
    }, [isVisible])

    if (!processedStore.allDataNasBeenLoaded) {
        return (
            <Stack alignItems={"center"}>
                <CircularProgress/>
            </Stack>
        )
    }
    // console.log(isVisible)

    return (
        <div>
            <LogInNotification requireShow/>
            <Typography align={"center"} variant={isMobile ? "h6" : "h4"}>{processedStore.name}</Typography>
            <div style={{overflowX: "auto"}}>
                <Stepper nonLinear alternativeLabel activeStep={processedStore.selectedQuestionIndex} sx={{pb: 2}}>
                    {processedStore?.questionsStoreArray?.map((question, qIndex) => (
                        <Step key={qIndex} onClick={() => processedStore.changeSelectedQuestionIndex(qIndex)}>
                            {!props?.notShowStepLabet ?
                                <StepLabel>
                                    <Card style={{
                                        width: 400, height: 160, marginLeft: 65,
                                        borderColor: processedStore.questionsStoreArray[qIndex]?.questionHasBeenCompleted ? "#2296F3" :
                                            processedStore.questionsStoreArray[qIndex]?.isAcceptDefeat ? "#F50057" : ""
                                    }} variant="outlined">
                                        <CardActionArea style={{height: "100%", padding: 10,}}>
                                            <Typography>
                                                {question?.questionText}
                                            </Typography>
                                        </CardActionArea>
                                    </Card>
                                </StepLabel> :
                                <StepLabel>
                                    <br/>
                                </StepLabel>
                            }
                        </Step>
                    ))}
                </Stepper>
            </div>
            {!processedStore?.activeQuestionStoreInstance?.questionHasBeenStarted &&
                <Grid container justifyContent="center" alignItems="center"
                      style={{height: isMobile ? window.innerHeight - 430 : window.innerHeight - 600}}>
                    <Grid item xs={12} md={3}>
                        <Card variant="outlined" style={{padding: 12}}>
                            <Typography variant={"h6"}>
                                Перед началом вопроса выберете уровень сложности:
                            </Typography>
                            <Select
                                style={{marginTop: 12}}
                                defaultValue={"0"}
                                label={""}
                                fullWidth
                                //Очень важно, меняем сложность в QS Store, оттуда уже передается в вопросы
                                onChange={(e) =>
                                    processedStore?.changeHardLevelOfHelpText(e.target.value)}
                                variant="outlined">
                                <MenuItem value={"0"}>Легкий</MenuItem>
                                <MenuItem value={"1"}>Средний</MenuItem>
                                <MenuItem value={"2"}>Сложный</MenuItem>
                            </Select>
                            <Button
                                onClick={() => processedStore?.setHardLevelHasBeenSelected()}
                                style={{marginTop: 12}} fullWidth variant="contained" color="primary">
                                Начать серию вопросов
                            </Button>
                        </Card>
                    </Grid>
                </Grid>
            }
            {(!processedStore.activeQuestionStoreInstance?.questionHasBeenCompleted &&
                !processedStore?.activeQuestionStoreInstance?.isAcceptDefeat) ?
                processedStore?.activeQuestionStoreInstance?.questionHasBeenStarted &&
                <div>
                    <div>
                        {processedStore.selectedQuestionIndex !== null &&
                            <DCPCImageQuestion
                                ignoreAspectRatio={true}
                                onChange1={(e) => {
                                    processedStore.activeQuestionStoreInstance?.changeHardLevelOfHelpText(e.target.value)
                                }}
                                onClick1={() => processedStore.activeQuestionStoreInstance?.checkErrors()}
                                className="col-11 justify-content-center"
                                height={window.innerHeight}
                                width={window.innerWidth - 100}
                                urlHasBeenPassed={true}
                                questionText={processedStore.activeQuestionStoreInstance?.questionText}
                                questionImgUrl={processedStore.activeQuestionStoreInstance?.questionImageUrl}
                                onAcceptDefeat={() => processedStore.activeQuestionStoreInstance.onAcceptDefeat()}
                            />}
                    </div>
                    {processedStore.activeQuestionStoreInstance?.oneTimeCheckError &&
                        processedStore.activeQuestionStoreInstance?.IndexOfMostWantedError !== -1 &&
                        <div>
                            <Alert severity="error" variant="filled" className="mt-2">
                                {processedStore.activeQuestionStoreInstance?.HelpTextForShow}
                            </Alert>
                        </div>
                    }


                    <div style={{overflowX: "scroll"}}>
                        <Stack
                            style={{width: isMobile ? "" : processedStore.activeQuestionStoreInstance?.answersArray.length * 410}}>
                            {processedStore.selectedQuestionIndex !== null && processedStore.activeQuestionStoreInstance?.answersArray &&
                                <Stack direction={isMobile ? "column" : "row"} spacing={2}
                                       sx={{
                                           height: isMobile ? processedStore.activeQuestionStoreInstance?.answersArray.length * 410 : "",
                                           pt: 2
                                       }}>
                                    {processedStore.activeQuestionStoreInstance?.answersArray.map((answer, aIndex) => {
                                        return (
                                            <Card key={aIndex} variant="outlined"
                                                  sx={{pb: 4}}
                                                  className={classes.root}
                                                  style={{backgroundColor: processedStore.activeQuestionStoreInstance?.selectedAnswers?.has(answer?.id) ? "#2296F3" : "",}}
                                                  onClick={() => {
                                                      processedStore.activeQuestionStoreInstance.selectAnswerHandleChange(answer.id)
                                                  }}>
                                                <CardActionArea>
                                                    {!answer.isImageDeleted && answer.answerImageUrl ?
                                                        <CardMedia
                                                            style={{opacity: processedStore.activeQuestionStoreInstance?.selectedAnswers?.has(answer?.id) ? 0.5 : 1}}
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
                </div> :
                processedStore?.activeQuestionStoreInstance?.questionHasBeenStarted &&
                <div>
                    <Alert severity={processedStore?.activeQuestionStoreInstance?.isAcceptDefeat ? "error" : "info"}
                           variant="filled" className="mt-2">
                        {processedStore?.activeQuestionStoreInstance?.isAcceptDefeat ?
                            "Вы сдались. " + "Количество попыток - " + processedStore?.activeQuestionStoreInstance?.numberOfPasses :
                            "Вы прошли этот вопрос. " + "Количество попыток - " + processedStore?.activeQuestionStoreInstance?.numberOfPasses}
                    </Alert>
                    <Row className="justify-content-around mt-2">
                        <Chart data={processedStore.activeQuestionStoreInstance?.ArrayForShowNumberOfWrongAnswers}>
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
                        <Chart data={processedStore.activeQuestionStoreInstance?.ArrayForShowAnswerPoints}>
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
                    {toJS(processedStore.activeQuestionStoreInstance?.dataForDirection).length &&
                        <div style={{minHeight: 250}}>
                            <MainDirection
                                directionDataProps={toJS(processedStore.activeQuestionStoreInstance?.dataForDirection)}/>
                        </div>}

                </div>}

        </div>
    );
})