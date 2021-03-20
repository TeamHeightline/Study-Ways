import React, {useMemo, useState} from "react";
import {gql, useMutation, useQuery} from "@apollo/client";

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

import Select from '@material-ui/core/Select';

import {Row, Spinner, Col} from "react-bootstrap";
import TextField from '@material-ui/core/TextField';
import {Button, Snackbar} from "@material-ui/core";

import { DataGrid, ColDef, ValueGetterParams } from '@material-ui/data-grid';
import {Alert} from "@material-ui/lab";

import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';

import AddIcon from '@material-ui/icons/Add';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import  './styleForAddQuestion.css'

import {
    CSSTransition,
    TransitionGroup,
} from 'react-transition-group';

const GET_THEMES = gql`
query GET_THEMES{
  questionThemes{
    id
    name
    description
  }
  me{
    questionauthorSet{
      id
      name
    }
    questionSet{
      id
      theme{
        id
        name
      }
      author{
        id
        name
      }
      text
      videoUrl
    }
  }
}`

const CREATE_QUESTION = gql`
mutation CREATE_QUESTION($createdBy: ID!, $theme: [ID]!, $author: [ID]!, $text: String!, $videoUrl: String!){
  createQuestion(input: {createdBy:  $createdBy, theme: $theme, author: $author, text: $text, videoUrl: $videoUrl}){
    errors{
      field
      messages
    }
    clientMutationId
  }
}`

const CREATE_THEME = gql`
mutation CREATE_THEME($name: String!, $description: String!, $createdBy: ID!){
  createQuestionThemes(input: {name: $name, description: $description, createdBy: $createdBy}){
    errors{
      field
      messages
    }
    clientMutationId
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

const columns: ColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'text', headerName: 'Текст', width: 650 },
    { field: 'authors', headerName: 'Авторы', width: 550 },
    { field: 'themes', headerName: 'Темы', width: 450}
]

const createDataGrid = (data: any) =>{
    const rows: any = []
    if (data){
        data.me.questionSet.map( (question: any) =>{
            const themes = question.theme.map((item: any) => item.name).reduce((prev: any, next: any ) => prev + next);
            const authors =  question.author.map((item: any) => item.name).reduce((prev: any, next: any ) => prev + next);
            rows.push({id: question.id, text: question.text, themes: themes, authors: authors})

        })
    }
    return(
        <div style={{ height: 600, width: '100%' }}>
            <DataGrid rows={rows} columns={columns} onRowClick={(e) =>{console.log(e.row.id)}}  />
        </div>
    )
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        fab: {
            margin: theme.spacing(2),
        },
        absolute: {
            position: 'absolute',
            bottom: theme.spacing(2),
            right: theme.spacing(3),
        },
    }),
);

const columnsForThemesDataGrid: ColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Темы', width: 500 },
]

const createThemesDataGrid = (data: any) =>{
    const rows: any = []
    if (data){
        data.questionThemes.map((theme: any)=>{
            rows.push({id: theme.id, name: theme.name})
        })
    }
    return(
        <div style={{ height: 300 }}>
            <DataGrid rows={rows} columns={columnsForThemesDataGrid}   />
        </div>
    )
}

const columnsForAuthorsDataGrid: ColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Автор вопроса', width: 500 },
]

const createAuthorsDataGrid = (data: any) =>{
    const rows: any = []
    if (data){
        data.me.questionauthorSet.map((author: any)=>{
            rows.push({id: author.id, name: author.name})
        })
    }
    return(
        <div style={{ height: 300 }}>
            <DataGrid rows={rows} columns={columnsForAuthorsDataGrid}   />
        </div>
    )
}



export default function AddQuestion() {

    const {data, error, loading, refetch } = useQuery(GET_THEMES,{
        pollInterval: 2000});

    const [oneTimeChecked, changeOneTimeChecked] = useState(false);// для проверки на ошибки при сохранение вопроса
    const [oneTimeCheckedNewTheme, changeOneTimeCheckedNewTheme] = useState(false);
    const memedCreateDataGrid = useMemo(()=>createDataGrid(data), [data]); //оптимизированное подключение DataGrid
    const memedCreateThemesDataGrid = useMemo(() => createThemesDataGrid(data), [data])
    const memedCreateAuthorsDataGrid = useMemo(() => createAuthorsDataGrid(data), [data])
    const [questionText, changeQuestionText] = useState('');
    const [questionUrl, changeQuestionUrl] = useState('');
    const [authorId, setAuthorId] = React.useState([]);
    const [questionThemesId, setQuestionThemesId] = useState([]);
    const [newThemeName, changeNewThemeName] = useState('')
    const [newThemeDescription, changeNewThemeDescription] = useState('')

    const [createQuestion, { data: mutation_data}] = useMutation(CREATE_QUESTION, {
        variables: {
            createdBy: 0,
            theme: questionThemesId,
            author: authorId,
            text: questionText,
            videoUrl: questionUrl
        }
    })
    const [createTheme, {data: create_theme_data}] = useMutation(CREATE_THEME, {
        variables:{
            createdBy: 0,
            name: newThemeName,
            description: newThemeDescription
        }
    })
    const [userWantsToCreateANewQuestion, changeUserWantsToCreateANewQuestion] = useState(false);
    const [userWantsToCreateANewTheme, changeUserWantsToCreateANewTheme] = useState(false);
    const [open, setOpen] = React.useState(false); // для оповещения о создание вопроса
    const [openThemeNotification, setOpenThemeNotification] = React.useState(false)
    // const [selectedRow, changeSelectedRow] = useState()
    const classes = useStyles();


    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            setOpen(false)
        }}
    const themeNotificationHandleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            setOpenThemeNotification(false)
        }}

    const urlHandleChange = (event: any) => {
        changeQuestionUrl(event.target.value);
    };
    const textHandleChange = (event: any) => {
        changeQuestionText(event.target.value);
    };
    const authorIdHandleChange = (event: any) => {
        setAuthorId(event.target.value);
    };
    const themesIdHandleChange = (event: any) => {
        setQuestionThemesId(event.target.value);
    };
    const newThemeNameHandleChange = (event: any) =>{
        changeNewThemeName(event.target.value)
    }
    const newThemeDescriptionHandleChange = (event: any) =>{
        changeNewThemeDescription(event.target.value)
    }

    const createQuestionFunction = () =>{
        if (mutation_data.createQuestion.errors.length === 0){
            return (<></>)
        }
       else if(mutation_data.createQuestion.errors[0].field === 'theme'){
           return(
               <Alert severity="error">Ошибка в поле темы вопроса, скорее всего вы его оставили пустым</Alert>
           )
       }
       else if(mutation_data.createQuestion.errors[0].field === 'author'){
            return(
                <Alert severity="error">Ошибка в поле автора вопроса, скорее всего вы его оставили пустым</Alert>
            )
       }
        else if(mutation_data.createQuestion.errors[0].field === 'text'){
            return(
                <Alert severity="error">Ошибка в поле текста вопроса, скорее всего вы его оставили пустым</Alert>
            )
        }
        else if(mutation_data.createQuestion.errors[0].field === "video_url"){
            return(
                <Alert severity="error">Ошибка в поле ссылки на видео-вопрос</Alert>
            )
        }
       else{
            return(
                <Alert severity="error">Неизвестная ошибка</Alert>
            )
       }
    }

    const createThemeFunction = () =>{
        if (create_theme_data.createQuestionThemes.errors.length === 0){
            return (<></>)
        }
        else if(create_theme_data.createQuestionThemes.errors[0].field === "name"){
            return <Alert severity='error'>Ошибка в название темы</Alert>
        }
        else if(create_theme_data.createQuestionThemes.errors[0].field === "description"){
            return <Alert severity='error'>Ошибка в описание темы, скорее всего вы его оставили пустым</Alert>
        }
    }

    if(!data){
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }


    if(mutation_data){
        if(mutation_data.createQuestion.errors.length === 0){
            if(oneTimeChecked){
                setQuestionThemesId([])
                setAuthorId([])
                changeQuestionText('')
                changeQuestionUrl('')
                refetch()
                setOpen(true)
                changeUserWantsToCreateANewQuestion(false)
                changeOneTimeChecked(false)
            }
        }
    }
    if(create_theme_data){
        if(create_theme_data.createQuestionThemes.errors.length === 0){
            if(oneTimeCheckedNewTheme){
                changeNewThemeName('')
                changeNewThemeDescription('')
                refetch()
                changeUserWantsToCreateANewTheme(false)
                changeOneTimeCheckedNewTheme(false)
            }
        }
    }


    return (
        <div>
            <div className="mr-3 ml-3 mt-3">
                {memedCreateDataGrid}
            </div>

            <div className= "offset-9 offset-lg-11">
                <Tooltip title="Создать вопрос" aria-label="add" >
                    <Fab color="primary" className={classes.fab}
                         onClick={() =>{changeUserWantsToCreateANewQuestion( !userWantsToCreateANewQuestion)}}>
                        <AddIcon />
                    </Fab>
                </Tooltip>
            </div>

            {userWantsToCreateANewQuestion?

                <div>
                <div className="display-4 text-center mt-3" style={{fontSize: '35px'}}>Создать новый вопрос</div>
                    <Row>
                        <Col className="col-md-6 col-11  ml-5">
                            <div>
                                <TextField
                                    id="standard-multiline-flexible"
                                    label="Текст вопроса"
                                    multiline
                                    fullWidth
                                    rowsMax={4}
                                    // style={{width: "50vw"}}
                                    value={questionText}
                                    onChange={textHandleChange}
                                />
                                <FormControl  className="col-12" >
                                <TextField
                                        id="standard-basic"
                                        label="Ссылка на видео-вопрос"
                                        value={questionUrl}
                                        onChange={urlHandleChange}/>
                                </FormControl>
                            </div>
                        </Col>
                        <Col className="col-md-4  col-10 offset-md-1">
                            <div >
                                <FormControl  className="col-12 ml-5" >
                                    <InputLabel id="question-theme-multiple">Темы вопросов</InputLabel>
                                    <Select
                                        labelId="demo-mutiple-name-label"
                                        id="demo-mutiple-name"
                                        multiple
                                        value={questionThemesId}
                                        onChange={themesIdHandleChange}
                                        input={<Input/>}
                                        MenuProps={MenuProps}
                                    >
                                        {data.questionThemes.map((theme: any) => (
                                            <MenuItem key={theme.name + theme.id} value={theme.id}>
                                                {theme.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl className='col-12 ml-5'>
                                    <InputLabel id="question-author-multiple">Авторы вопросов</InputLabel>
                                    <Select
                                        labelId="demo-mutiple-name-label"
                                        id="demo-mutiple-name"
                                        multiple
                                        value={authorId}
                                        onChange={authorIdHandleChange}
                                        input={<Input/>}
                                        MenuProps={MenuProps}
                                    >
                                        {data.me.questionauthorSet.map((author: any) => (
                                            <MenuItem key={author.name + author.id} value={author.id} >
                                                {author.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Row className="ml-1">
                                <Button variant="outlined" color="primary" className="mt-2   justify-content-end ml-5"
                                        onClick={(event) =>{
                                            event.preventDefault();
                                            createQuestion()
                                            changeOneTimeChecked(true)
                                        }}>
                                    Создать вопрос
                                </Button>
                                    {mutation_data? createQuestionFunction(): null}
                                </Row>

                                {/*{console.log(mutation_data)}*/}
                                {/*{console.log(mutation_error)}*/}
                            </div>
                        </Col>
                    </Row>
                </div> :
                null}
                <Row className="mt-3 mr-2 ml-2">
                    <Col className="col-lg-4 col-12">
                        <div >
                            {memedCreateThemesDataGrid}
                            <div className= "offset-10">
                                <Tooltip title="Создать тему" aria-label="add" >
                                    <Fab color="primary" className={classes.fab}
                                         onClick={() =>{changeUserWantsToCreateANewTheme( !userWantsToCreateANewTheme)}}>

                                        <AddIcon />
                                    </Fab>
                                </Tooltip>
                            </div>
                            {userWantsToCreateANewTheme? <div className="col-11 ">
                                <TextField
                                    id="standard-multiline-flexible"
                                    label="Название новой темы вопроса"
                                    multiline
                                    fullWidth
                                    rowsMax={4}
                                    // style={{width: "50vw"}}
                                    value={newThemeName}
                                    onChange={newThemeNameHandleChange}
                                />
                                <TextField
                                    id="standard-multiline-flexible"
                                    label="Описание новой темы вопроса"
                                    multiline
                                    fullWidth
                                    rowsMax={4}
                                    // style={{width: "50vw"}}
                                    value={newThemeDescription}
                                    onChange={newThemeDescriptionHandleChange}
                                />
                                <Button variant="outlined" color="primary" className="mt-2   justify-content-end"
                                        onClick={(event) =>{
                                            event.preventDefault();
                                            createTheme()
                                            // changeOneTimeChecked(true)
                                            changeOneTimeCheckedNewTheme(true)
                                        }}>
                                    Создать новую тему вопроса
                                </Button>
                                {create_theme_data? createThemeFunction(): null}
                            </div>: null}
                        </div>
                    </Col>
                    <Col className="col-lg-4 col-12 offset-lg-4 mt-3">
                        <div>
                            {memedCreateAuthorsDataGrid}
                        </div>
                    </Col>
                </Row>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    Вопрос успешно создан
                </Alert>
            </Snackbar>
            <Snackbar open={openThemeNotification} autoHideDuration={6000} onClose={themeNotificationHandleClose}>
                <Alert onClose={handleClose} severity="success">
                    Вопрос успешно создан
                </Alert>
            </Snackbar>
            <br/>
            <br/>
            <br/>
        </div>)
}




