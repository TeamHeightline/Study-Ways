import React, {useState} from "react";
import {gql, useMutation, useQuery} from "@apollo/client";
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import {Row, Spinner, Col} from "react-bootstrap";
import TextField from '@material-ui/core/TextField';
import {Button} from "@material-ui/core";

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

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 600,
        maxWidth: 600,
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    },
    noLabel: {
        marginTop: theme.spacing(3),
    },
    margin: {
        margin: theme.spacing(1),
    },
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
}));

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


export default function AddQuestion() {
    const classes = useStyles();
    const theme = useTheme();
    const [author, setAuthor] = React.useState([]);
    const [questionThemes, setQuestionThemes] = useState([]);
    const [authorId, setAuthorId] = React.useState([]);
    const [questionThemesId, setQuestionThemesId] = useState([]);
    const {data, error, loading} = useQuery(GET_THEMES);
    const [questionText, changeQuestionText] = useState('');
    const [questionUrl, changeQuestionUrl] = useState('');
    const [createQuestion, { data: mutation_data, error: mutation_error }] = useMutation(CREATE_QUESTION, {
        variables: {
            createdBy: 0,
            theme: questionThemes,
            author: author,
            text: questionText,
            videoUrl: questionUrl
        }
    })
    // const getQuestionThemesId = () =>{
    //     questionThemes.map((theme) =>{
    //         const index = Data.findIndex(item => item.name === 'John');
    //     })
    // }

    const authorHandleChange = (event: any) => {
        setAuthor(event.target.value);
    };

    const themesHandleChange = (event: any) => {
        console.log(event.target.value)
        setQuestionThemes(event.target.value);
    };

    const urlHandleChange = (event: any) => {
        changeQuestionUrl(event.target.value);
    };


    console.log(data)
    if(!data){
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }


    return (
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
                            onChange={(e) =>{changeQuestionText(e.target.value)}}
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
                                value={questionThemes}
                                onChange={themesHandleChange}
                                input={<Input/>}
                                MenuProps={MenuProps}
                            >
                                {data.questionThemes.map((theme: any) => (
                                    <MenuItem key={theme.id} value={theme.name} >
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
                                value={author}
                                onChange={authorHandleChange}
                                input={<Input/>}
                                MenuProps={MenuProps}
                            >
                                {data.me.questionauthorSet.map((author: any) => (
                                    <MenuItem key={author.id} value={author.name} >
                                        {author.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button variant="outlined" color="primary" className="mt-2   justify-content-end"
                                onClick={(event) =>{
                                    event.preventDefault(); createQuestion().then((returned_data) =>{console.log(returned_data)})}}>
                            Создать вопрос
                        </Button>
                        {console.log(mutation_data)}
                        {console.log(mutation_error)}
                    </div>
                </Col>
            </Row>
        </div>)
}




