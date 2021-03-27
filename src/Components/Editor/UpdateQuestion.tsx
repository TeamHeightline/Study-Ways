import React, {useMemo, useState} from "react";
import {gql, useMutation, useQuery} from "@apollo/client";
import {Col, Row, Spinner} from "react-bootstrap";
import {Autocomplete} from "@material-ui/lab";
import {Button, TextField} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import AnswerNode from "./AnswerNode";

const CONTEXT_DATA = gql`
query{
  me{
    questionSet{
      id
      theme{
        id
        name
        description
      }
      author{
        id
        name
      }
      text
      videoUrl
      answers{
        id
        isTrue
        text
        helpTextv1
        helpTextv2
        helpTextv3
        checkQueue
        videoUrl
        hardLevelOfAnswer 
      }
    }
    questionauthorSet{
      id
      name
    }
  }
  questionThemes{
    id
    name
    description
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

export default function UpdateQuestion() {

    const {data, error, loading, refetch} = useQuery(CONTEXT_DATA);
    const [questionText, changeQuestionText] = useState('');
    const [questionUrl, changeQuestionUrl] = useState('');
    const [ThemesId, changeThemesId] = useState([]);
    const [authorId, changeAuthorId]: any = useState([]);
    const [selectedQuestion, changeSelectedQuestion]: any = useState()
    const [answersArray, changeAnswersArray]: any = useState([])
    const newAnswer = {
        checkQueue: 0,
        hardLevelOfAnswer: "MEDIUM",
        helpTextv1: '',
        helpTextv2: '',
        helpTextv3: '',
        id: 0,
        isTrue: true,
        text: '',
        videoUrl: ''
    }
    const autocompliteSelectHandleChange = (e: any, values: any) => {
        changeSelectedQuestion(values)
        console.log(values)
        changeAuthorId(values.author.id)
        const authorsIdArray: any = []
        values.author.map((author: any) => {
            authorsIdArray.push(author.id)
        })
        changeAuthorId(authorsIdArray)
        const themesIdArray: any = []
        values.theme.map((theme: any) => {
            themesIdArray.push(theme.id)
        })
        changeThemesId(themesIdArray)
        changeQuestionText(values.text)
        changeQuestionUrl(values.videoUrl)
        changeAnswersArray(values.answers)
    }
    // const answerTextHandleChange = (e: any, answerIndex: number) =>{
    //     const newAnswersArray = [...answersArray]
    //     const newAnswer = {...newAnswersArray[answerIndex]}
    //     newAnswer.text = e.target.value
    //     newAnswersArray[answerIndex] = newAnswer
    //     changeAnswersArray(newAnswersArray)
    // }

    if (!data) {
        return (<Spinner animation="border" variant="success" className=" offset-6 mt-5"/>)
    }
    return (
        <div>
            <div className="display-4 text-center mt-4" style={{fontSize: '33px'}}>Редактировать вопрос</div>
            <div className="col-8 offset-2 mt-3 ">
                <Autocomplete
                    id="combo-box-demo"
                    fullWidth
                    options={data.me.questionSet}
                    getOptionLabel={(option: any) => option.text}
                    renderInput={(params) => <TextField {...params} label="Вопрос" variant="outlined"/>}
                    onChange={(e: any, values: any) => {
                        autocompliteSelectHandleChange(e, values)
                    }}
                />
            </div>
            <Row className="mt-3">
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
                            onChange={(e) => {
                                changeQuestionText(e.target.value)
                            }}
                        />
                        <FormControl className="col-12">
                            <TextField
                                id="standard-basic"
                                label="Ссылка на видео-вопрос"
                                value={questionUrl}
                                onChange={(e) => {
                                    changeQuestionUrl(e.target.value)
                                }}/>
                        </FormControl>
                    </div>
                </Col>
                <Col className="col-md-4  col-10 offset-md-1">
                    <div>
                        {console.log(data)}
                        <FormControl className="col-12 ml-5">
                            <InputLabel id="question-theme-multiple">Темы вопросов</InputLabel>
                            <Select
                                labelId="demo-mutiple-name-label"
                                id="demo-mutiple-name"
                                multiple
                                value={ThemesId}
                                onChange={(e: any) => {
                                    changeThemesId(e.target.value)
                                }}
                                input={<Input/>}
                                MenuProps={MenuProps}
                            >
                                {selectedQuestion ? data.questionThemes.map((theme: any) => (
                                    <MenuItem key={theme.name + theme.id} value={theme.id}>
                                        {theme.name}
                                    </MenuItem>
                                )) : null}
                            </Select>
                        </FormControl>
                        <FormControl className='col-12 ml-5'>
                            <InputLabel id="question-author-multiple">Авторы вопросов</InputLabel>
                            <Select
                                labelId="demo-mutiple-name-label"
                                id="demo-mutiple-name"
                                multiple
                                value={authorId}
                                onChange={(e: any) => {
                                    changeAuthorId(e.target.value)
                                }}
                                input={<Input/>}
                                MenuProps={MenuProps}
                            >
                                {selectedQuestion ? data.me.questionauthorSet.map((author: any) => (
                                    <MenuItem key={author.name + author.id} value={author.id}>
                                        {author.name}
                                    </MenuItem>
                                )) : null}

                            </Select>
                        </FormControl>
                        {/*<Row className="ml-1">*/}
                        {/*    <Button variant="outlined" color="primary" className="mt-2   justify-content-end ml-5"*/}
                        {/*            onClick={(event) =>{*/}
                        {/*                event.preventDefault();*/}
                        {/*                createQuestion()*/}
                        {/*                changeOneTimeChecked(true)*/}
                        {/*            }}>*/}
                        {/*        Создать вопрос*/}
                        {/*    </Button>*/}
                        {/*    {mutation_data? createQuestionFunction(): null}*/}
                        {/*</Row>*/}

                        {/*{console.log(mutation_data)}*/}
                        {/*{console.log(mutation_error)}*/}
                    </div>
                </Col>


            </Row>

            <div className="display-4 text-center mt-3 col-12" style={{fontSize: '33px'}}>Редактировать ответы</div>


            {answersArray.map((answer: any, answerIndex: number) =>
                <AnswerNode className="mt-4" key={answerIndex} answer={answer} answerIndex={answerIndex}
                            answersArray={answersArray}/>)}


        </div>
    )
}