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
            <DataGrid rows={rows} columns={columns}   />
        </div>
    )
}



export default function AddQuestion() {

    const {data, error, loading, refetch } = useQuery(GET_THEMES);

    const [oneTimeChecked, changeOneTimeChecked] = useState(false);
    const memedCreateDataGrid = useMemo(()=>createDataGrid(data), [data]);
    const [questionText, changeQuestionText] = useState('');
    const [questionUrl, changeQuestionUrl] = useState('');
    const [authorId, setAuthorId] = React.useState([]);
    const [questionThemesId, setQuestionThemesId] = useState([]);
    const [createQuestion, { data: mutation_data}] = useMutation(CREATE_QUESTION, {
        variables: {
            createdBy: 0,
            theme: questionThemesId,
            author: authorId,
            text: questionText,
            videoUrl: questionUrl
        }
    })
    const [open, setOpen] = React.useState(false);


    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            setOpen(false)
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

    if(!data){
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }

    console.log(mutation_data)
    if(mutation_data){
        if(mutation_data.createQuestion.errors.length === 0){
            if(oneTimeChecked){
                setQuestionThemesId([])
                setAuthorId([])
                changeQuestionText('')
                changeQuestionUrl('')
                refetch()
                setOpen(true)
                changeOneTimeChecked(false)
            }
        }
    }

    return (
        <div>
            {memedCreateDataGrid}
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
                        <FormControl  className="col-12 ml-2" >
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
                        <FormControl className='col-12 ml-2'>
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
                        <Row className="ml-2">
                        <Button variant="outlined" color="primary" className="mt-2   justify-content-end"
                                onClick={(event) =>{
                                    event.preventDefault();
                                    createQuestion()
                                    changeOneTimeChecked(true)
                                }}>
                            Создать вопрос
                        </Button>
                            {mutation_data? createQuestionFunction(): null}
                        </Row>
                        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                            <Alert onClose={handleClose} severity="success">
                                Вопрос успешно создан
                            </Alert>
                        </Snackbar>
                        {/*{console.log(mutation_data)}*/}
                        {/*{console.log(mutation_error)}*/}
                    </div>
                </Col>
            </Row>
        </div>)
}




