import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import {Button} from "@material-ui/core";
import {Form} from "react-bootstrap";
import React from "react";

export default function DCMCImageQuestion(props: { height: number, width: number, questionImgUrl: any, questionData: any, onChange: any, onClick: () => void, disabled: any, value: any, onChange1: (event: any) => void, onClick1: () => Promise<void> }) {
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
                    {props.questionData?.questionById?.text ?
                        <div>
                            <Typography component="h5" variant="h5">
                                Вопрос:
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
                                {props.questionData?.questionById?.text}
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