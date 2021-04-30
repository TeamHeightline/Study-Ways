import React, {useState} from 'react'
import Typography from "@material-ui/core/Typography";
import {
    Button,
    createStyles,
    ListItemIcon,
    makeStyles,
    Menu,
    MenuItem,
    MenuProps,
    TextField,
    Theme,
    withStyles
} from "@material-ui/core";
import Switch from "@material-ui/core/Switch";
import {Alert, Col, Row} from "react-bootstrap";
import ReactPlayer from "react-player";

import TextFieldsIcon from '@material-ui/icons/TextFields';
import YouTubeIcon from '@material-ui/icons/YouTube';
import HttpIcon from '@material-ui/icons/Http';
import SettingsIcon from '@material-ui/icons/Settings';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import {gql, useQuery} from "@apollo/client";


const QUESTION_BY_ID = gql`
    query QUESTION_BY_ID($id: ID!){
        questionById(id: $id){
            text
        }
    }`



const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d0d5',
    },
})((props: MenuProps) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        {...props}
    />
));

const StyledMenuItem = withStyles((theme) => ({
    root: {
        '&:focus': {
            backgroundColor: theme.palette.primary.main,
            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: theme.palette.common.white,
            },
        },
    },
}))(MenuItem);

export default function CardEditByID(props:any){


    const [cardID, setCardID] = useState(0)
    const [cardHeader, setCardHeader] = useState("Заголовок по умолчанию")

    const [cardText, setCardText] = useState('')
    const [cardYoutubeVideoUrl, setCardYoutubeVideoUrl] = useState("https://www.youtube.com/watch?v=vpMJ_rNN9vY")
    const [cardSrcToOtherSite, setCardSrcToOtherSite] = useState('')
    const [cardBodyQuestionId, setCardBodyQuestionId] = useState(69)
    const [cardBeforeCardQuestionId, setCardBeforeCardQuestionId] = useState(70)


    const [isUseText, setIsUseText] = useState(true)
    const [isUseYoutubeVideo, setIsUseYoutubeVideo] = useState(true)
    const [isUseSrcToOtherSite, setIsUseSrcToOtherSite] = useState(false)
    const [isUseBodyQuestion, setIsUseBodyQuestion] = useState(false)
    const [isUseBeforeCardQuestion, setIsUseBeforeCardQuestion] = useState(false)


    const [sitePreviewData, setSitePreviewData] = useState()
    const {data: cardBodyQuestionData, loading: cardBodyQuestionLoading} = useQuery(QUESTION_BY_ID, {
          variables: {
              "id" : cardBodyQuestionId
          },
    })

    const {data: cardBeforeCardQuestionData, loading: cardBeforeCardQuestionLoading} = useQuery(QUESTION_BY_ID, {
        variables: {
            "id" : cardBeforeCardQuestionId
        },
    })


    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };



    const isUseTextHandle = (e) =>{
        setIsUseText(!isUseText)
    }
    const isUseYoutubeVideoHandler = (e) =>{
        setIsUseYoutubeVideo(!isUseYoutubeVideo)
    }
    const isUseSrcToOtherSiteHandle = (e) =>{
        setIsUseSrcToOtherSite(!isUseSrcToOtherSite)
    }
    const isUseBodyQuestionHandle = (e) =>{
        setIsUseBodyQuestion(!isUseBodyQuestion)
    }
    const isUseBeforeCardQuestionHandle = (e) =>{
        setIsUseBeforeCardQuestion(!isUseBeforeCardQuestion)
    }


    const cardHeaderHandle = (e) =>{
        setCardHeader(e.target.value)
    }
    const cardTextHandle = (e) =>{
        setCardText(e.target.value)
    }
    const cardYoutubeVideoUrlHandle = (e) =>{
        setCardYoutubeVideoUrl(e.target.value)
    }
    const cardSrcToOtherSiteHandle = (e) =>{
        setCardSrcToOtherSite(e.target.value)
    }
    const cardBodyQuestionIdHandle = (e)  =>{
        const valueWithOnlyNumber = e.target.value.replace(/[^\d]/g, '')
        setCardBodyQuestionId(valueWithOnlyNumber)
    }
    const cardBeforeCardQuestionIdHandle = (e) =>{
        const valueWithOnlyNumber = e.target.value.replace(/[^\d]/g, '')
        setCardBeforeCardQuestionId(valueWithOnlyNumber)
    }


    return(
        <div>
            <div className="display-4 text-center mt-4" style={{fontSize: '33px'}}>Редактировать карточку</div>
            <Row>
                <Col className="col-6">
                    <Typography variant="h6" className="ml-5" color="textPrimary">{"ID: " + cardID + " " + cardHeader}</Typography>
                    <TextField
                        className="mt-2 ml-5"
                        key={cardID + "header"}
                        id="standard-multiline-flexible"
                        label="Название карточки / Заголовок карточки"
                        fullWidth
                        rowsMax={7}
                        // style={{width: "50vw"}}
                        value={cardHeader}
                        onChange={cardHeaderHandle}
                    />
                </Col>
                <Col>
                    <Button
                        className="ml-5 mt-2"
                        aria-controls="customized-menu"
                        aria-haspopup="true"
                        variant="outlined"
                        color="primary"
                        onClick={handleClick}
                    >
                        <ListItemIcon>
                            <SettingsIcon/>
                        </ListItemIcon>
                        Настроить содержимое
                    </Button>
                    <StyledMenu
                        id="customized-menu"
                        anchorEl={anchorEl}
                        // keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <StyledMenuItem onClick={isUseTextHandle}>
                            <Switch
                                checked={isUseText}
                                onChange={isUseTextHandle}
                                name="checkedB"
                                color="secondary"
                            />
                            <ListItemIcon>
                                <TextFieldsIcon/>
                            </ListItemIcon>
                            Текст
                        </StyledMenuItem>
                        <StyledMenuItem onClick={isUseYoutubeVideoHandler}>
                            <Switch
                                checked={isUseYoutubeVideo}
                                onChange={isUseYoutubeVideoHandler}
                                name="checkedB"
                                color="secondary"
                            />
                            <ListItemIcon>
                                <YouTubeIcon/>
                            </ListItemIcon>
                            Видео с Youtube
                        </StyledMenuItem>
                        <StyledMenuItem onClick={isUseSrcToOtherSiteHandle}>
                            <Switch
                                checked={isUseSrcToOtherSite}
                                onChange={isUseSrcToOtherSiteHandle}
                                name="checkedB"
                                color="secondary"
                            />
                            <ListItemIcon>
                                <HttpIcon/>
                            </ListItemIcon>
                            Ссылка на внешний ресурс
                        </StyledMenuItem>
                        <StyledMenuItem onClick={isUseBodyQuestionHandle}
                        >
                            <Switch
                                checked={isUseBodyQuestion}
                                onChange={isUseBodyQuestionHandle}
                                name="checkedB"
                                color="secondary"
                            />
                            <ListItemIcon>
                                <DoneAllIcon/>
                            </ListItemIcon>
                            Тест в карточке
                        </StyledMenuItem>
                        <StyledMenuItem onClick={isUseBeforeCardQuestionHandle}
                        >
                            <Switch
                                checked={isUseBeforeCardQuestion}
                                onChange={isUseBeforeCardQuestionHandle}
                                name="checkedB"
                                color="secondary"
                            />
                            <ListItemIcon>
                                <DoneAllIcon/>
                            </ListItemIcon>
                            Тест перед карточкой
                        </StyledMenuItem>
                    </StyledMenu>



                </Col>
            </Row>
            <br/>
            <Row className="mt-4">

                    {isUseYoutubeVideo? <Col className="col-12 col-lg-5  mt-4 ml-5">
                        <ReactPlayer width="auto"  controls
                                     url={cardYoutubeVideoUrl}
                        />
                        <TextField
                            className="mt-2 col-12"
                            key={cardID + "youtubeVideo"}
                            id="standard-multiline-flexible"
                            label="Ссылка на видео на Youtube"
                            fullWidth
                            value={cardYoutubeVideoUrl}
                            onChange={cardYoutubeVideoUrlHandle}
                        />
                    </Col>: null}
                    {isUseText? <Col className="col-12 col-lg-6 ml-4">
                        <TextField
                            className="mt-2 col-12 ml-3"
                            key={cardID + "text"}
                            id="standard-multiline-flexible"
                            label="Текст"
                            multiline
                            fullWidth
                            rowsMax={21}
                            // style={{width: "50vw"}}
                            value={cardText}
                            onChange={cardTextHandle}
                        />
                    </Col>: null}
            </Row>

            <Row className="mt-4">
                {isUseSrcToOtherSite? <Col className="col-12 col-lg-5 ml-5 mt-4">
                    <TextField
                        className="mt-2 col-12"
                        key={cardID + "otherSite"}
                        id="standard-multiline-flexible"
                        label="Ссылка на внешний ресурс"
                        fullWidth
                        value={cardSrcToOtherSite}
                        onChange={cardSrcToOtherSiteHandle}
                    />
                </Col>: null}
            </Row>


            <Row className="mt-4">

                {isUseBodyQuestion? <Col className="col-12 col-lg-5 ml-5 mt-4">
                    <TextField
                        className="mt-2 col-12"
                        key={cardID + "BodyQuestionId"}
                        id="standard-multiline-flexible"
                        label="ID вопроса для тела карточки"
                        fullWidth
                        value={cardBodyQuestionId}
                        onChange={cardBodyQuestionIdHandle}
                    />
                    <Typography>
                        <blockquote/> ТЕКСТ ВОПРОСА: {cardBodyQuestionData?.questionById?.text}<blockquote/>
                    </Typography>

                </Col>: null}
                {isUseBeforeCardQuestion? <Col className="col-12 col-lg-5 mt-4 ml-4">
                    <TextField
                        className="mt-2 col-12 ml-3"
                        key={cardID + "BeforeCardQuestionId"}
                        id="standard-multiline-flexible"
                        label="ID вопроса перед входом в карточку"
                        fullWidth
                        value={cardBeforeCardQuestionId}
                        onChange={cardBeforeCardQuestionIdHandle}
                    />
                    <Typography className="ml-3">
                        <blockquote/> ТЕКСТ ВОПРОСА: {cardBeforeCardQuestionData?.questionById?.text}<blockquote/>
                    </Typography>
                </Col>: null}
            </Row>
        </div>
    )
}