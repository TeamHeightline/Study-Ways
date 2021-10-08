import React, { useMemo, useState} from 'react'
import Typography from "@material-ui/core/Typography";
import {
    Button, Collapse, FormControl, Grid, InputAdornment,
    Snackbar,
    TextField,
} from "@material-ui/core";
import {Col, Row, Spinner} from "react-bootstrap";
import ReactPlayer from "react-player";
import './styleForCKEditor.css'


import { useMutation, useQuery} from "@apollo/client";
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import {Alert} from "@material-ui/lab";
import RichTextEditor from "./#RichTextEditor";
import ThemeTree from "./#ThemeTree";
import CardAuthorsSelect from "./#CardAuthorsSelect";
import CardEditMenu from "./#CardEditMenu";
import {sort} from "fast-sort";

import {GET_CARD_DATA_BY_ID, GET_OWN_AUTHOR, QUESTION_BY_ID, UPDATE_CARD, GET_THEMES, MenuProps} from "./Struct"

import CopyrightIcon from "@material-ui/icons/Copyright";





export default function CardEditByID({cardId, ...props}: any){
    const [autoSaveTimer, changeAutoSaveTimer] = useState<any>()
    const [stateOfSave, setStateOfSave] = useState(2) // 0- не сохранено 1- сохранение 2- сохранено
    const [isAllDataHadBeenGotFromServer, setIsAllDataHadBeenGotFromServer] = useState(false)

    const [cardID] = useState(cardId? cardId: props?.match?.params?.id)
    const [cardHeader, setCardHeader] = useState("Заголовок по умолчанию")
    const [cardSelectedThemeID, setCardSelectedThemeID] = useState([])
    const [cardAuthorId, changeCardAuthorId]: any = useState([]);

    const [mainContentType, setMainContentType] = useState(0)
    const [cardMainTextInitial, setCardMainTextInitial] = useState('')
    const [cardMainTextForSave, setCardMainTextForSave] = useState('')
    const [cardYoutubeVideoUrl, setCardYoutubeVideoUrl] = useState("")
    const [cardAdditionalText, setCardAdditionalText] = useState('')
    const [cardBodyQuestionId, setCardBodyQuestionId] = useState(69)
    const [cardBeforeCardQuestionId, setCardBeforeCardQuestionId] = useState(70)
    const [cardImage, setCardImage] = useState()
    const [cardSrcToOtherSite, setCardSrcToOtherSite] = useState('')
    const [cardCopyrightText, setCardCopyrightText] = useState('')



    const [isUseMainContent, setIsUseMainContent] = useState(true)
    const [isUseMainText, setIsUseMainText] = useState(true)
    const [isUseAdditionalText, setIsUseAdditionalText] = useState(false)
    const [isUseBodyQuestion, setIsUseBodyQuestion] = useState(false)
    const [isUseBeforeCardQuestion, setIsUseBeforeCardQuestion] = useState(false)
    const [isUseCopyright, setIsUseCopyright] = useState(false)

    const [dataForThemeTreeView, setDataForThemeTreeView] = useState<any[]>([])



    const {data: authorData} = useQuery(GET_OWN_AUTHOR)
    useQuery(GET_THEMES, {
        onCompleted: themesData => {
            // console.log(themesData.cardGlobalTheme)
            const data: any = []
            themesData.cardGlobalTheme.map((GlobalTheme) =>{
                const ThisGlobalTheme: any = {}
                ThisGlobalTheme.title = GlobalTheme.name
                ThisGlobalTheme.id = GlobalTheme.id
                ThisGlobalTheme.value = GlobalTheme.id
                ThisGlobalTheme.isLead = false
                ThisGlobalTheme.pid = 0
                data.push(ThisGlobalTheme)
                GlobalTheme.cardthemeSet.map((Theme) =>{
                    const ThisTheme: any = {}
                    ThisTheme.title = Theme.name
                    ThisTheme.id = Theme.id * 1000
                    ThisTheme.value = Theme.id * 1000
                    ThisTheme.pId = ThisGlobalTheme.id
                    ThisGlobalTheme.isLead = false
                    data.push(ThisTheme)
                    Theme.cardsubthemeSet.map((SubTheme) =>{
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
            setDataForThemeTreeView(sort(data).asc([
                (anyTheme: any) => anyTheme.title.replace(/\D/g,'').length != 0? Number(anyTheme.title.replace(/[^\d]/g, '')) : 10000000,
                (anyTheme: any) => anyTheme.title
        ]))
        }
    })
    const get_card_image = () =>{
        // https://iot-experemental.herokuapp.com/cardfiles/card?
        fetch("https://iot-experemental.herokuapp.com/cardfiles/card?id=" + cardID)
            .then((response) => response.json())
            .then((data) =>{
                try{
                    console.log(data)
                    setCardImage(data[0].image)
                }
                catch(e){
                    console.log(e)
                }
            })
    }
    const {data: card_data} = useQuery(GET_CARD_DATA_BY_ID,
        {
            variables: {
              id: cardID
            },
            fetchPolicy: "network-only",
            onCompleted: async data => {
                console.log(data)
                await setIsUseMainContent(data.cardById.isCardUseMainContent)
                await setIsUseMainText(data.cardById.isCardUseMainText)
                await setIsUseAdditionalText(data.cardById.isCardUseAdditionalText)
                await setIsUseBodyQuestion(data.cardById.isCardUseTestInCard)
                await setIsUseBeforeCardQuestion(data.cardById.isCardUseTestBeforeCard)
                await setIsUseCopyright(data.cardById.isCardUseCopyright)

                await setMainContentType(Number(data.cardById.cardContentType[2]))
                await setCardHeader(data.cardById.title)
                await setCardCopyrightText(data.cardById.copyright)
                await setCardMainTextInitial(data.cardById.text)
                await setCardMainTextForSave(data.cardById.text)
                await setCardSelectedThemeID(data.cardById.subTheme.map((e) =>{
                    return(e.id*1000000)
                }))
                await changeCardAuthorId(data.cardById.author.map((e) =>{
                    return(e.id)
                }))

                await setCardYoutubeVideoUrl(data.cardById.videoUrl)
                await setCardSrcToOtherSite(data.cardById.siteUrl)
                await setCardAdditionalText(data.cardById.additionalText)
                await setCardBodyQuestionId(data.cardById.testInCard?.id)
                await setCardBeforeCardQuestionId(data.cardById.testBeforeCard?.id)
                await setIsAllDataHadBeenGotFromServer(true)
                get_card_image()
            },

        })
    const [updateCard] = useMutation(UPDATE_CARD, {
        variables: {
            id: cardID,
            subTheme: cardSelectedThemeID.map((e) =>{
                return Number(e / 1000000)
            }),
            author: cardAuthorId,
            title: cardHeader,
            cardContentType: mainContentType,
            isCardUseMainContent: isUseMainContent,
            isCardUseMainText: isUseMainText,
            isCardUseAdditionalText: isUseAdditionalText,
            isCardUseTestInCard: isUseBodyQuestion,
            isCardUseTestBeforeCard: isUseBeforeCardQuestion,
            isCardUseCopyright: isUseCopyright,
            additionalText: cardAdditionalText,
            text: cardMainTextForSave,
            copyright: cardCopyrightText,
            videoUrl: cardYoutubeVideoUrl,
            siteUrl: cardSrcToOtherSite,
            testInCard: cardBodyQuestionId,
            testBeforeCard: cardBeforeCardQuestionId
        },
        onError: error => console.log(error),
        onCompleted: data => {
            setStateOfSave(2)
            if(props.returnStateOfSave){
                props.returnStateOfSave(2)
            }
            console.log(data)
        }

    })
    const {data: cardBodyQuestionData, } = useQuery(QUESTION_BY_ID, {
          variables: {
              "id" : cardBodyQuestionId
          },
    })


    const {data: cardBeforeCardQuestionData, } = useQuery(QUESTION_BY_ID, {
        variables: {
            "id" : cardBeforeCardQuestionId
        },
    })

    const autoSave = () =>{
        clearTimeout(autoSaveTimer)
        setStateOfSave(0)
        props.returnStateOfSave(0)
        changeAutoSaveTimer(setTimeout(() => {
            setStateOfSave(1)
            props.returnStateOfSave(1)
            console.log("-----autosave-------")
            updateCard()
        }, 4000))
    }

    const { Dragger } = Upload;


    const upload_props = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        accept: "image/png, image/jpeg",
    };



    const isUseAdditionalTextHandle = () =>{
        autoSave()
        setIsUseAdditionalText(!isUseAdditionalText)
    }
    const isUseBodyQuestionHandle = () =>{
        autoSave()
        setIsUseBodyQuestion(!isUseBodyQuestion)
    }
    const isUseBeforeCardQuestionHandle = () =>{
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
    const cardYoutubeVideoUrlHandle = (e) =>{
        autoSave()
        setCardYoutubeVideoUrl(e.target.value.split("&list=")[0])
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
    const richTextEditorHandle = (e) =>{
        setCardMainTextForSave(e)
        autoSave()
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
        // if(e >1000000){
        //     cleanSubThemes.push(e)
        // }
        setCardSelectedThemeID(cleanSubThemes)
    }
    const memedThemeTree = useMemo(() => <ThemeTree dataForThemeTreeView={dataForThemeTreeView}
                                                    cardSelectedThemeID={cardSelectedThemeID}
                                                    cardSelectedThemeIDHandle={cardSelectedThemeIDHandle}/>,
        [dataForThemeTreeView, cardSelectedThemeID])

    const memedRichTextEditor = useMemo(() => <RichTextEditor initialText={cardMainTextInitial}
        onChange={richTextEditorHandle}/>,
        [cardMainTextInitial])
    const memedCardAuthorSelect = useMemo(() =><CardAuthorsSelect cardAuthorId={cardAuthorId}
                                                                  changeCardAuthorId={changeCardAuthorId}
                                                                  autoSave={autoSave}
                                                                  MenuProps={MenuProps}
                                                                  authorData={authorData}
                                                                  cardID={cardID}/>,
        [authorData, cardAuthorId])
    const memedCardEditMenu = useMemo(() =><CardEditMenu
        {...{isUseCopyright, setIsUseCopyright,  mainContentType, isUseAdditionalText,
            isUseBodyQuestion, isUseBeforeCardQuestion,  mainContentTypeHandle,
             isUseAdditionalTextHandle, isUseBodyQuestionHandle, isUseBeforeCardQuestionHandle, autoSave}}
    />, [isUseMainContent, mainContentType, isUseMainText, isUseAdditionalText, isUseBodyQuestion,
        isUseBeforeCardQuestion, isUseCopyright])
    if (!card_data){
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    return(
        <div className="col-12">
            <Typography className="display-4 text-center mt-4" style={{fontSize: '33px'}}>Редактировать карточку</Typography>
            {cardId ?
                <Button
                    className="ml-md-5 col-md-2 col-12"
                    variant="outlined" color="primary" onClick={() => {
                    props.onChange("goBack")}}>
                    Назад
                </Button>: null}
            <Grid container style={{paddingLeft: window.innerHeight/window.innerWidth > 1 ? 0:  48}}  >
                <Grid item xs={12} md={6}  style={{paddingRight: window.innerHeight/window.innerWidth > 1 ? 0: 24}}>
                    <Typography variant="h6" color="textPrimary">{"ID: " + cardID + " " + cardHeader}</Typography>
                </Grid>
                <Grid item xs={12} md={6} >
                    {memedCardEditMenu}
                </Grid>
                <Grid item xs={12} md={6}  style={{paddingRight: window.innerHeight/window.innerWidth > 1 ? 0: 24, marginTop: 12}}>
                    <FormControl fullWidth>
                        {/*<InputLabel id="question-author-multiple">Название карточки / Заголовок карточки</InputLabel>*/}
                            <TextField
                                label="Название карточки / Заголовок карточки"
                                fullWidth
                                multiline
                                variant="filled"
                                rowsMax={3}
                                // style={{width: "50vw"}}
                                value={cardHeader}
                                onChange={cardHeaderHandle}
                            />
                    </FormControl>
                </Grid>
                <Grid xs={12} md={6} item container  style={{marginTop: 12}}>
                    <Grid item xs={12} md={6}>
                        {memedCardAuthorSelect}
                    </Grid>
                </Grid>
                <Grid item xs={12} md={6} style={{marginTop:24, paddingRight: window.innerHeight/window.innerWidth > 1 ? 0: 24}}  >
                    {memedThemeTree}
                </Grid>
                <Grid item xs={12} md={6} container style={{marginTop:12}}>
                    <Grid item xs={12} md={6}>
                        <Collapse in={isUseCopyright} >
                            <TextField
                                variant="outlined"
                                label="Авторские права принадлежат: "
                                fullWidth
                                rowsMax={7}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CopyrightIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                value={cardCopyrightText}
                                onChange={e => {
                                    setCardCopyrightText(e.target.value)
                                    autoSave()}}
                            />
                        </Collapse>
                    </Grid>
                </Grid>
            </Grid>
            <Row >
                    {isUseMainContent && mainContentType === 0?
                        <Col className="col-12 col-lg-5  mt-4 ml-md-5" style={{height: window.innerHeight/window.innerWidth > 1? window.innerWidth/16*9 + 40 :"480px"}}>
                        <ReactPlayer controls
                                     url={cardYoutubeVideoUrl}
                                     height={window.innerHeight/window.innerWidth > 1? window.innerWidth/16*9 :440}
                                     width="100%"
                            // className="col-12 col-lg-5" !!!770 px!!!
                        />
                        <TextField
                            className="mt-2 col-12"
                            label="Ссылка на видео на Youtube"
                            fullWidth
                            value={cardYoutubeVideoUrl}
                            onChange={cardYoutubeVideoUrlHandle}
                        />
                    </Col>: null}
                {isUseMainContent && (mainContentType === 1 || mainContentType === 2)?
                    <Col className="col-12 col-lg-5  mt-4 ml-md-5 mr-1" style={{height: "440px"}}
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
                        {mainContentType === 1 &&
                            <TextField
                                className="mt-2 col-12"

                                label="Ссылка на внешний сайт"
                                fullWidth
                                value={cardSrcToOtherSite}
                                onChange={cardSrcToOtherSiteHandle}
                            />}

                    </Col>
                    : null}
                    {isUseMainContent && isUseMainText?
                        <Col className="col-12 col-lg-6 ml-md-4 mr-1 mt-4" style={{height: "440px"}}>
                            {isAllDataHadBeenGotFromServer ? memedRichTextEditor: null}
                    </Col>: null}
            </Row>

            <Row className="mt-4">
                {isUseAdditionalText? <Col className="col-11 ml-md-5 mt-4">
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
                <Col className="col-12 col-lg-5 ml-md-5 mt-4">
                    <Collapse in={isUseBodyQuestion} >
                        <TextField
                            className="mt-2 col-12"
                            label="ID вопроса для тела карточки"
                            fullWidth
                            value={cardBodyQuestionId}
                            onChange={cardBodyQuestionIdHandle}
                        />
                        <Typography>
                            <blockquote/> ТЕКСТ ВОПРОСА: {cardBodyQuestionData?.questionById?.text}<blockquote/>
                        </Typography>
                    </Collapse>
            </Col>
            <Col className="col-12 col-lg-5 mt-4 ml-md-5">
                <Collapse in={isUseBeforeCardQuestion} >
                        <TextField
                            className="mt-2 col-12"
                            label="ID вопроса перед входом в карточку"
                            fullWidth
                            value={cardBeforeCardQuestionId}
                            onChange={cardBeforeCardQuestionIdHandle}
                        />
                        <Typography className="ml-3">
                            <blockquote/> ТЕКСТ ВОПРОСА: {cardBeforeCardQuestionData?.questionById?.text}<blockquote/>
                        </Typography>
                </Collapse>
            </Col>
            </Row>
            <br/>
            <br/>
            <br/>
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