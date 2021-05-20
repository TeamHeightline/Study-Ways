import React, {useEffect, useMemo, useState} from 'react'
import Typography from "@material-ui/core/Typography";
import {
    Button,
    Divider,
    ListItemIcon,
    Menu,
    MenuItem,
    Select, Snackbar,
    TextField,
} from "@material-ui/core";
import Switch from "@material-ui/core/Switch";
import {Col, Row, Spinner} from "react-bootstrap";
import ReactPlayer from "react-player";
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react'
import '../styleForCKEditor.css'

import { TreeSelect } from 'antd';


import TextFieldsIcon from '@material-ui/icons/TextFields';
import YouTubeIcon from '@material-ui/icons/YouTube';
import SettingsIcon from '@material-ui/icons/Settings';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import {gql, useMutation, useQuery} from "@apollo/client";
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import CreateIcon from '@material-ui/icons/Create';
import 'antd/dist/antd.css';
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import {Alert} from "@material-ui/lab";
import RichTextEditor from "./#RichTextEditor";
import ThemeTree from "./#ThemeTree";
import CardAuthorsSelect from "./#CardAuthorsSelect";
import CardEditMenu from "./#CardEditMenu";


const GET_CARD_DATA = gql`
    query GET_CARD_DATA{
        card{
            id
            author{
                id
            }
            subTheme{
                id
            }
            isCardUseAdditionalText
            isCardUseMainContent
            isCardUseMainText
            isCardUseTestBeforeCard
            isCardUseTestInCard
            cardContentType
            text
            title
            additionalText
            siteUrl
            videoUrl
            testBeforeCard{
                id
            }
            testInCard{
                id
            }

        }
    }`

const GET_OWN_AUTHOR = gql`
    query GET_OWN_AUTHOR{
        me{
            cardauthorSet{
                id
                name
            }
        }
    }
`
const QUESTION_BY_ID = gql`
    query QUESTION_BY_ID($id: ID!){
        questionById(id: $id){
            text
        }
    }`

const UPDATE_CARD = gql`
    mutation UPDATE_CARD($id: ID, $author: [ID], $additionalText:  String, $cardContentType: String!, $subTheme: [ID]!,
        $title: String!, $text: String, $videoUrl: String, $testInCard: ID, $testBeforeCard: ID, $siteUrl: String,
        $isCardUseAdditionalText: Boolean, $isCardUseMainContent: Boolean, $isCardUseMainText: Boolean,
        $isCardUseTestBeforeCard: Boolean, $isCardUseTestInCard: Boolean){
        card(input: {id: $id, author: $author, subTheme: $subTheme,  additionalText: $additionalText, cardContentType: $cardContentType,
            createdBy: 0, title: $title, text: $text, videoUrl: $videoUrl, testInCard: $testInCard, testBeforeCard: $testBeforeCard,
            siteUrl: $siteUrl, isCardUseAdditionalText: $isCardUseAdditionalText, isCardUseMainContent: $isCardUseMainContent,
            isCardUseMainText: $isCardUseMainText, isCardUseTestBeforeCard: $isCardUseTestBeforeCard, isCardUseTestInCard: $isCardUseTestInCard}){
            errors{
                field
                messages
            }
        }
    }`

const GET_THEMES = gql`
    query GET_THEMES{
        cardGlobalTheme{
            id
            name
            cardthemeSet{
                id
                name
                cardsubthemeSet{
                    id
                    name
                }
            }
        }
    }`

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 7.5 + ITEM_PADDING_TOP,
            // width: "250vw",
        },
    },
};




export default function CardEditByID(props){
    const [autoSaveTimer, changeAutoSaveTimer] = useState<any>()
    const [stateOfSave, setStateOfSave] = useState(2) // 0- не сохранено 1- сохранение 2- сохранено

    const [cardID, setCardID] = useState(1)
    const [cardHeader, setCardHeader] = useState("Заголовок по умолчанию")
    const [cardSelectedThemeID, setCardSelectedThemeID] = useState([])
    const [cardAuthorId, changeCardAuthorId]: any = useState([]);

    const [mainContentType, setMainContentType] = useState(0)
    const [cardMainText, setCardMainText] = useState('')
    const [cardYoutubeVideoUrl, setCardYoutubeVideoUrl] = useState("https://www.youtube.com/watch?v=vpMJ_rNN9vY")
    const [cardAdditionalText, setCardAdditionalText] = useState('')
    const [cardBodyQuestionId, setCardBodyQuestionId] = useState(69)
    const [cardBeforeCardQuestionId, setCardBeforeCardQuestionId] = useState(70)
    const [cardImage, setCardImage] = useState()
    const [cardSrcToOtherSite, setCardSrcToOtherSite] = useState('')



    const [isUseMainContent, setIsUseMainContent] = useState(true)
    const [isUseMainText, setIsUseMainText] = useState(true)
    const [isUseAdditionalText, setIsUseAdditionalText] = useState(false)
    const [isUseBodyQuestion, setIsUseBodyQuestion] = useState(false)
    const [isUseBeforeCardQuestion, setIsUseBeforeCardQuestion] = useState(false)

    const [dataForThemeTreeView, setDataForThemeTreeView] = useState([])



    const {data: authorData} = useQuery(GET_OWN_AUTHOR)
    const {data: themesData} = useQuery(GET_THEMES, {
        onCompleted: themesData => {
            // console.log(themesData.cardGlobalTheme)
            const data: any = []
            themesData.cardGlobalTheme.map((GlobalTheme, indexOfGlobalTheme) =>{
                const ThisGlobalTheme: any = {}
                ThisGlobalTheme.title = GlobalTheme.name
                ThisGlobalTheme.id = GlobalTheme.id
                ThisGlobalTheme.value = GlobalTheme.id
                ThisGlobalTheme.isLead = false
                ThisGlobalTheme.pid = 0
                data.push(ThisGlobalTheme)
                GlobalTheme.cardthemeSet.map((Theme, indexOfTheme) =>{
                    const ThisTheme: any = {}
                    ThisTheme.title = Theme.name
                    ThisTheme.id = Theme.id * 1000
                    ThisTheme.value = Theme.id * 1000
                    ThisTheme.pId = ThisGlobalTheme.id
                    ThisGlobalTheme.isLead = false
                    data.push(ThisTheme)
                    Theme.cardsubthemeSet.map((SubTheme, indexOfSubTheme) =>{
                        const ThisSubTheme: any = {}
                        ThisSubTheme.title = SubTheme.name
                        ThisSubTheme.id = SubTheme.id * 1000000
                        ThisSubTheme.value = SubTheme.id * 1000000
                        ThisSubTheme.pId = Theme.id * 1000
                        ThisGlobalTheme.isLead = true
                        data.push(ThisSubTheme)
                    })

                })

            })
            // console.log(data)
            setDataForThemeTreeView(data)
        }
    })
    const {data: card_data} = useQuery(GET_CARD_DATA,
        {
            onCompleted: data => {
                console.log(data.card[0])
                setIsUseMainContent(data.card[0].isCardUseMainContent)
                setIsUseMainText(data.card[0].isCardUseMainText)
                setIsUseAdditionalText(data.card[0].isCardUseAdditionalText)
                setIsUseBodyQuestion(data.card[0].isCardUseTestInCard)
                setIsUseBeforeCardQuestion(data.card[0].isCardUseTestBeforeCard)
                setMainContentType(Number(data.card[0].cardContentType[2]))
                setCardHeader(data.card[0].title)
                setCardMainText(data.card[0].text)
            },
            // pollInterval: 3000
        }
        )
    const [updateCard, {data: update_card_data}] = useMutation(UPDATE_CARD, {
        variables: {
            id: cardID,
            subTheme: cardSelectedThemeID.map((e) =>{
                return e / 1000000
            }),
            author: cardAuthorId,
            title: cardHeader,
            cardContentType: mainContentType,
            isCardUseMainContent: isUseMainContent,
            isCardUseMainText: isUseMainText,
            isCardUseAdditionalText: isUseAdditionalText,
            isCardUseTestInCard: isUseBodyQuestion,
            isCardUseTestBeforeCard: isUseBeforeCardQuestion,
            additionalText: cardAdditionalText,
            text: cardMainText,
            videoUrl: cardYoutubeVideoUrl,
            siteUrl: cardSrcToOtherSite,

        },
        onError: error => console.log(error),
        onCompleted: data => {
            setStateOfSave(2)
            console.log(data)
        }

    })
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

    const autoSave = () =>{
        clearTimeout(autoSaveTimer)
        setStateOfSave(0)
        changeAutoSaveTimer(setTimeout(() => {
            setStateOfSave(1)
            console.log("-----autosave-------")
            updateCard()
        }, 4000))
    }

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const { Dragger } = Upload;


    const upload_props = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        accept: "image/png, image/jpeg",
    };



    const isUseMainTextHandle = (e) =>{
        autoSave()
        setIsUseMainText(!isUseMainText)
    }
    const isUseMainContentHandler = (e) =>{
        autoSave()
        setIsUseMainContent(!isUseMainContent)
    }
    const isUseAdditionalTextHandle = (e) =>{
        autoSave()
        setIsUseAdditionalText(!isUseAdditionalText)
    }
    const isUseBodyQuestionHandle = (e) =>{
        autoSave()
        setIsUseBodyQuestion(!isUseBodyQuestion)
    }
    const isUseBeforeCardQuestionHandle = (e) =>{
        autoSave()
        setIsUseBeforeCardQuestion(!isUseBeforeCardQuestion)
    }

    const mainContentTypeHandle = (e) =>{
        autoSave()
        setMainContentType(e.target.value)
    }

    const handleUploadImage = (e) =>{
        const formData = new FormData();
        formData.append('image', e.file);
        formData.append('card', cardID.toString());
        fetch(
            'https://iot-experemental.herokuapp.com/cardfiles/card?update_id='+ cardID,
            {
                method: 'POST',
                body: formData,
            }
        )
            .then((response) => response.json())
            .then((result) => {
                console.log('Success:', result);
                message.success(`${e.file.name} успешно загружен.`);
                setCardImage(result.image)
            })
            .catch((error) => {
                console.error('Error:', error);
                message.error(`${e.file.name} не удалось загрузить`);
            });
    }
    const cardHeaderHandle = (e) =>{
        autoSave()
        setCardHeader(e.target.value)
    }
    const cardMainTextHandle = async (e) =>{
        // console.log(e)
        e ? setCardMainText(e): null
        autoSave()
    }
    const cardYoutubeVideoUrlHandle = (e) =>{
        autoSave()
        setCardYoutubeVideoUrl(e.target.value)
    }
    const cardAdditionalTextHandle = (e) =>{
        autoSave()
        setCardAdditionalText(e.target.value)
    }
    const cardBodyQuestionIdHandle = (e)  =>{
        autoSave()
        const valueWithOnlyNumber = e.target.value.replace(/[^\d]/g, '')
        setCardBodyQuestionId(valueWithOnlyNumber)
    }
    const cardBeforeCardQuestionIdHandle = (e) =>{
        autoSave()
        const valueWithOnlyNumber = e.target.value.replace(/[^\d]/g, '')
        setCardBeforeCardQuestionId(valueWithOnlyNumber)
    }
    const cardSrcToOtherSiteHandle = (e) =>{
        autoSave()
        setCardSrcToOtherSite(e.target.value)
    }
    const cardSelectedThemeIDHandle = (e) =>{
        autoSave()
        // console.log(e)
        const cleanSubThemes: any = []
        e.map((id: any) =>{
            if (id > 1000000){
                cleanSubThemes.push(id)
            }
        })
        setCardSelectedThemeID(cleanSubThemes)
    }
    const memedThemeTree = useMemo(() => <ThemeTree dataForThemeTreeView={dataForThemeTreeView}
                                                    cardSelectedThemeID={cardSelectedThemeID}
                                                    cardSelectedThemeIDHandle={cardSelectedThemeIDHandle}/>,
        [dataForThemeTreeView, cardSelectedThemeID])

    const memedRichTextEditor = useMemo(() => <RichTextEditor cardMainText={cardMainText}
                                                              cardMainTextHandle={cardMainTextHandle} />,
        [cardMainText])
    const memedCardAuthorSelect = useMemo(() =><CardAuthorsSelect cardAuthorId={cardAuthorId}
                                                                  changeCardAuthorId={changeCardAuthorId}
                                                                  autoSave={autoSave}
                                                                  MenuProps={MenuProps}
                                                                  authorData={authorData}
                                                                  cardID={cardID}/>,
        [authorData, cardAuthorId])
    const memedCardEditMenu = useMemo(() =><CardEditMenu
                                                         isUseMainContent={isUseMainContent}
                                                         mainContentType={mainContentType}
                                                         isUseMainText={isUseMainText}
                                                         isUseAdditionalText={isUseAdditionalText}
                                                         isUseBodyQuestion={isUseBodyQuestion}
                                                         isUseBeforeCardQuestion={isUseBeforeCardQuestion}
                                                         isUseMainContentHandler={isUseMainContentHandler}
                                                         mainContentTypeHandle={mainContentTypeHandle}
                                                         isUseMainTextHandle={isUseMainTextHandle}
                                                         isUseAdditionalTextHandle={isUseAdditionalTextHandle}
                                                         isUseBodyQuestionHandle={isUseBodyQuestionHandle}
                                                         isUseBeforeCardQuestionHandle={isUseBeforeCardQuestionHandle}
    />, [isUseMainContent, mainContentType, isUseMainText, isUseAdditionalText, isUseBodyQuestion,
        isUseBeforeCardQuestion])
    if (!card_data){
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    return(
        <div className="col-12">
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
                    {memedCardEditMenu}
                </Col>
            </Row>
            <Row className="">
                <Col className="ml-5 col-6 mt-3">
                    {memedThemeTree}
                </Col>
                <Col>
                    {memedCardAuthorSelect}
                </Col>
            </Row>
            <Row className="mt-2">

                    {isUseMainContent && mainContentType === 0? <Col className="col-12 col-lg-5  mt-4 ml-5">
                        <ReactPlayer controls
                                     url={cardYoutubeVideoUrl}
                                     height={440}
                                     width={770}
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
                {isUseMainContent && (mainContentType === 1 || mainContentType === 2)?
                    <Col className="col-12 col-lg-5  mt-4 ml-5 mr-1" style={{height: "440px"}}
                         >
                        <Dragger {...upload_props}
                                 beforeUpload={() => false}
                                 onChange={handleUploadImage}
                                 style={{backgroundImage: "url(" + cardImage + ")",
                                     backgroundSize: "cover",
                                     backgroundRepeat: "no-repeat",
                                 }}
                        >
                            {/*<iframe src={cardImage}/>*/}
                            <div className="uploader-content">

                                <br/>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">Нажмите или перетащите изображение для загрузки</p>
                                <p className="ant-upload-hint">
                                    Поддерживает загрузку одного изображения
                                </p>
                                <br/>

                            </div>
                        </Dragger>
                        {mainContentType === 1? <div>
                            <TextField
                                className="mt-2 col-12"
                                key={cardID + "srcToOtherSite"}
                                id="standard-flexible"
                                label="Ссылка на внешний сайт"
                                fullWidth
                                value={cardSrcToOtherSite}
                                onChange={cardSrcToOtherSiteHandle}
                            />
                        </div>: null}

                    </Col>
                    : null}
                    {isUseMainContent && isUseMainText?
                        <Col className="col-12 col-lg-6 ml-4 mr-1 mt-4" style={{height: "440px"}}>
                            {memedRichTextEditor}
                    </Col>: null}
            </Row>

            <Row className="mt-4">
                {isUseAdditionalText? <Col className="col-11 ml-5 mt-4">
                    <TextField
                        className="mt-2 col-12"
                        key={cardID + "AdditionalText"}
                        id="standard-multiline-flexible"
                        label="Дополнительный текст"
                        fullWidth
                        multiline
                        value={cardAdditionalText}
                        onChange={cardAdditionalTextHandle}
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
            <Snackbar open={true}>
                <Alert severity="info">
                    {stateOfSave === 0 &&
                    "Изменения не сохранены"}
                    {stateOfSave === 1 &&
                    "Автосохранение"}
                    {stateOfSave === 2 &&
                    "Сохранено"}
                </Alert>
            </Snackbar>
            {/*</Row>*/}

        </div>
    )
}