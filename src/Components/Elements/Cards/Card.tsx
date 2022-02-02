import React, {useEffect, useState, Suspense} from "react";
import { Col, Row, Spinner} from "react-bootstrap";
import ReactPlayer from "react-player";
import {Button, ButtonGroup, Typography, Tooltip, Grid, Stack, CircularProgress} from "@mui/material";
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import { Rating } from '@mui/material';
import {useMutation, useQuery} from "@apollo/client";
import "../../../App.css"
import EditIcon from '@mui/icons-material/Edit';

import useWindowDimensions from "../../../CustomHooks/useWindowDimensions";
import {observer} from "mobx-react";
const RichTextPreview =  React.lazy(() =>import('./CardView/#RichTextPreview'));
import CopyrightIcon from "@mui/icons-material/Copyright";
import {ImageQuestion} from "../UserTest/ImageQuestion/ImageQuestion";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import {isMobileHook} from "../../../CustomHooks/isMobileHook";
import {useHistory, useRouteMatch} from "react-router-dom";
import {CardAuthorNode, CardSubThemeNode, Query} from "../../../SchemaTypes";
import CssBaseline from "@mui/material/CssBaseline";
import {SHOW_CARD_BY_ID, GET_ALL_COURSE, CARD_VIEW_REPORT} from "./CardView/Struct"
import {ICourseLine} from "../Course/Editor/EditCourseByID";
import {Alert, AlertTitle} from "@mui/lab";
import {SERVER_BASE_URL} from "../../../settings";
import IconButton from "@mui/material/IconButton";
import {UserStorage} from "../../../Store/UserStore/UserStore";
import {positionDataI} from "../Course/CourseMicroView/V2/Store/CourseMicroStoreByID";

type CardTitleAuthorThemeAndCopyrightBlockProps = {
    id?: number,
    title?: string,
    copyright?: string,
    subTheme?: CardSubThemeNode[]
    author?: CardAuthorNode[]
    isCardUseCopyright?: boolean,
    isMobile?: boolean,

}
function CardTitleAuthorThemeAndCopyrightBlock({id, title, copyright, subTheme, author, isCardUseCopyright, isMobile}: CardTitleAuthorThemeAndCopyrightBlockProps) {
    return <Row className="mt-4">
        <Col className="col-12">
            <Row className="pl-2">
                <Typography id={"card-title"} className="pl-md-2" variant={isMobile ? "h6" : "h4"}>{title? title : ""}</Typography>
                <Typography id={"card-id"} className="pl-md-2" variant={isMobile ? "subtitle2" : "subtitle1"}>{id? id : ""}</Typography>
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

function ShowFindInCourse({findInCourseNotification}){
    const { path } = useRouteMatch();
    const history = useHistory();

    if(findInCourseNotification.length > 0){
        return(
            <Alert severity="success" variant="outlined" sx={{maxWidth: 550}}>
                <AlertTitle>
                    {findInCourseNotification?.length == 1 ?
                        "Этот ресурс встречается в курсе:" :
                        "Этот ресурс встречается в курсах:"}
                </AlertTitle>
                {findInCourseNotification?.map((course) =>{
                    return(
                        <Stack direction={"column"}>
                            <Stack direction={"row"} alignItems={"center"} justifyContent={"start"}>
                                <Button title={"Перейти"}
                                        color={"info"}
                                        onClick={() =>{
                                            if(path == "/course"){
                                                history.replace("/course?" + "id=" + course.course_id +
                                                    "&activePage="+ course.position.activePage +
                                                    "&selectedPage=" + course.position.selectedPage +
                                                    "&selectedRow=" + course.position.selectedRow +
                                                    "&selectedIndex=" + course.position.selectedIndex)
                                            } else {
                                                history.push("/course?" + "id=" + course.course_id +
                                                    "&activePage="+ course.position.activePage +
                                                    "&selectedPage=" + course.position.selectedPage +
                                                    "&selectedRow=" + course.position.selectedRow +
                                                    "&selectedIndex=" + course.position.selectedIndex)
                                            }
                                        }}>
                                    Перейти
                                </Button>
                                <Typography variant={"body2"}>{course.course_name}</Typography>
                            </Stack>
                        </Stack>)
                })}
            </Alert>
        )

    } else {
        return (<div/>)
    }
}
type IFindInCourseNotification = {
    course_name: string
    course_id: string
    position: positionDataI
}[] | []
type CardProps = {
    id?: number,
    openFromCourse?: boolean,
    disableAllButtons?: boolean,
    courseBar?: any
}
export const CARD = observer(({id, courseBar,  ...props}: CardProps) =>{
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
            id: id,
        },
        onCompleted: data => {
            setOpenTestBeforeCardDialog(true)
            setOpenTestBeforeCard(false)
            if(data?.cardById?.cardContentType !== "A_0"){
                get_card_image()
            }
        }
    })
    const [detailViewReport] = useMutation(CARD_VIEW_REPORT, {
        variables:{
            card_id: id
        }
    })
    useEffect(()=>{
        if(id){
            detailViewReport()
        }
    }, [id])
    const {data: all_courses_data} = useQuery<Query>(GET_ALL_COURSE, {
        fetchPolicy: "cache-only",
    })
    useEffect(() =>{
        if(all_courses_data){
            const __findInCourseNotification: IFindInCourseNotification = [{
                course_name: "_",
                course_id: "0",
                position: {
                    activePage: 0,
                    selectedRow: 0,
                    selectedPage: 0,
                    selectedIndex: 0,
                }
            }]
            __findInCourseNotification.pop()
            if(id){
                all_courses_data?.cardCourse?.map((course, cIndex) => {
                    course?.courseData?.map((course_line: ICourseLine, lIndex) =>{
                        course_line.SameLine?.map((fragment, fIndex) =>{
                            fragment.CourseFragment?.map((element, bIndex) =>{
                                if (element?.CourseElement?.id == id){
                                    __findInCourseNotification?.push({
                                        course_name: String(course?.name || "_"),
                                        course_id: String(course?.id),
                                        position: {
                                            activePage: fIndex + 1,
                                            selectedRow: lIndex,
                                            selectedPage: fIndex + 1,
                                            selectedIndex: bIndex,
                                        }
                                    })
                                }
                            })
                        })
                    })
                })
            }
            setFindInCourseNotification(__findInCourseNotification)
        }
    }, [id, all_courses_data])
    useEffect(() =>{
        refetch()
    }, [id,])
    const get_card_image = (useCache=true) =>{
        fetch(SERVER_BASE_URL + "/cardfiles/card?id=" +
            Number(id), {cache: useCache? "force-cache": "default"})
            .then((response) => response.json())
            .then((data) =>{
                try{
                    // console.log(data)
                    if(data[0].image != cardImage){
                        setCardImage(data[0].image)
                    }
                    if(useCache){
                        get_card_image(false)
                    }
                }
                catch(e){
                    void(0)
                }
            })
    }

    return(
        <div  style={{padding: 0}}>
            <Suspense fallback={<Grid container justifyContent={"center"}><CircularProgress /></Grid>}>
            <CssBaseline />
            <div className=" col-12 mr-md-2 pl-md-2">
                {!props.disableAllButtons &&
                    <Button
                        className="pl-md-2 mt-4  col-12 col-lg-2 mr-2"
                        variant="outlined" color="primary"
                        onClick={ () => {
                            // if(props?.openFromCourse){
                            //     CoursePageStorage.goBackButtonHandler()
                            // }else{
                                history.goBack()
                            // }
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
                            <Grid item xs={"auto"} sx={{pt:2}}>
                                {courseBar}
                            </Grid>
                            <Grid item md={8} xs={12} style={{paddingLeft: isMobile? 0: 12}}>
                                {!card_data ? <Spinner id={"course-only-loading"} animation="border" variant="success" className=" offset-6 mt-5"/> :
                                        <CardTitleAuthorThemeAndCopyrightBlock id={id}
                                        title={card_data?.cardById?.title}
                                        isCardUseCopyright={card_data?.cardById?.isCardUseCopyright}
                                        copyright={card_data?.cardById?.copyright || ""}
                                        subTheme={card_data?.cardById?.subTheme}
                                        author={card_data?.cardById?.author}
                                        isMobile={isMobile}
                                        />}
                            </Grid>
                        </Grid> :
                        <Stack direction={"row"} justifyContent="space-between">
                            <ButtonGroup sx={{pt: 2}} size="large" color="primary" aria-label="group" id={"btn-group-for-card-page"}>
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
                            {UserStorage.userAccessLevel == "ADMIN" &&
                                <div>
                                    <IconButton size="large"
                                                onClick={()=>{history.push("/editor/card2/card/" + id)}}>
                                        <EditIcon fontSize="inherit"/>
                                    </IconButton>
                                </div>}
                        </Stack>

                    }
                </div>}
                {!card_data ? <Spinner id={"simple-loading"} animation="border" variant="success" className=" offset-6 mt-5"/> :
                    openTestBeforeCard ? <ImageQuestion id={card_data?.cardById?.testBeforeCard?.id}
                                                        questionHasBeenCompleted={() => setOpenTestBeforeCard(false)}/> :
                <div>
                    {!props.openFromCourse &&
                    <CardTitleAuthorThemeAndCopyrightBlock id={id}
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
                                        window.open(card_data?.cardById?.siteUrl || undefined, '_blank')
                                    }
                                }}>
                            </div>}
                        </Col>
                        {isMobile && findInCourseNotification?.length > 0 &&
                            <ShowFindInCourse findInCourseNotification={findInCourseNotification}/>}
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
                            <ShowFindInCourse findInCourseNotification={findInCourseNotification}/>

                        </Col>}

                        {card_data?.cardById?.isCardUseArrowNavigation &&
                            (card_data?.cardById?.cardBefore?.id ||
                                card_data?.cardById?.cardDown?.id ||
                                card_data?.cardById?.cardUp?.id ||
                                card_data?.cardById?.cardNext?.id) &&
                        <Col className="col-12">
                            <Typography variant="h6">
                                Авторская навигация:
                            </Typography>
                            <ButtonGroup size="large" color="secondary" variant="outlined" id={"author-navigation"}>
                                <Button disabled={!card_data?.cardById?.cardBefore?.id}
                                        onClick={() => {
                                            if(card_data?.cardById?.cardBefore?.id){
                                                history.push("/card/" + card_data?.cardById?.cardBefore?.id)
                                            }
                                        }}>
                                        <KeyboardArrowLeftOutlinedIcon/>
                                </Button>
                                <Button disabled={!card_data?.cardById?.cardDown?.id}
                                        onClick={() => {
                                            if(card_data?.cardById?.cardDown?.id){
                                                history.push("/card/" + card_data?.cardById?.cardDown?.id)
                                            }
                                        }}>
                                    <KeyboardArrowDownOutlinedIcon/>
                                </Button>
                                <Button disabled={!card_data?.cardById?.cardUp?.id}
                                        onClick={() => {
                                            if(card_data?.cardById?.cardUp?.id){
                                                history.push("/card/" + card_data?.cardById?.cardUp?.id)
                                            }
                                        }}>
                                    <KeyboardArrowUpOutlinedIcon/>
                                </Button>
                                <Button disabled={!card_data?.cardById?.cardNext?.id}
                                        onClick={() => {
                                            if(card_data?.cardById?.cardNext?.id){
                                                history.push("/card/" + card_data?.cardById?.cardNext?.id)
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
            {/*{!isMobile &&*/}
            {/*<Snackbar*/}
            {/*    anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}*/}
            {/*    open={findInCourseNotification?.length > 0}*/}
            {/*>*/}
            {/*    */}
            {/*</Snackbar>}*/}
            </Suspense>
        </div>
    )
})