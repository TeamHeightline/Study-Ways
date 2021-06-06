import React, {useEffect, useRef, useState} from "react";
import {Alert, Col, Row} from "react-bootstrap";
import ReactPlayer from "react-player";
import {Breadcrumbs, Button, ButtonGroup, Typography} from "@material-ui/core";
import KeyboardArrowLeftOutlinedIcon from '@material-ui/icons/KeyboardArrowLeftOutlined';
import KeyboardArrowRightOutlinedIcon from '@material-ui/icons/KeyboardArrowRightOutlined';
import KeyboardArrowDownOutlinedIcon from '@material-ui/icons/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@material-ui/icons/KeyboardArrowUpOutlined';
import {Rating} from "@material-ui/lab";
import {Cropper} from "react-cropper";
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export default function CARDS(props: any){
    const [rating, setRating] = useState<number | null>(4);
    const [crop, setCrop] = useState({ aspect: 5/3 });
    return(
        <div className="ml-5">
            <Row className="ml-2 mt-4 " >
                <Col className="col-12 col-md-8">
                    <Row>
                        <div className="display-4 text-left mr-sm-2">Заголовок карточки</div>
                        <div className="display-4 text-left mr-sm-2"  style={{fontSize: '25px'}}>12312</div>
                    </Row>
                    <Breadcrumbs aria-label="breadcrumb">
                        <Typography color="textPrimary">Глобальная тема</Typography>
                        <Typography color="textPrimary">Тема</Typography>
                        <Typography color="textPrimary">Подтема</Typography>
                        <Typography color="textPrimary">Уровень 4</Typography>
                    </Breadcrumbs>
                </Col>
                <Col   className="mt-3 col-10 col-md-3">
                    <ButtonGroup size="large" color="primary" aria-label="large outlined primary button group">
                        <Button><KeyboardArrowLeftOutlinedIcon/></Button>
                        <Button><KeyboardArrowDownOutlinedIcon/></Button>
                        <Button><KeyboardArrowUpOutlinedIcon/></Button>
                        <Button><KeyboardArrowRightOutlinedIcon/></Button>
                    </ButtonGroup>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col className="col-12 col-lg-5 ml-2 mt-4">
                    <ReactPlayer width="auto"  controls
                                 url="https://www.youtube.com/watch?v=vpMJ_rNN9vY"
                    />
                </Col>
                <Col className="col-12 col-lg-6">
                    <Alert className="blockquote" variant="light" >Много текста такрочки Много текста такрочки
                        Много текста такрочки Много текста такрочки Много текста такрочки Много текста такрочки
                        Много текста такрочки Много текста такрочки  Много текста такрочки
                        Много текста такрочки  Много текста такрочки  Много текста такрочки Много текста такрочки
                        Много текста такрочки Много текста такрочки Много текста такрочки Много текста такрочки
                    </Alert>
                    <Alert className="blockquote">На сколько эта карточка была полезна?</Alert>
                    <Rating
                        className="ml-3"
                        name="simple-controlled"
                        value={rating}
                        onChange={(event, newValue) => {
                            setRating(newValue);
                        }}
                    />
                </Col>
            </Row>
            <ReactCrop crop={crop} onChange={newCrop => setCrop(newCrop)} src="https://sun9-15.userapi.com/impg/j0sDW0LCS0xXqk9ckUq0dTAyfmOnePIfOMZtLQ/ffokBfYyyjk.jpg?size=734x979&quality=96&sign=4df79703568167cbfb441be3d23609fa&type=album"
            />
        </div>
    )
}