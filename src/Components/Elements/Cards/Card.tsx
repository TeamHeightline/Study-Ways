import React, {useEffect, useState, Fragment} from "react";
import { Col, Row, Spinner} from "react-bootstrap";
import ReactPlayer from "react-player";
import {Button, ButtonGroup, Typography, Tooltip} from "@material-ui/core";
import KeyboardArrowLeftOutlinedIcon from '@material-ui/icons/KeyboardArrowLeftOutlined';
import KeyboardArrowRightOutlinedIcon from '@material-ui/icons/KeyboardArrowRightOutlined';
import KeyboardArrowDownOutlinedIcon from '@material-ui/icons/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@material-ui/icons/KeyboardArrowUpOutlined';
import {Rating} from "@material-ui/lab";
import {gql} from "graphql.macro";
import {useQuery} from "@apollo/client";
import "../../../App.css"
import CourseMicroView from "../Course/Editor/CourseMicroView";


import useWindowDimensions from "../../../CustomHooks/useWindowDimensions";
import {CoursePageStorage} from "../../../Store/PublicStorage/CoursePage/CoursePageStorage";
import {observer} from "mobx-react";
import {CardPageStorage} from "../../../Store/PublicStorage/CardsPage/CardPageStorage";
import RichTextPreview from "./CardView/#RichTextPreview";
import CopyrightIcon from "@material-ui/icons/Copyright";
import {ImageQuestion} from "../UserTest/ImageQuestion/ImageQuestion";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";

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
            testInCard{
                id
            }
            testBeforeCard{
                id
            }
            isCardUseTestInCard
            isCardUseTestBeforeCard
            isCardUseMainText
            isCardUseMainContent
            isCardUseAdditionalText
            isCardUseCopyright
            isCardUseArrowNavigation
            arrowBefore
            arrowDown
            arrowUp
            arrowNext
            copyright
            cardContentType
            additionalText
            author{
                name
                id
            }

        }
    }`


export const CARD = observer(({id, ...props}: any) =>{
    const [rating, setRating] = useState<number | null>(4);
    const [cardImage, setCardImage] = useState()
    const [openTestBeforeCardDialog, setOpenTestBeforeCardDialog] = useState(true)
    const [openTestBeforeCard, setOpenTestBeforeCard] = useState(false)
    const {width, height} = useWindowDimensions()
    const {data: card_data, refetch, loading} = useQuery(SHOW_CARD_BY_ID, {
        fetchPolicy: "no-cache",
        variables:{
            id: id? id :
                props?.openFromCourse? CoursePageStorage.selectedCardID : CardPageStorage.selectedCardID,
        },
        onCompleted: data => {
            setOpenTestBeforeCardDialog(true)
            setOpenTestBeforeCard(false)
            if(data.cardById.cardContentType !== "A_0"){
                get_card_image()
            }
        }
    })
    useEffect(() =>{
        refetch()
    }, [id,])
    const get_card_image = () =>{
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
        <div className="col-12" style={{padding: 0}}>
            <div className=" col-12 mr-md-2 ml-md-2">
                {!props.disableAllButtons &&
                    <Button
                        className="ml-md-2 mt-4  col-12 col-lg-2 mr-2"
                        variant="outlined" color="primary"
                        onClick={ () => {
                            if(props?.openFromCourse){
                                CoursePageStorage.goBackButtonHandler()
                            }else{
                                CardPageStorage.isOpenCard = false
                            }
                        }}>
                        Назад
                    </Button>}
                {props.openFromCourse &&
                <div className="ml-md-2 mt-4" style={{overflowX: "auto"}}>
                    <CourseMicroView
                        course={CoursePageStorage.courseArr[CoursePageStorage.positionData.courseIndex]}
                        buttonClick={data=>CoursePageStorage.cardSelectInCourseByMouseClick(data,
                                         CoursePageStorage.positionData.courseIndex, CoursePageStorage.positionData.courseID)}
                        cardPositionData={CoursePageStorage.positionData}/>
                </div>}
                { !props.disableAllButtons &&
                <div className="mt-3 col-lg-3 col-12">
                    {/*Если карточка открывается из курса, то нам нужны кнопки вверх и вниз, если её открыли
                        просто как карточку из MainCardPublicView, то нам нужно только вперед и назад для перемещения
                        по id вперед и назад*/}
                    {props.openFromCourse  ?
                        <ButtonGroup size="large" color="primary" aria-label="group">
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
                </div>}
                {loading ? <Spinner animation="border" variant="success" className=" offset-6 mt-5"/> :
                    openTestBeforeCard ? <ImageQuestion id={card_data?.cardById?.testBeforeCard?.id}
                                                        questionHasBeenCompleted={() => setOpenTestBeforeCard(false)}/> :
                <div>
                    <Row className="mt-4" >
                        <Col className="col-12">
                            <Row className="ml-2">
                                {height / width >= 1 ?
                                    <Typography variant="h6">{card_data?.cardById?.title}</Typography>:
                                    <Typography variant="h4">{card_data?.cardById?.title}</Typography>
                                }
                                <Typography variant="subtitle2">{card_data?.cardById?.id}</Typography>
                            </Row>

                            {card_data?.cardById?.subTheme[0] &&
                            <Tooltip title={card_data?.cardById?.subTheme.map((e, eIndex) =>{
                                return(
                                    <Typography key={eIndex+ "Tooltip"}>
                                        {e.theme?.globalTheme?.name.toString() + " / "
                                        + e?.theme?.name.toString() + " / "
                                        + e?.name.toString() }
                                    </Typography>
                                )
                            })} >
                                <Typography  color="textPrimary" className="ml-2 mt-2" style={{maxWidth: 600}}>
                                    {card_data?.cardById?.subTheme[0]?.theme?.globalTheme?.name + " / " +
                                    card_data?.cardById?.subTheme[0]?.theme?.name + " / " +
                                    card_data?.cardById?.subTheme[0]?.name}
                                </Typography>
                            </Tooltip> }

                            {card_data?.cardById?.author && card_data?.cardById?.author.length !==0 &&
                            <Typography className="ml-2" color="textPrimary">
                                {card_data?.cardById?.author.map((sameAuthor, aIndex) =>{
                                if(aIndex !== 0 ){
                                    return (" | " + sameAuthor.name)
                                }
                                return(sameAuthor.name)
                            })}</Typography>}
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {card_data?.cardById?.isCardUseCopyright && card_data?.cardById?.copyright &&
                            <Typography variant="h6" className="ml-md-2 mt-2">
                                <Tooltip title={<Typography>{"Правообладателем изложенного материала является: " + card_data?.cardById?.copyright}</Typography>}>
                                    <CopyrightIcon />
                                </Tooltip>
                                {card_data?.cardById?.copyright}
                            </Typography> }
                        </Col>
                    </Row>
                    <Row >
                        <Col className="col-12 col-lg-5 mt-2">
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
                        <Col className="col-12 col-lg-6 mt-4">
                            <RichTextPreview initialText={card_data?.cardById?.text} onChange={()  => void(0)}/>
                            <Typography className="blockquote">На сколько эта карточка была полезна?</Typography>
                            <Rating
                                className="ml-md-3"
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
                    {card_data?.cardById?.isCardUseArrowNavigation && (card_data?.cardById?.arrowBefore ||
                        card_data?.cardById?.arrowDown || card_data?.cardById?.arrowUp || card_data?.cardById?.arrowNext) &&
                        <Fragment>
                            <Typography variant="h6">
                                Авторская навигация:
                            </Typography>
                            <ButtonGroup size="large" color="secondary" variant="outlined" style={{marginBottom: 12}}>
                                <Button disabled={!card_data?.cardById?.arrowBefore}
                                        onClick={ () => window.open(card_data?.cardById?.arrowBefore, "_blank")}>
                                    <KeyboardArrowLeftOutlinedIcon/>
                                </Button>
                                <Button disabled={!card_data?.cardById?.arrowDown}
                                        onClick={ () => window.open(card_data?.cardById?.arrowDown, "_blank")}>
                                    <KeyboardArrowDownOutlinedIcon/>
                                </Button>
                                <Button disabled={!card_data?.cardById?.arrowUp}
                                        onClick={ () => window.open(card_data?.cardById?.arrowUp, "_blank")}>
                                    <KeyboardArrowUpOutlinedIcon/>
                                </Button>
                                <Button disabled={!card_data?.cardById?.arrowNext}
                                        onClick={ () => window.open(card_data?.cardById?.arrowNext, "_blank")}>
                                    <KeyboardArrowRightOutlinedIcon/>
                                </Button>
                            </ButtonGroup>
                        </Fragment>
                    }

                    <div>
                        {card_data?.cardById?.isCardUseTestBeforeCard && card_data?.cardById?.testBeforeCard?.id &&
                        <Dialog
                            open={openTestBeforeCardDialog}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">{"Вопрос перед карточкой"}</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    Перед изучением данного ресурса, мы советуем Вам проверить свой уровень подготовки,
                                    путем прохождения следующего вопроса
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => {
                                    setOpenTestBeforeCard(true)
                                    setOpenTestBeforeCardDialog(false)
                                }} color="primary">
                                    Начать
                                </Button>
                                <Button onClick={() => setOpenTestBeforeCardDialog(false)} color="primary">
                                    Закрыть
                                </Button>
                            </DialogActions>
                        </Dialog>}
                        {card_data?.cardById?.isCardUseTestInCard && card_data?.cardById?.testInCard?.id &&
                        <ImageQuestion id={card_data?.cardById?.testInCard?.id}/>}
                    </div>

                </div>}
            </div>
        </div>
    )
})