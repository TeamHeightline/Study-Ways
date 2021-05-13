import React, {useState} from 'react'
import Typography from "@material-ui/core/Typography";
import {
    Button,
    Divider,
    ListItemIcon,
    Menu,
    MenuItem,
     Select,
    TextField,
} from "@material-ui/core";
import Switch from "@material-ui/core/Switch";
import {Col, Row, Spinner} from "react-bootstrap";
import ReactPlayer from "react-player";
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react'
import './styleForCKEditor.css'

import { TreeSelect } from 'antd';


import TextFieldsIcon from '@material-ui/icons/TextFields';
import YouTubeIcon from '@material-ui/icons/YouTube';
import SettingsIcon from '@material-ui/icons/Settings';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import {gql, useQuery} from "@apollo/client";
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import CreateIcon from '@material-ui/icons/Create';
import 'antd/dist/antd.css';


const QUESTION_BY_ID = gql`
    query QUESTION_BY_ID($id: ID!){
        questionById(id: $id){
            text
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

const { SHOW_CHILD, SHOW_ALL } = TreeSelect;


export default function CardEditByID(props){


    const [cardID, setCardID] = useState(1)
    const [cardHeader, setCardHeader] = useState("Заголовок по умолчанию")
    const [cardSelectedThemeID, setCardSelectedThemeID] = useState([])

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
        setIsUseMainText(!isUseMainText)
    }
    const isUseMainContentHandler = (e) =>{
        setIsUseMainContent(!isUseMainContent)
    }
    const isUseAdditionalTextHandle = (e) =>{
        setIsUseAdditionalText(!isUseAdditionalText)
    }
    const isUseBodyQuestionHandle = (e) =>{
        setIsUseBodyQuestion(!isUseBodyQuestion)
    }
    const isUseBeforeCardQuestionHandle = (e) =>{
        setIsUseBeforeCardQuestion(!isUseBeforeCardQuestion)
    }

    const mainContentTypeHandle = (e) =>{
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
        setCardHeader(e.target.value)
    }
    const cardMainTextHandle = async (e) =>{
        e?.target?.value ? setCardMainText(e?.target?.value): null
    }
    const cardYoutubeVideoUrlHandle = (e) =>{
        setCardYoutubeVideoUrl(e.target.value)
    }
    const cardAdditionalTextHandle = (e) =>{
        setCardAdditionalText(e.target.value)
    }
    const cardBodyQuestionIdHandle = (e)  =>{
        const valueWithOnlyNumber = e.target.value.replace(/[^\d]/g, '')
        setCardBodyQuestionId(valueWithOnlyNumber)
    }
    const cardBeforeCardQuestionIdHandle = (e) =>{
        const valueWithOnlyNumber = e.target.value.replace(/[^\d]/g, '')
        setCardBeforeCardQuestionId(valueWithOnlyNumber)
    }
    const cardSrcToOtherSiteHandle = (e) =>{
        setCardSrcToOtherSite(e.target.value)
    }
    const cardSelectedThemeIDHandle = (e) =>{
        // console.log(e)
        const cleanSubThemes: any = []
        e.map((id: any) =>{
            if (id > 1000000){
                cleanSubThemes.push(id)
            }
        })
        setCardSelectedThemeID(cleanSubThemes)
    }

    const tProps = {
        treeDataSimpleMode: true,
        treeData: dataForThemeTreeView,
        value: cardSelectedThemeID,
        onChange: cardSelectedThemeIDHandle,
        treeCheckable: true,

        showCheckedStrategy: SHOW_CHILD,
        placeholder: 'Please select',
        style: {
            width: '100%',
        },
    };

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
                    <Menu
                        id="customized-menu"
                        anchorEl={anchorEl}
                        // keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={isUseMainContentHandler}>
                            <Switch
                                checked={isUseMainContent}
                                onChange={isUseMainContentHandler}
                                name="checkedB"
                                color="secondary"
                            />
                            <ListItemIcon>
                                <YouTubeIcon/>
                            </ListItemIcon>
                            Основной контент
                        </MenuItem>
                        {isUseMainContent?
                            <div>
                            <MenuItem>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={mainContentType}
                                onChange={mainContentTypeHandle}
                                className="col-11 ml-3"
                            >
                                <MenuItem value={0}>Видео с Youtube</MenuItem>
                                <MenuItem value={1}>Ссылка на внешний ресурс</MenuItem>
                                <MenuItem value={2}>Изображение</MenuItem>
                            </Select>
                        </MenuItem>
                        <MenuItem onClick={isUseMainTextHandle}>
                            <Switch
                                checked={isUseMainText}
                                onChange={isUseMainTextHandle}
                                name="checkedB"
                                color="secondary"
                            />
                            <ListItemIcon>
                                <TextFieldsIcon/>
                            </ListItemIcon>
                            Основной текст
                        </MenuItem>
                            </div>
                            : null}
                            <Divider/>
                        <MenuItem onClick={isUseAdditionalTextHandle}>
                            <Switch
                                checked={isUseAdditionalText}
                                onChange={isUseAdditionalTextHandle}
                                name="checkedB"
                                color="secondary"
                            />
                            <ListItemIcon>
                                <CreateIcon/>
                            </ListItemIcon>
                            Дополнительный текст
                        </MenuItem>
                        <Divider/>
                        <MenuItem onClick={isUseBodyQuestionHandle}
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
                        </MenuItem>
                        <MenuItem onClick={isUseBeforeCardQuestionHandle}
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
                        </MenuItem>
                    </Menu>

                </Col>
            </Row>
            <Row className="mt-3">
                <Col className="ml-5 col-6">
                    {dataForThemeTreeView? <TreeSelect {...tProps} />: <Spinner animation="border" variant="success"/>}
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

                        <CKEditor
                            editor={ Editor }
                            style={{maxHeight: "440px"}}
                            config={ {
                                // plugins: [ Paragraph, Bold, Italic, Essentials ],
                                toolbar: [ 'bold', 'italic', 'fontSize', 'link','|', 'undo', 'redo', '|',
                                     'MathType', ],
                                //Можно добавить химические формулы 'ChemType'
                                //и специальные символы 'specialCharacters',

                            } }
                            onReady={ editor => {
                                // You can store the "editor" and use when it is needed.
                                // console.log( 'Editor1 is ready to use!', editor );
                            } }
                            onChange={ ( event, editor ) => {
                                cardMainTextHandle(editor.getData());
                            } }

                        />
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
        </div>
    )
}