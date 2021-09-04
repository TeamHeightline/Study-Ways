import Card from "@material-ui/core/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import {Button, Checkbox, FormControlLabel} from "@material-ui/core";
import {Form} from "react-bootstrap";
import React from "react";

export default function DCPCImageQuestion(props: any) {
    window.addEventListener("keydown",function (e) {
        if (e.keyCode === 114 || (e.ctrlKey && e.keyCode === 70)) {
            e.preventDefault();
        }
    })

    return <>
        {props.height / props.width < 1 &&
        <Card variant="outlined" style={{height: props.width >1400 ? 500: 400, padding: 0,}} className="col-12 ">
            <Row className="justify-content-center">
                {props.questionImgUrl ? <Col className="col-6">
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
                            <Typography variant="body1" color="textSecondary" component="p" style={{userSelect: "none"}}>
                                {props.questionData?.questionById?.text ? props.questionData?.questionById?.text : props.questionText}
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
                            </Row>
                        </div>
                    </div>

                </Col>
            </Row>
        </Card>}
        {props.showNotUseScrollbarCheckbox &&
        <FormControlLabel
            control={
                <Checkbox
                    checked={props.isNotUseScrollbar}
                    onChange={(e) => props.setIsNotUseScrollbar(e.target.checked)}
                    color="primary"
                />
            }
            label="Использовать ScrollBar"
        />}
    </>;
}
