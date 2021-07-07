import Card from "@material-ui/core/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import {Button, ButtonGroup} from "@material-ui/core";
import {Form} from "react-bootstrap";
import React from "react";

export default function DCPCImageQuestion(props: { height: number, width: number, urlHasBeenPassed: boolean, questionImgUrl: any, questionData: any, id: any, onChange: any, onClick: () => void, disabled: any, value: any, onChange1: (event: any) => void, onClick1: () => Promise<void>, canSwitchToPreviousQuestion: any, onClick2: () => void, canSwitchToNextQuestion: any, onClick3: () => void }) {
    return <>
        {props.height / props.width < 1 &&
        <Card style={{height: props.width >1400 ? 500: 400, padding: 0, overflowY: "scroll", minWidth: "1000px"}} className="col-12 ">
            <Row className="justify-content-center">
                {props.urlHasBeenPassed && props.questionImgUrl ? <Col className="col-6">
                    <CardMedia
                        className="col-12"
                        style={{height: props.width >1400 ? 500: 400, width: "100%"}}
                        image={props.questionImgUrl}
                    />
                </Col> : null}
                <Col>
                    <div>
                        <CardContent>
                            <Typography component="h5" variant="h5">
                                Вопрос
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
                                {props.questionData?.questionById?.text}

                            </Typography>
                        </CardContent>
                        {props.id && props.onChange &&
                        <div className="col-12">
                            <Button
                                variant="outlined" color="primary" onClick={props.onClick}>
                                Назад
                            </Button>
                        </div>
                        }
                        <div  style={{maxWidth:"600px"}}>
                            <Row className="ml-auto  pb-2 ">
                                <Col className="col-6">
                                    <Form.Control
                                        disabled={props.disabled}
                                        // size="lg"
                                        value={props.value}
                                        onChange={props.onChange1}
                                        as="select">
                                        <option value={"0"}>Легкий</option>
                                        <option value={"1"}>Средний</option>
                                        <option value={"2"}>Сложный</option>
                                    </Form.Control>
                                </Col>
                                <Col className="col-3">
                                    <Button variant="contained" color="primary" onClick={props.onClick1}>
                                        Проверить
                                    </Button>
                                </Col>
                                {props.disabled &&
                                <ButtonGroup className="ml-3 mt-2" size="large" color="primary"
                                             aria-label="large outlined">
                                    <Button disabled={!props.canSwitchToPreviousQuestion}
                                            onClick={props.onClick2}>
                                        Назад
                                    </Button>
                                    <Button disabled={!props.canSwitchToNextQuestion}
                                            onClick={props.onClick3}>
                                        Вперед
                                    </Button>
                                </ButtonGroup>}
                            </Row>
                        </div>
                    </div>

                </Col>
            </Row>
        </Card>}
    </>;
}
