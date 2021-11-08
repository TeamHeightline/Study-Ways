import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import {Button} from "@mui/material";
import {Form} from "react-bootstrap";
import React from "react";

export default function DCMCImageQuestion(props: any) {
    // console.log(props.width)
    return <>
        {props.height / props.width >= 1 &&
        <div>
            <Card variant="outlined" elevation={3}>
                {props.questionImgUrl && <CardMedia
                    // className="col-12"
                    style={{height: 300,}}
                    image={props.questionImgUrl}
                />}
                <div className="ml-3 mr-3 mt-2">
                    {(props.questionData?.questionById?.text || props.questionText) ?
                        <div>
                            <Typography component="h5" variant="h5">
                                Вопрос:
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
                                {props.questionData?.questionById?.text ? props.questionData?.questionById?.text : props.questionText}
                            </Typography>
                        </div> : <br/>}
                    {props.onChange &&
                    <Button
                        className="col-12 mt-4"
                        variant="outlined" color="primary" onClick={props.onClick}>
                        Назад
                    </Button>}
                    <Form.Control
                        className="col-12 mt-2"
                        // size="lg"
                        disabled={props.disabled}
                        value={props.value}
                        onChange={props.onChange1}
                        as="select">
                        <option value={"0"}>Легкий</option>
                        <option value={"1"}>Средний</option>
                        <option value={"2"}>Сложный</option>
                    </Form.Control>
                    <Button variant="contained" color="primary" className="col-12 mt-2"
                            onClick={props.onClick1}>
                        Проверить
                    </Button>
                    <br/>
                    <br/>
                </div>
            </Card>
        </div>}
    </>;
}
