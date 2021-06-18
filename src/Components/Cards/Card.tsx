import React, {useEffect, useRef, useState} from "react";
import {Alert, Col, Row, Spinner} from "react-bootstrap";
import ReactPlayer from "react-player";
import {Breadcrumbs, Button, ButtonGroup, Typography, Tooltip, Paper} from "@material-ui/core";
import KeyboardArrowLeftOutlinedIcon from '@material-ui/icons/KeyboardArrowLeftOutlined';
import KeyboardArrowRightOutlinedIcon from '@material-ui/icons/KeyboardArrowRightOutlined';
import KeyboardArrowDownOutlinedIcon from '@material-ui/icons/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@material-ui/icons/KeyboardArrowUpOutlined';
import {Rating} from "@material-ui/lab";
import {gql} from "graphql.macro";
import {useQuery} from "@apollo/client";
import MathJax from 'react-mathjax-preview'
import { Card } from 'antd';
import "../../App.css"
import CourseNavigation from "../Course/Vue/CourseNavigation";
import CourseMicroView from "../Course/Editor/CourseMicroView";


import renderHTML from 'react-render-html';

const SHOW_CARD_BY_ID = gql`
    query SHOW_CARD_BY_ID($id: ID!){
        cardById(id: $id){
            id
            videoUrl
            title
            text
            subTheme{
                name
                id
                theme{
                    id
                    name
                    globalTheme{
                        id
                        name
                    }
                }
            }
            siteUrl
            isCardUseTestInCard
            isCardUseTestBeforeCard
            isCardUseMainText
            isCardUseMainContent
            isCardUseAdditionalText
            cardContentType
            additionalText
            author{
                name
                id
            }

        }
    }`

const GET_COURSE_BY_ID = gql`
    query GET_COURSE_BY_ID($id: ID!){
        cardCourseById(id: $id){
            courseData
            id
            name
        }
    }`
const { Meta } = Card;

export default function CARDS({id, course, ...props}: any){
    const [rating, setRating] = useState<number | null>(4);
    const [cardImage, setCardImage] = useState()
    const {data: course_data} = useQuery(GET_COURSE_BY_ID, {
        variables:{
            id: course?.id
        }
    })
    const {data: card_data, refetch} = useQuery(SHOW_CARD_BY_ID, {
        variables:{
            id: props?.match?.params?.id? props?.match?.params?.id : id,
        },
        onCompleted: data => {
            if(data.cardById.cardContentType !== "A_0"){
                get_card_image()
            }
        }
    })
    useEffect(() =>{
        refetch()
    }, [id, course])
    const get_card_image = () =>{
        // https://iot-experemental.herokuapp.com/cardfiles/card?
        fetch("https://iot-experemental.herokuapp.com/cardfiles/card?id=" +  card_data.cardById?.id )
            .then((response) => response.json())
            .then((data) =>{
                try{
                    // console.log(data)
                    setCardImage(data[0].image)
                }
                catch(e){
                    console.log("Error with image distribution - " + e)
                }
            })
    }
    // console.log(card_data)
    if(!card_data ){
        return(
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    // console.log("disabledNext " + props.disabledNext)
    return(
        <div className="ml-5">
            {course && course_data &&
            <div className="ml-2">
                <CourseMicroView course={course_data.cardCourseById} buttonClick={data=>console.log(data)}
                inCardNavigationMode={true} cardPositionData={props.cardPositionData}/>
            </div>}
            {id &&
                <Button
                    className="ml-2 mt-4 "
                    variant="outlined" color="primary" onClick={() => {
                    props.onChange("goBack")}}>
                    Назад
                </Button>
            }
            <Row className="ml-2 mt-4 " >
                <Col className="col-12 col-md-8">
                    <Row>
                        <div className="display-4 text-left mr-sm-2" style={{fontSize: '35px'}}>{card_data.cardById.title}</div>
                        <div className="display-4 text-left mr-sm-2"  style={{fontSize: '15px'}}>{card_data.cardById.id}</div>
                    </Row>

                    {card_data?.cardById?.subTheme[0] && <Tooltip title={card_data?.cardById?.subTheme.map((e, eIndex) =>{
                        return(
                            <div key={eIndex+ "Tooltip"}>
                                <Typography>
                                    {e.theme?.globalTheme?.name.toString() + " / "
                                    + e?.theme?.name.toString() + " / "
                                    + e?.name.toString() }
                                    <br/>
                                </Typography>
                            </div>
                        )
                    })} >
                        <Breadcrumbs aria-label="breadcrumb">
                            <Typography color="textPrimary">{card_data?.cardById?.subTheme[0]?.theme?.globalTheme?.name}</Typography>
                            <Typography color="textPrimary">{card_data?.cardById?.subTheme[0]?.theme?.name}</Typography>
                            <Typography color="textPrimary">{card_data?.cardById?.subTheme[0]?.name}</Typography>
                            {/*<Typography color="textPrimary">Уровень 4</Typography>*/}
                        </Breadcrumbs>
                    </Tooltip> }

                    {card_data?.cardById?.author && card_data?.cardById?.author.length !==0 &&
                    <Typography color="textPrimary">{card_data?.cardById?.author.map((sameAuthor, aIndex) =>{
                        if(aIndex !== 0 ){
                            return (" | " + sameAuthor.name)
                        }
                        return(sameAuthor.name)
                    })}</Typography>}
                </Col>
                <Col className="mt-3 col-10 col-md-3">
                        {/*Если катрочка открывается из курса, то нам нужны кнопки вверх и вниз, если её открыли
                        просто как карточку из MainCardPublicView, то нам нужно только вперед и назад для перемещения
                        по id вперед и назад*/}

                        {course ?  <ButtonGroup size="large" color="primary" aria-label="group">
                            <Button onClick={ () => props.ButtonClick("Back")} disabled={props.disabledBack}>
                                <KeyboardArrowLeftOutlinedIcon/>
                            </Button>
                            <Button onClick={ () => props.ButtonClick("Down")} disabled={props.disabledDown}>
                                <KeyboardArrowDownOutlinedIcon/>
                            </Button>
                            <Button onClick={ () => props.ButtonClick("Up")} disabled={props.disabledUp}>
                                <KeyboardArrowUpOutlinedIcon/>
                            </Button>
                            <Button onClick={ () => props.ButtonClick("Next")} disabled={props.disabledNext}>
                                <KeyboardArrowRightOutlinedIcon/>
                            </Button>
                        </ButtonGroup>:
                            <ButtonGroup size="large" color="primary" aria-label="group">
                                <Button onClick={ () => props.ButtonClick("Back")}>
                                    <KeyboardArrowLeftOutlinedIcon/>
                                </Button>
                                <Button onClick={ () => props.ButtonClick("Next")}>
                                    <KeyboardArrowRightOutlinedIcon/>
                                </Button>
                            </ButtonGroup>
                        }

                </Col>
            </Row>
            <Row className="mt-1">
                <Col className="col-12 col-lg-5 ml-2 mt-4">
                    {card_data?.cardById?.cardContentType === "A_0" &&
                        <ReactPlayer width="auto" height={400} controls
                                     // url="https://www.youtube.com/watch?v=vpMJ_rNN9vY"
                                        url={card_data?.cardById?.videoUrl}
                        />
                    }
                    {(card_data?.cardById.cardContentType === "A_1" || card_data?.cardById.cardContentType === "A_2") &&
                    <div
                        className={card_data?.cardById.cardContentType === "A_1" ? "hoverImage": ""}
                        style={{backgroundImage: "url(" + cardImage + ")",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        width: "100%",
                        height: 400,
                    }}
                        onClick={() =>{
                            if(card_data?.cardById.cardContentType === "A_1"){
                                console.log("click on image")
                                window.open(card_data?.cardById.videoUrl,'_blank')
                            }
                    }}>
                    </div>}
                </Col>
                <Col className="col-12 col-lg-6">
                    {/*<Alert className="blockquote" variant="light" >*/}

                   <MathJax math={card_data?.cardById?.text}/>
                    {/*{renderHTML(card_data?.cardById?.text)}*/}

                    {/*</Alert>*/}
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
            <Alert>
                {card_data?.cardById?.additionalText}
            </Alert>

            <br/>
            <br/>
            <br/>
        </div>
    )
}