import Card from "@material-ui/core/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import {Button, Checkbox, FormControlLabel} from "@material-ui/core";
import React from "react";
import isMobile from "../../../../CustomHooks/isMobile";

export default function DCPCImageQuestion(props: any) {
    window.addEventListener("keydown",function (e) {
        if (e.keyCode === 114 || (e.ctrlKey && e.keyCode === 70)) {
            e.preventDefault();
        }
    })

    return <>
        {(props.height / props.width < 1 || props.ignoreAspectRatio) &&
        <Card variant="outlined"
              style={{ padding: 0,
                  maxHeight: window.innerHeight / window.innerWidth > 1 ? window.innerWidth * 2: 510,
                  overflowY: "auto",}}
              className="col-12 ">
            <Row className="justify-content-center">
                {props.questionImgUrl ?
                    <Col className={!props?.ignoreAspectRatio ? "col-6 justify-content-start":
                    window.innerHeight / window.innerWidth > 1 ? "col-12 justify-content-start" : "col-6 justify-content-start"}>
                    <CardMedia
                        className="col-12 mr-auto"
                        style={{
                            height: isMobile() ?  window.innerWidth -100 : 500,
                            backgroundSize: "contain",
                            maxHeight: isMobile() ? window.innerWidth : 500,
                            overflowY: "auto",
                            width: "100%"
                        }}
                        image={props.questionImgUrl}
                    />
                </Col> : null}
                <Col
                    className={!props?.ignoreAspectRatio ? "col-6":
                        window.innerHeight / window.innerWidth > 1 ? "col-12" : "col-6"}
                    style={{height: isMobile() ? window.innerWidth -100 : 500,
                        width: "100%"}} >
                    <div>
                        <CardContent>
                            <Typography component="h5" variant="h5">
                                Вопрос
                            </Typography>
                            <Typography variant="body1" color="textSecondary" component="p" style={{userSelect: "none", content: "Foobar"}}>
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
                            <Row className="ml-auto pb-2">
                                <Col className="col-6">
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
