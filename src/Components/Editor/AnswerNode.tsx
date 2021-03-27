import React, {useMemo, useState} from "react";
import {Col, Row} from "react-bootstrap";
import {Collapse, Fade, InputLabel, Select, Switch, TextField} from "@material-ui/core";
import {any, number} from "prop-types";
import FormControl from "@material-ui/core/FormControl";
import { MenuItem } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/Typography";

export default function AnswerNode(props: any) {
    const [text, changeText] = useState(props.answer.text)
    const [helpTextv1, changeHelpTextv1] = useState(props.answer.helpTextv1)
    const [helpTextv2, changeHelpTextv2] = useState(props.answer.helpTextv2)
    const [helpTextv3, changeHelpTextv3] = useState(props.answer.helpTextv3)
    const [videoUrl, changeVideoUrl] = useState(props.answer.videoUrl)
    const [hardLevelOfAnswer, changeHardLevelOfAnswer] = useState(props.answer.hardLevelOfAnswer)
    const [isTrue, changeIsTrue] = useState(props.answer.isTrue)
    const [showPaper, changeShowPaper] = useState(false)
    const changeTextHandle = (e: any) => {
        changeText(e.target.value)
    }
    console.log(props)
    return (
        <div className="mr-2 ml-2 mt-3 ">
            <Paper elevation={3} className="ml-5 mr-5">
                <br/>
                <Typography className="ml-5" color="textSecondary">{text}</Typography>
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
                                    key={props.answerIndex + "text"}
                                    id="standard-multiline-flexible"
                                    label="Текст вопроса"
                                    multiline
                                    fullWidth
                                    rowsMax={7}
                                    // style={{width: "50vw"}}
                                    value={text}
                                    onChange={changeTextHandle}
                                />
                                <TextField
                                    className="mt-2"
                                    key={props.answerIndex + "helpTextv1"}
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
                                    key={props.answerIndex + "helpTextv2"}
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
                                    key={props.answerIndex + "helpTextv3"}
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
                                    key={props.answerIndex + "videoUrl"}
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
                                        <MenuItem value="Hard">Каверзный</MenuItem>
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
                            <Col className="col-1 offset-1 ml-auto mr-5 mt-3">
                                <Button variant="contained" color="primary">
                                    Сохранить
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </Collapse>
                <br/>
                <br/>
            </Paper>
        </div>
    )
}
