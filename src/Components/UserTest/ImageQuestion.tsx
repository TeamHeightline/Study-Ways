// https://image-store-iot-experemental.s3.amazonaws.com/question-images/2021/04/11/img020.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA5QESEDVQVQN6BL4P%2F20210411%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20210411T134742Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=25b7888a08c977a1b910e1feced0f9996ee5863d7b20686a4106c02580e4a777

import React, {useState} from 'react';
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
import {Form, Spinner} from "react-bootstrap";
import {Button, CardActionArea, CardActions, Grid} from "@material-ui/core";
import Row from "react-bootstrap/Row";
import {gql, useQuery} from "@apollo/client";
import * as _ from "lodash"
import ImageAnswerNode from "./ImageAnswerNode";

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
export default function ImageQuestion() {
    const classes = useStyles();
    const theme = useTheme();
    const [questionId, setQuestionId] = useState(69)
    const [answers, setAnswers] = useState<any>([{}])
    const [kolShowAnswers, setKolShowAnswers] = useState(8)
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

    if (!get_question_data){
        return (
            <div>
                <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
            </div>
        )
    }
    console.log(get_question_data)
    return (
        <div>
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
                            <Col className="col-7">
                                <CardMedia
                                    className="col-11"
                                    style={{height: 400, width: 400}}
                                    image="https://cdnimg.rg.ru/i/gallery/73f82b4b/2_a937b3ab.jpg"
                                    title="Из при веденных ниже высказываний выберите те, из которых"
                                />
                            </Col>
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
                                    <Row className="ml-auto mr-2 pb-2">
                                        <Col className="col-6">
                                            <Form.Control
                                                // size="lg"
                                                as="select">
                                                <option value={"0"}>Легкий</option>
                                                <option value={"1"}>Средний</option>
                                                <option value={"2"}>Сложный</option>
                                            </Form.Control>
                                        </Col>
                                        <Col>
                                            <Button variant="contained" color="primary">
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
                        return(<ImageAnswerNode key={answer.id} answer={answer}/>)
                    })}



                </Grid>
            </Row>
        </div>
)
}