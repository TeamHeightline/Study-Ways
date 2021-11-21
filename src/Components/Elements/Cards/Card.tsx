import React, {useEffect, useState} from "react";
import { Col, Row, Spinner} from "react-bootstrap";
import ReactPlayer from "react-player";
import {Button, ButtonGroup, Typography, Tooltip, Grid, Snackbar, Stack} from "@mui/material";
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import { Rating } from '@mui/material';
import {useQuery} from "@apollo/client";
import "../../../App.css"
import CourseMicroView from "../Course/Editor/CourseMicroView";


import useWindowDimensions from "../../../CustomHooks/useWindowDimensions";
import {CoursePageStorage} from "../../../Store/PublicStorage/CoursePage/CoursePageStorage";
import {observer} from "mobx-react";
import {CardPageStorage} from "../../../Store/PublicStorage/CardsPage/CardPageStorage";
import RichTextPreview from "./CardView/#RichTextPreview";
import CopyrightIcon from "@mui/icons-material/Copyright";
import {ImageQuestion} from "../UserTest/ImageQuestion/ImageQuestion";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import {isMobileHook} from "../../../CustomHooks/isMobileHook";
import {useHistory} from "react-router-dom";
import {CardAuthorNode, CardSubThemeNode, Query} from "../../../SchemaTypes";
import CssBaseline from "@mui/material/CssBaseline";
import {SHOW_CARD_BY_ID, GET_ALL_COURSE} from "./CardView/Struct"
import {ICourseLine} from "../Course/Editor/EditCourseByID";
import {Alert, AlertTitle} from "@mui/lab";

type CardTitleAuthorThemeAndCopyrightBlockProps = {
    title?: string,
    copyright?: string,
    subTheme?: CardSubThemeNode[]
    author?: CardAuthorNode[]
    isCardUseCopyright?: boolean,
    isMobile?: boolean,
}
function CardTitleAuthorThemeAndCopyrightBlock({title, copyright, subTheme, author, isCardUseCopyright, isMobile}: CardTitleAuthorThemeAndCopyrightBlockProps) {
    return <Row className="mt-4">
        <Col className="col-12">
            <Row className="pl-2">
                <Typography id={"card-title"} className="pl-md-2" variant={isMobile ? "h6" : "h4"}>{title? title : ""}</Typography>
                {/*<Typography variant="subtitle2">{card_data?.cardById?.id}</Typography>*/}
                {isCardUseCopyright && copyright &&
                <Typography variant="h6" className="pl-md-2">
                    <Tooltip title={
                        <Typography>{"Правообладателем изложенного материала является: " + copyright}</Typography>}>
                        <CopyrightIcon/>
                    </Tooltip>
                    {copyright}
                </Typography>}
            </Row>

            {subTheme && subTheme[0] &&
            <Tooltip title={subTheme.map((e, eIndex) => {
                return (
                    <Typography key={eIndex + "Tooltip"}>
                        {e.theme?.globalTheme?.name.toString() + " / "
                        + e?.theme?.name.toString() + " / "
                        + e?.name.toString()}
                    </Typography>
                )
            })}>
                <Typography color="textPrimary" className="pl-2 mt-2" style={{maxWidth: 600}}>
                    {subTheme[0]?.theme?.globalTheme?.name + " / " +
                    subTheme[0]?.theme?.name + " / " +
                    subTheme[0]?.name}
                </Typography>
            </Tooltip>}

            {author && author.length !== 0 &&
            <Typography className="pl-2" color="textPrimary">
                {author?.map((sameAuthor, aIndex) => {
                    if (aIndex !== 0) {
                        return (" | " + sameAuthor?.name)
                    }
                    return (sameAuthor?.name)
                })}</Typography>}
        </Col>
    </Row>;
}
type IFindInCourseNotification = {
    course_name: string
    position: typeof CoursePageStorage.positionData
}[] | []
type CardProps = {
    id?: number,
    openFromCourse?: boolean,
    disableAllButtons?: boolean,
}
export const CARD = observer(({id,  ...props}: CardProps) =>{
    const [rating, setRating] = useState<number | null>(4);
    const [cardImage, setCardImage] = useState()
    const [openTestBeforeCardDialog, setOpenTestBeforeCardDialog] = useState(true)
    const [openTestBeforeCard, setOpenTestBeforeCard] = useState(false)
    const isMobile = isMobileHook()
    const history = useHistory();
    const {width, height} = useWindowDimensions()
    const [findInCourseNotification, setFindInCourseNotification] = useState<IFindInCourseNotification>([])
    const {data: card_data, refetch} = useQuery<Query>(SHOW_CARD_BY_ID, {
        fetchPolicy: "cache-and-network",
        variables:{
            id: id? id :
                 props?.openFromCourse? CoursePageStorage.selectedCardID : CardPageStorage.selectedCardID,
        },
        onCompleted: data => {
            setOpenTestBeforeCardDialog(true)
            setOpenTestBeforeCard(false)
            if(data?.cardById?.cardContentType !== "A_0"){
                get_card_image()
            }
        }
    })
     useQuery<Query>(GET_ALL_COURSE, {
        fetchPolicy: "cache-only",
        skip: props?.openFromCourse,
        onCompleted: data => {
            if(data?.cardCourse && data?.cardCourse?.length > 1){
                const __findInCourseNotification: IFindInCourseNotification = [{
                    course_name: "_",
                    position: {
                        courseIndex: 0,
                        row: 0,
                        fragment: 0,
                        buttonIndex: 0,
                        courseID: 0,
                        openPage: 0
                    }
                }]
                __findInCourseNotification.pop()
                CoursePageStorage.get_course_data()
                data?.cardCourse?.map((course, cIndex) => {
                    course?.courseData?.map((course_line: ICourseLine, lIndex) =>{
                        course_line.SameLine?.map((fragment, fIndex) =>{
                            fragment.CourseFragment?.map((element, bIndex) =>{
                                if (element?.CourseElement?.id == id){
                                    __findInCourseNotification?.push({
                                            course_name: course?.name || "_",
                                            position: {
                                                courseIndex: cIndex,
                                                row: lIndex,
                                                fragment: fIndex,
                                                openPage: fIndex + 1,
                                                buttonIndex: bIndex,
                                                courseID: Number(course?.id),
                                            }
                                        })
                                }
                            })
                        })
                    })
                })
                setFindInCourseNotification(__findInCourseNotification)
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

    return(
        <div  style={{padding: 0}}>
            <CssBaseline />
            <div className=" col-12 mr-md-2 pl-md-2">
                {!props.disableAllButtons &&
                    <Button
                        className="pl-md-2 mt-4  col-12 col-lg-2 mr-2"
                        variant="outlined" color="primary"
                        onClick={ () => {
                            if(props?.openFromCourse){
                                CoursePageStorage.goBackButtonHandler()
                            }else{
                                // CardPageStorage.isOpenCard = false
                                history.push("/cards")
                            }
                        }}>
                        Назад
                    </Button>}

                { !props.disableAllButtons &&
                <div>
                    {/*Если карточка открывается из курса, то нам нужны кнопки вверх и вниз, если её открыли
                        просто как карточку из MainCardPublicView, то нам нужно только вперед и назад для перемещения
                        по id вперед и назад*/}
                    {props.openFromCourse  ?
                        <Grid container>
                            <Grid item xs={"auto"}>
                                <div className=" mt-4" style={{overflowX: "auto"}} id={"course-micro-view"}>
                                    <CourseMicroView
                                        course={CoursePageStorage.courseArr[CoursePageStorage.positionData.courseIndex]}
                                        buttonClick={data=>CoursePageStorage.cardSelectInCourseByMouseClick(data,
                                            CoursePageStorage.positionData.courseIndex, CoursePageStorage.positionData.courseID)}
                                        cardPositionData={CoursePageStorage.positionData}/>
                                </div>
                                <ButtonGroup id={"course-btn-group"} size="large" color="primary" aria-label="group" className="mt-2">
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
                                </ButtonGroup>
                            </Grid>
                            <Grid item md={8} xs={12} style={{paddingLeft: isMobile? 0: 12}}>
                                {!card_data ? <Spinner id={"course-only-loading"} animation="border" variant="success" className=" offset-6 mt-5"/> :
                                        <CardTitleAuthorThemeAndCopyrightBlock
                                        title={card_data?.cardById?.title}
                                        isCardUseCopyright={card_data?.cardById?.isCardUseCopyright}
                                        copyright={card_data?.cardById?.copyright || ""}
                                        subTheme={card_data?.cardById?.subTheme}
                                        author={card_data?.cardById?.author}
                                        isMobile={isMobile}
                                        />}
                            </Grid>
                        </Grid> :
                        <ButtonGroup size="large" color="primary" aria-label="group" id={"btn-group-for-card-page"}>
                            <Button onClick={ () =>{
                                history.push("/card/" + (Number(id) - 1))
                                // CardPageStorage.selectedCardID = CardPageStorage.selectedCardID - 1
                            }}>
                                <KeyboardArrowLeftOutlinedIcon/>
                            </Button>
                            <Button onClick={ () => {
                                history.push("/card/" + (Number(id) + 1))
                                // CardPageStorage.selectedCardID = Number(CardPageStorage.selectedCardID) + 1
                            }}>
                                <KeyboardArrowRightOutlinedIcon/>
                            </Button>
                        </ButtonGroup>
                    }
                </div>}
                {!card_data ? <Spinner id={"simple-loading"} animation="border" variant="success" className=" offset-6 mt-5"/> :
                    openTestBeforeCard ? <ImageQuestion id={card_data?.cardById?.testBeforeCard?.id}
                                                        questionHasBeenCompleted={() => setOpenTestBeforeCard(false)}/> :
                <div>
                    {!props.openFromCourse &&
                    <CardTitleAuthorThemeAndCopyrightBlock
                        title={card_data?.cardById?.title}
                        isCardUseCopyright={card_data?.cardById?.isCardUseCopyright}
                        copyright={card_data?.cardById?.copyright || ""}
                        subTheme={card_data?.cardById?.subTheme}
                        author={card_data?.cardById?.author}
                        isMobile={isMobile}
                        />}
                    <Row>
                        <Col className="col-12 col-lg-5 mt-2">
                            {card_data?.cardById?.cardContentType === "A_0" &&
                            <ReactPlayer width="auto" height={height / width >= 1 ? "200px" : 400} controls
                                         url={String(card_data?.cardById?.videoUrl)}
                            />
                            }
                            {(card_data?.cardById?.cardContentType === "A_1" || card_data?.cardById?.cardContentType === "A_2") &&
                            <div
                                className={card_data?.cardById.cardContentType === "A_1" ? "hoverImage" : ""}
                                style={{
                                    backgroundImage: cardImage ? "url(" + cardImage + ")" : "url(https://image-store-iot-experemental.s3.eu-north-1.amazonaws.com/cards-images/template/301.png)",
                                    backgroundSize: "cover",
                                    backgroundRepeat: "no-repeat",
                                    width: "100%",
                                    height: 400,
                                }}
                                onClick={() => {
                                    if (card_data?.cardById?.cardContentType === "A_1") {
                                        console.log("click on image")
                                        window.open(card_data?.cardById?.videoUrl || undefined, '_blank')
                                    }
                                }}>
                            </div>}
                        </Col>
                        {!isMobile &&
                        <Col className="col-12 col-lg-6 mt-4">
                            <RichTextPreview text={card_data?.cardById?.text} onChange={() => void (0)}/>
                            <Typography className="blockquote">На сколько эта карточка была полезна?</Typography>
                            <Rating
                                className="pl-md-3"
                                name="simple-controlled"
                                value={rating}
                                onChange={(event, newValue) => {
                                    setRating(newValue);
                                }}
                            />
                        </Col>}

                        {card_data?.cardById?.isCardUseArrowNavigation && (card_data?.cardById?.arrowBefore ||
                            card_data?.cardById?.arrowDown || card_data?.cardById?.arrowUp || card_data?.cardById?.arrowNext) &&
                        <Col className="col-12">
                            <Typography variant="h6">
                                Авторская навигация:
                            </Typography>
                            <ButtonGroup size="large" color="secondary" variant="outlined" id={"author-navigation"}>
                                <Button disabled={!card_data?.cardById?.arrowBefore}
                                        onClick={() => {
                                            //ВРЕМЕННОЕ РЕШЕНИЕ, ПОКА НЕ ПОЙМЕМ, КАК СДЕЛАТЬ НОРМАЛЬНО
                                            if(card_data?.cardById?.arrowBefore?.includes("sw-university.com/card/")){
                                                history.push(String(card_data?.cardById?.arrowBefore)?.split("sw-university.com/card/")[1])
                                            }else{
                                                window.open(card_data?.cardById?.arrowBefore || undefined, "_blank")
                                            }
                                        }}>
                                        <KeyboardArrowLeftOutlinedIcon/>
                                </Button>
                                <Button disabled={!card_data?.cardById?.arrowDown}
                                        onClick={() => {
                                            if(card_data?.cardById?.arrowDown?.includes("sw-university.com/card/")){
                                                history.push(String(card_data?.cardById?.arrowDown)?.split("sw-university.com/card/")[1])
                                            }else{
                                                window.open(card_data?.cardById?.arrowDown || undefined, "_blank")
                                            }
                                        }}>
                                    <KeyboardArrowDownOutlinedIcon/>
                                </Button>
                                <Button disabled={!card_data?.cardById?.arrowUp}
                                        onClick={() => {
                                            if(card_data?.cardById?.arrowUp?.includes("sw-university.com/card/")){
                                                history.push(String(card_data?.cardById?.arrowUp)?.split("sw-university.com/card/")[1])
                                            }else{
                                                window.open(card_data?.cardById?.arrowUp || undefined, "_blank")
                                            }
                                        }}>
                                    <KeyboardArrowUpOutlinedIcon/>
                                </Button>
                                <Button disabled={!card_data?.cardById?.arrowNext}
                                        onClick={() => {
                                            if(card_data?.cardById?.arrowNext?.includes("sw-university.com/card/")){
                                                history.push(String(card_data?.cardById?.arrowNext)?.split("sw-university.com/card/")[1])
                                            }else{
                                                window.open(card_data?.cardById?.arrowNext || undefined, "_blank")
                                            }
                                        }}>
                                    <KeyboardArrowRightOutlinedIcon/>
                                </Button>
                            </ButtonGroup>
                        </Col>
                        }
                        {isMobile &&
                        <Col className="col-12 col-lg-6 mt-4">
                            {/*<Typography>*/}
                                <RichTextPreview id={"rich-text-preview"} text={card_data?.cardById?.text} onChange={() => void (0)}/>
                            {/*</Typography>*/}
                            <Typography className="blockquote" id={"card-rating"}>Насколько эта карточка была полезна?</Typography>
                            <Rating
                                className="pl-md-3"
                                name="simple-controlled"
                                value={rating}
                                onChange={(event, newValue) => {
                                    setRating(newValue);
                                }}
                            />
                        </Col>}
                    </Row>
                    <Typography>
                        {card_data?.cardById?.additionalText}
                    </Typography>

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
                        <div style={{marginTop: 12}}>
                            <ImageQuestion id={card_data?.cardById?.testInCard?.id}/>
                        </div>}
                    </div>
                </div>}
            </div>
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }}
                open={findInCourseNotification?.length > 0}
            >
                <Alert severity="success" sx={{ width: '100%' }} variant="outlined">
                    <AlertTitle>
                        {findInCourseNotification?.length == 1 ?
                        "Эта карточка встречается в курсе:" :
                        "Эта карточка встречается в курсах:"}
                    </AlertTitle>
                    {findInCourseNotification?.map((course) =>{
                        return(
                            <Stack direction={"row"} alignItems={"center"}>
                                <Button title={"Перейти"}

                                        color={"info"}
                                        onClick={() =>{
                                            CoursePageStorage.changeCardPosition(course.position)
                                            history.push("/courses")
                                        }}>
                                    Перейти
                                </Button>
                                <Typography variant={"body2"}>{course.course_name}</Typography>
                            </Stack>)
                    })}
                </Alert>
            </Snackbar>
        </div>
    )
})