// https://image-store-iot-experemental.s3.amazonaws.com/question-images/2021/04/11/img020.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA5QESEDVQVQN6BL4P%2F20210411%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20210411T134742Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=25b7888a08c977a1b910e1feced0f9996ee5863d7b20686a4106c02580e4a777

import React, {useEffect, useState} from 'react';
import {Theme, createStyles, makeStyles, useTheme} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import Col from "react-bootstrap/Col";
import {Accordion, Container, Form, Spinner} from "react-bootstrap";
import BootstrapCard from "react-bootstrap/Card"
import {Button, CardActionArea, CardActions, Grid} from "@material-ui/core";
import Row from "react-bootstrap/Row";
import {gql, useMutation, useQuery} from "@apollo/client";
import * as _ from "lodash"
import ImageAnswerNode from "./ImageAnswerNode";
import axios from "axios";
import {Alert} from "@material-ui/lab";
import AlertTitle from "@material-ui/lab/AlertTitle";
import ReactPlayer from "react-player";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            width: 385,
            height: 400,
            // paddingBottom: '200px'

        },
        media: {
            height: 240,

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
        controls: {
            display: 'flex',
            alignItems: 'center',
            paddingLeft: theme.spacing(1),
            paddingBottom: theme.spacing(1),
        },
        playIcon: {
            height: 38,
            width: 38,
        },

    }),
);
const GET_QUESTION_DATA = gql`
      query GET_QUESTION_DATA($id: ID!) {
            questionById(id: $id){
             questionstatistic{
                  id
                  numberOfPasses
                  sumOfAllAttempts
                }
              text
              videoUrl
              id
              answers{
                id
                isTrue
                text
                helpTextv1
                helpTextv2
                helpTextv3
                videoUrl
                checkQueue
                hardLevelOfAnswer
              }
            }
      }
    `

const STATISTIC = gql`
mutation STATISTIC_FOR_QUESTION($questionID: ID!, $numberOfPasses: Int!, $sumOfAllAttempts: Int!, $id: ID){
  statistic(input:{question:$questionID, numberOfPasses: $numberOfPasses, sumOfAllAttempts: $sumOfAllAttempts, id: $id}){
    errors{
      field
      messages
    }
  }
}`

export default function ImageQuestion(props: any) {
    const classes = useStyles();
    const theme = useTheme();
    const questionId = props?.match?.params?.id? props.match.params.id: props.id
    const [helpLevel, changeHelpLevel] = useState(props?.helpLevel? props.helpLevel: "0");
    const [answers, setAnswers] = useState<any>([{}])
    const [kolShowAnswers, setKolShowAnswers] = useState(8)
    const [questionImgUrl, setQuestionImgUrl] = useState<any>('')
    const [urlHasBeenPassed, setUrlHasBeenPassed] = useState(false)
    const [selected, changeSelected] = useState<number[]>([])
    const [activeWrongQuestionId, changeActiveWrongQuestionId] = useState(-10)
    const [activeWrongAnswerIndex, changeActiveWrongAnswerIndex] = useState(-10)
    const [errorArray, changeErrorArray] = useState<any[]>([])
    const [tryingCalculation, changeTryingCalculation] = useState(0)
    const [oneTimePusshCheckErrorButton, changeOneTimePusshCheckErrorButton] = useState(false)

    const {
        data: get_question_data, loading: get_question_loading, error: get_question_error, refetch: refetch_get_question
    } = useQuery(GET_QUESTION_DATA, {
            variables: {
                id: questionId
            },
            onCompleted: get_question_data => {
                let ans = get_question_data.questionById.answers;
                ans = _.shuffle(ans);
                const trueAns = _.shuffle(_.filter(ans, {isTrue: true}));
                const wrongAns = _.filter(ans, {isTrue: false}).slice(0, kolShowAnswers - trueAns.length);
                const trueAndWrongAnswer = [...trueAns, ...wrongAns]
                setAnswers(_.shuffle(trueAndWrongAnswer))
            }
        }
    );
    useEffect( () => {
        const fetchData = async () => {
            const data = await axios("https://iot-experemental.herokuapp.com/files/question?id=" + questionId)
            try {
                setUrlHasBeenPassed(true)
                setQuestionImgUrl(data.data[0].image)
            }catch (e) {
                console.log(e)
            }
        }
        fetchData()

    }, []);
    const [update_statistic, {data: update_statistic_data, loading: update_statistic_loading}] = useMutation(STATISTIC, {
        variables: {
            id: get_question_data?.questionById?.questionstatistic?.id,
            questionID: questionId,
            numberOfPasses: get_question_data?.questionById?.questionstatistic?.numberOfPasses ? get_question_data?.questionById?.questionstatistic?.numberOfPasses + 1: 1,
            sumOfAllAttempts:get_question_data?.questionById?.questionstatistic?.sumOfAllAttempts ? get_question_data?.questionById?.questionstatistic?.sumOfAllAttempts + tryingCalculation: tryingCalculation
        },
        onCompleted: data => console.log(data),
        onError: error => console.log(error)
    })


    async function checkErrors() {
        if (selected.length !== 0){
            changeOneTimePusshCheckErrorButton(true)
            changeTryingCalculation(tryingCalculation + 1)
            await changeErrorArray([])
            const oErrArr: any[] = []
            let minCheckQueue = 10000000000000000000000
            let ActiveWrongAnswerIndexLet = activeWrongAnswerIndex
            answers.map((question: any, Index: number) => {
                if ((question.isTrue && (selected.indexOf(question.id) === -1)) || (!question.isTrue && (selected.indexOf(question.id) !== -1))) {
                    // console.log(question)
                    if (question.checkQueue < minCheckQueue) {
                        // changeActiveWrongQuestionId(question.id)
                        minCheckQueue = question.checkQueue
                        ActiveWrongAnswerIndexLet = Index
                    }
                    oErrArr.push(question.id)
                }

            })
            if (oErrArr.length === 0){
                update_statistic()
            }
            changeActiveWrongAnswerIndex(ActiveWrongAnswerIndexLet)
            changeErrorArray(oErrArr)
        }
    }
    const onChangeHelpLevel = (event: any) => changeHelpLevel(event.target.value);

    function selectDeselectAnswer(id: any) {
        if (selected.indexOf(id) === -1) {
            const oldSelected = selected
            oldSelected.push(id)
            changeSelected(oldSelected)
        } else {
            const oldSelected = selected
            oldSelected.splice(selected.indexOf(id), 1)
            changeSelected(oldSelected)
        }

    }

    if (!get_question_data){
        return (
            <div>
                <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
            </div>
        )
    }

    if (errorArray.length === 0 && oneTimePusshCheckErrorButton) {
        return (
            <Container className="mt-5">
                <Alert severity="success">
                    <AlertTitle>Поздравляем</AlertTitle>
                    Вы успешно прошли тест, колличество попыток - <strong>{tryingCalculation}</strong>
                </Alert>
            </Container>
        )
    }
    const checkurl = (url: any) => url ? url.replace("http://", "").replace("https://", "").replace("www.", "")
        .replace("youtu.be/", "youtube.com?v=").replace("youtube.com/watch?v=", "youtube.com?v=").slice(0, 14) === "youtube.com?v=" : false;

    // console.log(get_question_data?.questionById?.questionstatistic?.numberOfPasses)
    // console.log(get_question_data?.questionById?.questionstatistic?.sumOfAllAttempts)
    return (
        <div>
            <Grid className="col-8 offset-2 mt-2">
            {errorArray.length !== 0 ? <div>
                {helpLevel === "0" ? <Alert severity="error" variant="outlined">
                    {answers[activeWrongAnswerIndex].helpTextv1}</Alert> : null}
                {helpLevel === "1" ? <Alert severity="error" variant="outlined">
                    {answers[activeWrongAnswerIndex].helpTextv2}</Alert> : null}
                {helpLevel === "2" ? <Alert severity="error" variant="outlined">
                    {answers[activeWrongAnswerIndex].helpTextv3}</Alert> : null}
                {answers[activeWrongAnswerIndex].videoUrl ?
                    <div>
                        {checkurl(answers[activeWrongAnswerIndex].videoUrl) ?
                            <Accordion>
                                <BootstrapCard>
                                    <BootstrapCard.Header>
                                        <Accordion.Toggle as={Button} eventKey="1">
                                            Отобразить видео подсказку
                                        </Accordion.Toggle>
                                    </BootstrapCard.Header>
                                    <Accordion.Collapse eventKey="1">
                                        <ReactPlayer url={answers[activeWrongAnswerIndex].videoUrl}
                                                     controls autoPlay={true}/>
                                    </Accordion.Collapse>
                                </BootstrapCard>
                            </Accordion> : null}
                    </div> : null}
            </div> : null}
            </Grid>

            <Row className="">
                <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                >
                <div className="col-5 ml-2 mt-3">
                    <Card style={{height: 400, width: 780}}>
                        <Row>
                            {urlHasBeenPassed && questionImgUrl? <Col className="col-7">
                                <CardMedia
                                    className="col-11"
                                    style={{height: 400, width: 400}}
                                    image={questionImgUrl}
                                    title="Из при веденных ниже высказываний выберите те, из которых"
                                />
                            </Col>: null}

                            <Col >
                                <div>
                                    <CardContent >
                                        <Typography component="h5" variant="h5">
                                            Вопрос
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" component="p">
                                            {get_question_data?.questionById?.text}

                                        </Typography>
                                    </CardContent>
                                    {props.id? <div className="col-1">
                                        <Button variant="outlined" color="primary" onClick={() => {
                                            props.onChange("goBack")
                                        }}>
                                            Назад
                                        </Button>
                                    </div>: null}
                                    <Row className="ml-auto mr-2 pb-2">

                                        <Col className="col-6">
                                            <Form.Control
                                                // size="lg"
                                                value={helpLevel}
                                                onChange={onChangeHelpLevel}
                                                as="select">
                                                <option value={"0"}>Легкий</option>
                                                <option value={"1"}>Средний</option>
                                                <option value={"2"}>Сложный</option>
                                            </Form.Control>
                                        </Col>
                                        <Col>
                                            <Button variant="contained" color="primary" onClick={() => checkErrors()}>
                                                Проверить
                                            </Button>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </div>
                    {answers.map((answer, answerIndex) =>{
                        return(<ImageAnswerNode
                            answerIndex={answerIndex}
                            key={answer.id + "answer node"}
                            answer={answer}
                            selected={selected}
                            onChange={(e) =>{
                            selectDeselectAnswer(e)}}/>)
                    })}
                </Grid>
            </Row>
        </div>
)
}