import React, {useEffect, useState} from "react";
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
import "../../../App.css"
import CourseMicroView from "../Course/Editor/CourseMicroView";


import useWindowDimensions from "../../../CustomHooks/useWindowDimensions";
import {CoursePageStorage} from "../../../Store/PublicStorage/CoursePage/CoursePageStorage";
import {observer} from "mobx-react";
import {CardPageStorage} from "../../../Store/PublicStorage/CardsPage/CardPageStorage";

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

// const { Meta } = Card;

export const CARD = observer(({id, ...props}: any) =>{
    const [rating, setRating] = useState<number | null>(4);
    const [cardImage, setCardImage] = useState()
    const {width, height} = useWindowDimensions()
    const {data: card_data, refetch} = useQuery(SHOW_CARD_BY_ID, {
        variables:{
            id: props?.openFromCourse? CoursePageStorage.selectedCardID : CardPageStorage.selectedCardID,
        },
        onCompleted: data => {
            if(data.cardById.cardContentType !== "A_0"){
                get_card_image()
            }
        }
    })
    useEffect(() =>{
        refetch()
    }, [id,])
    const get_card_image = () =>{
        // https://iot-experemental.herokuapp.com/cardfiles/card?
        fetch("https://iot-experemental.herokuapp.com/cardfiles/card?id=" +
            Number(props?.openFromCourse? CoursePageStorage.selectedCardID : CardPageStorage.selectedCardID))
            .then((response) => response.json())
            .then((data) =>{
                try{
                    // console.log(data)
                    setCardImage(data[0].image)
                }
                catch(e){
                    void(0)
                }
            })
    }

    // console.log("disabledNext " + props.disabledNext)
    return(
        <div className="ml-lg-5 col-12 mr-2 ml-2">
                <Button
                    className="ml-lg-2 mt-4  col-12 col-lg-2 mr-2"
                    variant="outlined" color="primary"
                    onClick={ () => {
                        if(props?.openFromCourse){
                            CoursePageStorage.goBackButtonHandler()
                        }else{
                            CardPageStorage.isOpenCard = false
                        }
                    }}>
                    Назад
                </Button>
            {props.openFromCourse &&
            <div className="ml-2 mt-4" style={{overflowY: "scroll"}}>
                <CourseMicroView course={CoursePageStorage.courseArr[CoursePageStorage.positionData.courseIndex]}
                                 buttonClick={data=>CoursePageStorage.cardSelectInCourseByMouseClick(data,
                                     CoursePageStorage.positionData.courseIndex, CoursePageStorage.positionData.courseID)}
                                 cardPositionData={CoursePageStorage.positionData}/>
            </div>}
            <div className="mt-3 col-lg-3 col-12">
                {/*Если катрочка открывается из курса, то нам нужны кнопки вверх и вниз, если её открыли
                    просто как карточку из MainCardPublicView, то нам нужно только вперед и назад для перемещения
                    по id вперед и назад*/}
                {props.openFromCourse ?  <ButtonGroup size="large" color="primary" aria-label="group">
                        <Button onClick={ () => CoursePageStorage.inCardButtonClickedHandler("Back")} disabled={CoursePageStorage.disabledBack}>
                            <KeyboardArrowLeftOutlinedIcon/>
                        </Button>
                        <Button onClick={ () => CoursePageStorage.inCardButtonClickedHandler("Down")} disabled={CoursePageStorage.disabledDown}>
                            <KeyboardArrowDownOutlinedIcon/>
                        </Button>
                        <Button onClick={ () => CoursePageStorage.inCardButtonClickedHandler("Up")} disabled={CoursePageStorage.disabledUp}>
                            <KeyboardArrowUpOutlinedIcon/>
                        </Button>
                        <Button onClick={ () => CoursePageStorage.inCardButtonClickedHandler("Next")} disabled={CoursePageStorage.disabledNext}>
                            <KeyboardArrowRightOutlinedIcon/>
                        </Button>
                    </ButtonGroup>:
                    <ButtonGroup size="large" color="primary" aria-label="group">
                        <Button onClick={ () => CardPageStorage.selectedCardID = CardPageStorage.selectedCardID - 1}>
                            <KeyboardArrowLeftOutlinedIcon/>
                        </Button>
                        <Button onClick={ () => CardPageStorage.selectedCardID = Number(CardPageStorage.selectedCardID) + 1}>
                            <KeyboardArrowRightOutlinedIcon/>
                        </Button>
                    </ButtonGroup>
                }
            </div>
            {!card_data ? <Spinner animation="border" variant="success" className=" offset-6 mt-5"/> :
            <div>
                <Row className="ml-2 mt-4 " >
                    <Col className="col-12">
                        <Row>
                            <Typography className="display-4 text-left mr-sm-2" style={{fontSize: '35px'}}>{card_data.cardById.title}</Typography>
                            <Typography className="display-4 text-left mr-sm-2"  style={{fontSize: '15px'}}>{card_data.cardById.id}</Typography>
                        </Row>

                        {card_data?.cardById?.subTheme[0] &&
                        <Tooltip title={card_data?.cardById?.subTheme.map((e, eIndex) =>{
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
                </Row>
                <Row className="mt-1">
                    <Col className="col-12 col-lg-5 ml-2 mt-4">
                        {card_data?.cardById?.cardContentType === "A_0" &&
                            <ReactPlayer width="auto" height={height/width >= 1 ? "200px":400} controls
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
                        <Typography>
                           <MathJax math={card_data?.cardById?.text}/>
                        </Typography>
                        <Typography className="blockquote">На сколько эта карточка была полезна?</Typography>
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
                <Typography>
                    {card_data?.cardById?.additionalText}
                </Typography>
                <br/>
                <br/>
                <br/>
            </div>}
        </div>
    )
})