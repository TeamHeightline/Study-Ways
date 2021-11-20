import React, {useMemo, useState, Fragment} from 'react'
import Typography from "@mui/material/Typography";
import {
    Button, Collapse, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select,
    Snackbar,
    TextField,
} from "@mui/material";
import {Col, Row, Spinner} from "react-bootstrap";
import ReactPlayer from "react-player";


import {useMutation, useQuery} from "@apollo/client";
import Upload from 'antd/es/upload';
import message from 'antd/es/message';
import {InboxOutlined} from '@ant-design/icons';
import 'antd/dist/antd.css';
import {Alert} from '@mui/material';
import RichTextEditor from "./#RichTextEditor";
import ThemeTree from "./#ThemeTree";
import CardAuthorsSelect from "./#CardAuthorsSelect";
import CardEditMenu from "./#CardEditMenu";
import {sort} from "fast-sort";
import {GET_CARD_DATA_BY_ID, GET_OWN_AUTHOR, QUESTION_BY_ID, UPDATE_CARD, GET_THEMES, MenuProps} from "./Struct"
import CopyrightIcon from "@mui/icons-material/Copyright";
import {CardEditArrowNavigationAndBandAQuestions} from './#CardEditArrowNavigationAndBandAQuestions'
import {isMobileHook} from "../../../../../CustomHooks/isMobileHook";
import {CardHardLevel, Mutation, Query} from "../../../../../SchemaTypes";

export default function CardEditByID({cardId, ...props}: any) {
    const [autoSaveTimer, changeAutoSaveTimer] = useState<any>()
    const [stateOfSave, setStateOfSave] = useState(2) // 0- не сохранено 1- сохранение 2- сохранено
    const [allDataLoaded, setAllDataLoaded] = useState(false)

    const [cardID] = useState(cardId ? cardId : props?.match?.params?.id)
    const [cardHeader, setCardHeader] = useState("Название карточки по умолчанию")
    const [cardSelectedThemeID, setCardSelectedThemeID] = useState<number[] | []>([])
    const [cardAuthorId, changeCardAuthorId]: any = useState<number[] | []>([]);

    const [mainContentType, setMainContentType] = useState(0)
    const [cardHardLevel, setCardHardLevel] = useState<CardHardLevel>(CardHardLevel.A_2)
    const [cardMainTextInitial, setCardMainTextInitial] = useState('')
    const [cardMainTextForSave, setCardMainTextForSave] = useState('')
    const [cardYoutubeVideoUrl, setCardYoutubeVideoUrl] = useState("")
    const [cardAdditionalText, setCardAdditionalText] = useState('')
    const [cardBodyQuestionId, setCardBodyQuestionId] = useState<number | string>('')
    const [cardBeforeCardQuestionId, setCardBeforeCardQuestionId] = useState<number | string>('')
    const [cardImage, setCardImage] = useState()
    const [cardSrcToOtherSite, setCardSrcToOtherSite] = useState('')
    const [cardCopyrightText, setCardCopyrightText] = useState('')
    const [arrowBefore, setArrowBefore] = useState('')
    const [arrowUp, setArrowUp] = useState('')
    const [arrowDown, setArrowDown] = useState('')
    const [arrowNext, setArrowNext] = useState('')


    const [isUseMainContent, setIsUseMainContent] = useState(true)
    const [isUseMainText, setIsUseMainText] = useState(true)
    const [isUseAdditionalText, setIsUseAdditionalText] = useState(false)
    const [isUseBodyQuestion, setIsUseBodyQuestion] = useState(false)
    const [isUseBeforeCardQuestion, setIsUseBeforeCardQuestion] = useState(false)
    const [isUseCopyright, setIsUseCopyright] = useState(false)
    const [isUseArrowNavigation, setIsUseArrowNavigation] = useState(false)

    const [dataForThemeTreeView, setDataForThemeTreeView] = useState<any[]>([])
    const isMobile = isMobileHook()


    const {data: authorData} = useQuery(GET_OWN_AUTHOR)
    useQuery(GET_THEMES, {
        onCompleted: themesData => {
            // console.log(themesData.cardGlobalTheme)
            const data: any = []
            themesData.cardGlobalTheme.map((GlobalTheme) => {
                const ThisGlobalTheme: any = {}
                ThisGlobalTheme.title = GlobalTheme.name
                ThisGlobalTheme.id = GlobalTheme.id
                ThisGlobalTheme.value = GlobalTheme.id
                ThisGlobalTheme.isLead = false
                ThisGlobalTheme.pid = 0
                data.push(ThisGlobalTheme)
                GlobalTheme.cardthemeSet.map((Theme) => {
                    const ThisTheme: any = {}
                    ThisTheme.title = Theme.name
                    ThisTheme.id = Theme.id * 1000
                    ThisTheme.value = Theme.id * 1000
                    ThisTheme.pId = ThisGlobalTheme.id
                    ThisGlobalTheme.isLead = false
                    data.push(ThisTheme)
                    Theme.cardsubthemeSet.map((SubTheme) => {
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
                (anyTheme: any) => anyTheme.title.replace(/\D/g, '').length != 0 ? Number(anyTheme.title.replace(/[^\d]/g, '')) : 10000000,
                (anyTheme: any) => anyTheme.title
            ]))
        }
    })
    const get_card_image = () => {
        // https://iot-experemental.herokuapp.com/cardfiles/card?
        fetch("https://iot-experemental.herokuapp.com/cardfiles/card?id=" + cardID)
            .then((response) => response.json())
            .then((data) => {
                try {
                    console.log(data)
                    setCardImage(data[0].image)
                } catch (e) {
                    console.log(e)
                }
            })
    }
    useQuery<Query>(GET_CARD_DATA_BY_ID,
        {
            variables: {
                id: cardID
            },
            fetchPolicy: "network-only",
            onCompleted: async data => {
                console.log(data)
                if (data && data?.cardById) {
                    await setIsUseMainContent(data?.cardById?.isCardUseMainContent || true)
                    await setIsUseMainText(data?.cardById?.isCardUseMainText || true)
                    await setIsUseAdditionalText(data?.cardById?.isCardUseAdditionalText || false)
                    await setIsUseBodyQuestion(data?.cardById?.isCardUseTestInCard || false)
                    await setIsUseBeforeCardQuestion(data?.cardById?.isCardUseTestBeforeCard || false)
                    await setIsUseCopyright(data?.cardById?.isCardUseCopyright || false)
                    await setIsUseArrowNavigation(data?.cardById?.isCardUseArrowNavigation || false)

                    await setCardHardLevel(data?.cardById?.hardLevel || CardHardLevel.A_2)
                    await setMainContentType(Number(data?.cardById?.cardContentType[2]) || 0)
                    await setCardHeader(data?.cardById?.title || "Название карточки по умолчанию")
                    await setCardCopyrightText(data?.cardById?.copyright || "")
                    await setCardMainTextInitial(data?.cardById?.text || "")
                    await setCardMainTextForSave(data?.cardById?.text || "")
                    await setCardSelectedThemeID(data?.cardById?.subTheme?.map((e) => {
                        return (Number(e?.id) * 1000000)
                    }) || [])
                    await changeCardAuthorId(data?.cardById?.author?.map((e) => {
                        return (e.id)
                    }) || [])

                    await setCardYoutubeVideoUrl(data?.cardById?.videoUrl || "")
                    await setCardSrcToOtherSite(data?.cardById?.siteUrl || "")
                    await setCardAdditionalText(data?.cardById?.additionalText || "")
                    await setCardBodyQuestionId(data?.cardById?.testInCard?.id || "")
                    await setCardBeforeCardQuestionId(data?.cardById?.testBeforeCard?.id || "")
                    await setArrowBefore(data?.cardById?.arrowBefore || "")
                    await setArrowUp(data?.cardById?.arrowUp || "")
                    await setArrowDown(data?.cardById?.arrowDown || "")
                    await setArrowNext(data?.cardById?.arrowNext || "")
                    await setAllDataLoaded(true)
                    // await setIsAllDataHadBeenGotFromServer(true)
                    get_card_image()
                }
            },

        })
    const [updateCard] = useMutation<Mutation>(UPDATE_CARD, {
        variables: {
            id: cardID,
            subTheme: cardSelectedThemeID.map((e) => {
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
            isCardUseArrowNavigation: isUseArrowNavigation,
            additionalText: cardAdditionalText,
            text: cardMainTextForSave,
            copyright: cardCopyrightText,
            videoUrl: cardYoutubeVideoUrl,
            siteUrl: cardSrcToOtherSite,
            testInCard: cardBodyQuestionId,
            testBeforeCard: cardBeforeCardQuestionId,
            arrowBefore: arrowBefore,
            arrowUp: arrowUp,
            arrowDown: arrowDown,
            arrowNext: arrowNext,
            hardLevel: String(cardHardLevel).slice(2, 3),
        },
        onError: () => setStateOfSave(3),
        onCompleted: data => {
            if (data?.card?.errors?.length === 0) {
                setStateOfSave(2)
                props?.returnStateOfSave(2)
            } else {
                setStateOfSave(3)
            }

            console.log(data)
        }

    })
    const {data: cardBodyQuestionData,} = useQuery(QUESTION_BY_ID, {
        variables: {
            "id": cardBodyQuestionId
        },
    })


    const {data: cardBeforeCardQuestionData,} = useQuery(QUESTION_BY_ID, {
        variables: {
            "id": cardBeforeCardQuestionId
        },
    })

    const autoSave = () => {
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

    const {Dragger} = Upload;


    const upload_props = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        accept: "image/png, image/jpeg",
    };


    const isUseAdditionalTextHandle = () => {
        autoSave()
        setIsUseAdditionalText(!isUseAdditionalText)
    }
    const isUseBodyQuestionHandle = () => {
        autoSave()
        setIsUseBodyQuestion(!isUseBodyQuestion)
    }
    const isUseBeforeCardQuestionHandle = () => {
        autoSave()
        setIsUseBeforeCardQuestion(!isUseBeforeCardQuestion)
    }

    const mainContentTypeHandle = (e) => {
        autoSave()
        setMainContentType(e.target.value)
    }

    const handleUploadImage = (e) => {
        const formData = new FormData();
        formData.append('image', e.file);
        formData.append('card', cardID.toString());
        fetch(
            'https://iot-experemental.herokuapp.com/cardfiles/card?update_id=' + cardID,
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
    const cardHeaderHandle = (e) => {
        autoSave()
        setCardHeader(e.target.value)
    }
    const cardHardLevelHandler = (e) => {
        autoSave()
        setCardHardLevel(e.target.value)
    }
    const cardYoutubeVideoUrlHandle = (e) => {
        autoSave()
        setCardYoutubeVideoUrl(e.target.value.split("&")[0])
    }
    const cardAdditionalTextHandle = (e) => {
        autoSave()
        setCardAdditionalText(e.target.value)
    }
    const cardBodyQuestionIdHandle = (e) => {
        autoSave()
        const valueWithOnlyNumber = e.target.value.replace(/[^\d]/g, '')
        setCardBodyQuestionId(valueWithOnlyNumber)
    }
    const cardBeforeCardQuestionIdHandle = (e) => {
        autoSave()
        const valueWithOnlyNumber = e.target.value.replace(/[^\d]/g, '')
        setCardBeforeCardQuestionId(valueWithOnlyNumber)
    }
    const cardSrcToOtherSiteHandle = (e) => {
        autoSave()
        setCardSrcToOtherSite(e.target.value)
    }
    const richTextEditorHandle = (e) => {
        setCardMainTextForSave(e)
        autoSave()
    }
    const cardSelectedThemeIDHandle = (e) => {
        autoSave()
        // console.log(e)
        const cleanSubThemes: any = []
        e.map((id: any) => {
            if (id > 1000000) {
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
    const memedCardAuthorSelect = useMemo(() => <CardAuthorsSelect cardAuthorId={cardAuthorId}
                                                                   changeCardAuthorId={changeCardAuthorId}
                                                                   autoSave={autoSave}
                                                                   MenuProps={MenuProps}
                                                                   authorData={authorData}
                                                                   cardID={cardID}/>,
        [authorData, cardAuthorId])
    const memedCardEditMenu = useMemo(() => <CardEditMenu
        {...{
            isUseCopyright, setIsUseCopyright, mainContentType, isUseAdditionalText,
            isUseBodyQuestion, isUseBeforeCardQuestion, mainContentTypeHandle,
            isUseAdditionalTextHandle, isUseBodyQuestionHandle, isUseBeforeCardQuestionHandle, autoSave,
            isUseArrowNavigation, setIsUseArrowNavigation
        }}
    />, [isUseMainContent, mainContentType, isUseMainText, isUseAdditionalText, isUseBodyQuestion,
        isUseBeforeCardQuestion, isUseCopyright, isUseArrowNavigation])
    if (!allDataLoaded) {
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    return (
        <div className="col-12">
            <Typography className="display-4 text-center mt-4" style={{fontSize: '33px'}}>Редактировать
                карточку</Typography>
            {cardId ?
                <Button
                    className="ml-md-5 col-md-2 col-12"
                    variant="outlined" color="primary" onClick={() => {
                    props.onChange("goBack")
                }}>
                    Назад
                </Button> : null}
            <Grid container style={{paddingLeft: isMobile ? 0 : 48}}>
                <Grid item xs={12} md={6} style={{paddingRight: isMobile ? 0 : 24}}>
                    <Typography variant="h5" color="textPrimary" style={{marginTop: 12}}>{"ID: " + cardID}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    {memedCardEditMenu}
                </Grid>
                <Grid item xs={12} md={6}
                      style={{paddingRight: isMobile ? 0 : 24, marginTop: 12}}>
                    <FormControl fullWidth>
                        {/*<InputLabel id="question-author-multiple">Название карточки / Заголовок карточки</InputLabel>*/}
                        <TextField
                            label="Название карточки / Заголовок карточки"
                            fullWidth
                            multiline
                            variant="filled"
                            maxRows={3}
                            // style={{width: "50vw"}}
                            value={cardHeader !== 'Название карточки по умолчанию' ? cardHeader : ""}
                            onChange={cardHeaderHandle}
                        />
                    </FormControl>
                </Grid>
                <Grid xs={12} md={6} item container style={{marginTop: 12}}>
                    <Grid item xs={12} md={6}>
                        <FormControl variant="filled" fullWidth>
                            <InputLabel>Уровень сложности</InputLabel>
                            <Select value={cardHardLevel}
                                    onChange={cardHardLevelHandler}
                                    fullWidth
                                    label={"Уровень сложности"}>
                                <MenuItem value={CardHardLevel.A_0}>
                                    Выпускникам школ
                                </MenuItem>
                                <MenuItem value={CardHardLevel.A_1}>
                                    Успешным лицеистам и гимназистам
                                </MenuItem>
                                <MenuItem value={CardHardLevel.A_2}>
                                    Рядовым студентам
                                </MenuItem>
                                <MenuItem value={CardHardLevel.A_3}>
                                    Будущим специалистам
                                </MenuItem>
                                <MenuItem value={CardHardLevel.A_4}>
                                    Специалистам (Real Science)
                                </MenuItem>
                            </Select>
                        </FormControl>
                        {/*{memedCardAuthorSelect}*/}
                    </Grid>
                </Grid>
                <Grid item xs={12} md={6}
                      style={{marginTop: 24, paddingRight: isMobile ? 0 : 24}}>
                    {memedThemeTree}
                </Grid>
                <Grid item xs={12} md={6} container style={{marginTop: 12}} columnSpacing={isUseCopyright ? 4 : 0}>
                    <Grid item xs={12} md={6}>
                        {memedCardAuthorSelect}
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Collapse in={isUseCopyright}>
                            <TextField
                                variant="outlined"
                                label="Авторские права принадлежат: "
                                fullWidth
                                maxRows={7}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CopyrightIcon/>
                                        </InputAdornment>
                                    ),
                                }}
                                value={cardCopyrightText}
                                onChange={e => {
                                    setCardCopyrightText(e.target.value)
                                    autoSave()
                                }}
                            />
                        </Collapse>
                    </Grid>
                </Grid>
            </Grid>


            <Grid container style={{
                paddingLeft: isMobile ? 0 : 48,
                marginTop: isMobile ? 0 : 6,
            }}>
                <Grid item xs={12} md={6}
                      style={{paddingRight: isMobile ? 0 : 24}}>
                    {isUseMainContent && mainContentType === 0 &&
                    <Fragment>
                        <ReactPlayer controls
                                     url={cardYoutubeVideoUrl}
                                     height={isMobile ? window.innerWidth / 16 * 9 : 384}
                                     width="100%"
                        />
                        <TextField
                            className="mt-2 col-12"
                            label="Ссылка на видео на Youtube"
                            fullWidth
                            variant="filled"
                            value={cardYoutubeVideoUrl}
                            onChange={cardYoutubeVideoUrlHandle}
                        />
                    </Fragment>}
                    {isUseMainContent && (mainContentType === 1 || mainContentType === 2) &&
                    <Fragment>
                        <Dragger {...upload_props}
                                 beforeUpload={() => false}
                                 onChange={handleUploadImage}
                                 style={{
                                     backgroundImage: "url(" + cardImage + ")",
                                     backgroundSize: "cover",
                                     backgroundRepeat: "no-repeat",
                                 }}
                        >
                            <div className="uploader-content">
                                <br/>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined/>
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
                    </Fragment>}
                </Grid>
                <Grid item xs={12} md={6}>
                    <Fragment>
                        {isUseMainContent && isUseMainText && memedRichTextEditor}
                    </Fragment>
                </Grid>
            </Grid>
            <Row className="mt-4">
                {isUseAdditionalText ? <Col className="col-11 ml-md-5 mt-4">
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
                </Col> : null}
            </Row>
            <Collapse in={isUseArrowNavigation || isUseBodyQuestion || isUseBeforeCardQuestion}>
                <CardEditArrowNavigationAndBandAQuestions
                    in={isUseBodyQuestion} value={cardBodyQuestionId}
                    onChange={cardBodyQuestionIdHandle}
                    cardBodyQuestionData={cardBodyQuestionData} in1={isUseBeforeCardQuestion}
                    value1={cardBeforeCardQuestionId} onChange1={cardBeforeCardQuestionIdHandle}
                    cardBeforeCardQuestionData={cardBeforeCardQuestionData}
                    {...{
                        arrowBefore, setArrowBefore, arrowUp, setArrowUp, arrowDown, setArrowDown,
                        arrowNext, setArrowNext, autoSave, isUseArrowNavigation
                    }}
                />
            </Collapse>

            <br/>
            <br/>
            <br/>
            <Snackbar open={true} anchorOrigin={{vertical: 'bottom', horizontal: "center"}}>
                <Alert variant="outlined" severity={stateOfSave !== 3 ? "info" : "error"}>
                    {stateOfSave === 0 &&
                    "Изменения не сохранены"}
                    {stateOfSave === 1 &&
                    "Автосохранение"}
                    {stateOfSave === 2 &&
                    "Сохранено"}
                    {stateOfSave === 3 &&
                    "Ошибка"}
                </Alert>
            </Snackbar>
            {/*</Row>*/}

        </div>
    );
}