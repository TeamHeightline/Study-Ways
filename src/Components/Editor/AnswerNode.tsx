import React, {useMemo, useState} from "react";
import {Col, Form, Row} from "react-bootstrap";
import {Collapse, Fade, InputLabel, Select, Snackbar, Switch, TextField} from "@material-ui/core";
import {any, number} from "prop-types";
import FormControl from "@material-ui/core/FormControl";
import { MenuItem } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/Typography";
import {gql, useMutation} from "@apollo/client";
import {Alert} from "@material-ui/lab";
import {assertDirective} from "graphql";
import Input from '@material-ui/core/Input';

const UPDATE_ANSWER = gql`mutation UPDATE_ANSWER($question: ID!, $id: ID, $isTrue: Boolean, $text: String, $helpTextv1: String,
$helpTextv2: String, $helpTextv3: String, $videoUrl: String, $checkQueue: Int!, $hardLevelOfAnswer: String!){
  updateAnswer(input: {createdBy: 0, question: $question, isTrue: $isTrue, text: $text, helpTextv1: $helpTextv1, 
  helpTextv2: $helpTextv2, helpTextv3: $helpTextv3, videoUrl: $videoUrl, checkQueue: $checkQueue, 
    hardLevelOfAnswer: $hardLevelOfAnswer, id: $id}){
    errors{
      field
      messages
    }
  }
}`




export default function AnswerNode(props: any) {
    const [text, changeText] = useState(props.answer.text)
    const [helpTextv1, changeHelpTextv1] = useState(props.answer.helpTextv1)
    const [helpTextv2, changeHelpTextv2] = useState(props.answer.helpTextv2)
    const [helpTextv3, changeHelpTextv3] = useState(props.answer.helpTextv3)
    const [videoUrl, changeVideoUrl] = useState(props.answer.videoUrl)
    const [hardLevelOfAnswer, changeHardLevelOfAnswer] = useState(props.answer.hardLevelOfAnswer)
    const [isTrue, changeIsTrue] = useState(props.answer.isTrue)
    const [checkQueue, changeCheckQueue] = useState(props.answer.checkQueue)
    const [showPaper, changeShowPaper] = useState(false)
    const[ showUpdateNotification, changeShowUpdateNotification] = useState(false)

    const queueErrorProtect = () => {
        if (checkQueue.length === 0) {
            return 10
        } else {
            return checkQueue
        }
    };
    const [update_answer, {data: update_answer_data, loading: update_answer_loading}] = useMutation(UPDATE_ANSWER, {
        variables: {
            question: props.questionID,
            id: props.answer.id,
            isTrue: (isTrue == 'true' || isTrue === true), // isTrue - строковая, потому что селект возвращает только строки
            text: text,
            helpTextv1: helpTextv1,
            helpTextv2: helpTextv2,
            helpTextv3: helpTextv3,
            videoUrl: videoUrl,
            checkQueue: queueErrorProtect(),
            hardLevelOfAnswer: hardLevelOfAnswer,
        },
        onCompleted: (update_answer_data) =>{
            if (update_answer_data.updateAnswer.errors.length === 0){
                console.log("saved")
                changeShowUpdateNotification(true)
            }
        },
        onError: error => {console.log(error)
        console.log(checkQueue)}

    })
    const changeTextHandle = (e: any) => {
        changeText(e.target.value)
    }
    const updateAnswerNotificationHandleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            changeShowUpdateNotification(false)
        }
    }
    console.log(update_answer_data)
    return (
        <div className="mr-2 ml-2 mt-3 ">
            <Paper elevation={3} className="ml-5 mr-5">
                <br/>
                <Typography variant="h6" className="ml-5" color="inherit">{"ID: " + props.answer.id + " " + text}</Typography>
                 <FormControlLabel
                     control={<Switch checked={showPaper} onChange={() => changeShowPaper(!showPaper)} />}
                     label="Редактировать"
                     className="ml-5"
                 />
                <Collapse in={showPaper}>
                    <div>
                        <Row >
                            <Col className="mr-5 ml-5 col-5 " >
                                <TextField
                                    className="mt-2"
                                    key={props.answer.id + "text"}
                                    id="standard-multiline-flexible"
                                    label="Текст ответа"
                                    multiline
                                    fullWidth
                                    rowsMax={7}
                                    // style={{width: "50vw"}}
                                    value={text}
                                    onChange={changeTextHandle}
                                />
                                <TextField
                                    className="mt-2"
                                    key={props.answer.id + "helpTextv1"}
                                    id="standard-multiline-flexible"
                                    label="Подсказка для легкого уровня сложности"
                                    multiline
                                    fullWidth
                                    rowsMax={7}
                                    // style={{width: "50vw"}}
                                    value={helpTextv1}
                                    onChange={(e: any) => {
                                        changeHelpTextv1(e.target.value)
                                    }}
                                />
                            </Col>
                            <Col className="col-5 offset-1">
                                <TextField
                                    className="mt-2"
                                    key={props.answer.id + "helpTextv2"}
                                    id="standard-multiline-flexible"
                                    label="Подсказка для стандартного уровня сложности"
                                    multiline
                                    fullWidth
                                    rowsMax={7}
                                    // style={{width: "50vw"}}
                                    value={helpTextv2}
                                    onChange={(e: any) => {
                                        changeHelpTextv2(e.target.value)
                                    }}
                                />
                                <TextField
                                    className="mt-2"
                                    key={props.answer.id + "helpTextv3"}
                                    id="standard-multiline-flexible"
                                    label="Подсказка для усложненного уровня"
                                    multiline
                                    fullWidth
                                    rowsMax={7}
                                    // style={{width: "50vw"}}
                                    value={helpTextv3}
                                    onChange={(e: any) => {
                                        changeHelpTextv3(e.target.value)
                                    }}
                                />
                            </Col>

                        </Row>
                        <Row className="">
                            <Col className="mr-5 ml-5 col-5 mt-2">
                                <TextField
                                    key={props.answer.id + "videoUrl"}
                                    id="standard-multiline-flexible"
                                    label="Ссылка на видео-ответ"
                                    fullWidth
                                    rowsMax={7}
                                    // style={{width: "50vw"}}
                                    value={videoUrl}
                                    onChange={(e: any) => {
                                        changeVideoUrl(e.target.value)
                                    }}
                                />
                            </Col>
                            <Col className="col-1 offset-1 mt-2">
                                <FormControl style={{width: "220px"}}>
                                    <InputLabel id="demo-simple-select-label">Сложность ответа</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={hardLevelOfAnswer}
                                        onChange={(e) =>{changeHardLevelOfAnswer(e.target.value)}}
                                    >
                                        <MenuItem value="EASY">Очевидный</MenuItem>
                                        <MenuItem value="MEDIUM">Нормальный</MenuItem>
                                        <MenuItem value="HARD">Каверзный</MenuItem>
                                    </Select>
                                </FormControl>
                            </Col>
                            <Col className="col-1 offset-1 mt-2">
                                <FormControl style={{width: "220px"}}>
                                    <InputLabel id="demo-simple-select-label">Ответ верный/неверный</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={isTrue}
                                        onChange={(e) =>{changeIsTrue(e.target.value)}}
                                    >
                                        <MenuItem value="true">Верный</MenuItem>
                                        <MenuItem value="false">Неверный</MenuItem>
                                    </Select>
                                </FormControl>
                            </Col>
                            <Col className="col-1 offset-1  mr-5 mt-3">
                                <FormControl>
                                    <InputLabel htmlFor="formatted-text-mask-input">Очередь проверки</InputLabel>
                                    <Input

                                        value={checkQueue}
                                        onChange={(e) => {
                                            const valueWithOnlyNumber = e.target.value.replace(/[^\d]/g, '')
                                            changeCheckQueue(valueWithOnlyNumber)
                                        }}
                                        name="textmask"
                                        id="formatted-text-mask-input"

                                    />
                                </FormControl>
                            </Col>
                            <Col className="col-1 offset-1 ml-auto mr-5 mt-3">
                                <Button variant="contained" color="primary" onClick={() => {update_answer()}}>
                                    Сохранить
                                </Button>
                            </Col>
                            {update_answer_data? update_answer_data.updateAnswer.errors.length !== 0?
                                <Alert severity='error'>Ошибка при сохранение ответа</Alert>: null :null}
                        </Row>
                    </div>
                </Collapse>
                <Snackbar open={showUpdateNotification} autoHideDuration={6000} onClose={updateAnswerNotificationHandleClose}>
                    <Alert onClose={updateAnswerNotificationHandleClose} severity="success">
                        Содержание ответа обновлено
                    </Alert>
                </Snackbar>
                <br/>
                <br/>
            </Paper>
        </div>
    )
}
