import React, {useEffect, useMemo, useState} from "react";
import {gql, useMutation, useQuery} from "@apollo/client";
import {Col, Row, Spinner} from "react-bootstrap";
import {Alert, Autocomplete} from "@material-ui/lab";
import {Button, Container, Snackbar, TextField, Typography} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import AnswerNode from "./AnswerNode";
import AlertTitle from "@material-ui/lab/AlertTitle";
import Switch from "@material-ui/core/Switch";

const CONTEXT_DATA = gql`
query{
  me{
    questionSet{
      id
      isImageQuestion
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

const CREATE_NEW_ANSWER = gql`mutation CREATE_ANSWER($question: ID!){
  createAnswer(input: {createdBy:0, question: $question, isTrue:true, checkQueue: 1, hardLevelOfAnswer:"MEDIUM"}){
    errors{
      field
      messages
    }
  }
}`

const UPDATE_QUESTION = gql`mutation UPDATE_QUESTION($createdBy: ID!, $theme: [ID]!, $author: [ID]!, $text: String!, $videoUrl: String, $id: ID!, $isImageQuestion: Boolean){
  updateQuestion(input: {createdBy:$createdBy, theme: $theme, author: $author, text: $text, videoUrl: $videoUrl, id: $id, isImageQuestion: $isImageQuestion}){
    errors{
      field
      messages
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


const AutocompliteForNotUpdate = (data: any, autocompliteSelectHandleChange: (e: any, values: any) => any) => {
    if (data){
        return(
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

        )
    }else{
        return(<Spinner animation="border" variant="success" className=" offset-6 mt-5"/>)
    }
    }

export default function UpdateQuestion() {
    const {data, error, loading, refetch} = useQuery(CONTEXT_DATA,{
        onCompleted: (data) => {
            if(questionId){
                updateQuestionFromMutationData()
            }
        },
    });

    const autocompliteSelectHandleChange =  (e: any, values: any) => {
        refetch()
        data.me.questionSet.map((question: any, index: any) => {
            if (question.id === values.id) {
                changeQuestionIndex(index)
                // console.log(index)
            }
        })

        // console.log(values)
        changeSelectedQuestion(values)
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
        changeQuestionId(values.id)
        changeQuestionText(values.text)
        changeQuestionUrl(values.videoUrl)
        changeAnswersArray(values.answers)
        setQuestionImageName('')
        setIsImageQuestion(values.isImageQuestion)

        async function getData(){
            const img_data = await fetch("https://iot-experemental.herokuapp.com/files/question?id="+ values.id)
            const img_data_json = await img_data.json()
            if (img_data_json[0]){
                setQuestionImageName(img_data_json[0].image.slice(70).split('?')[0])
            }
        }
        getData();
    }



    const [questionText, changeQuestionText] = useState('');
    const [isImageQuestion, setIsImageQuestion] = useState(false)
    const [questionImage, changeQuestionImage] = useState();
    const [questionUrl, changeQuestionUrl] = useState('');
    const [ThemesId, changeThemesId] = useState([]);
    const [authorId, changeAuthorId]: any = useState([]);
    const [selectedQuestion, changeSelectedQuestion]: any = useState();
    const [questionId, changeQuestionId]: any = useState()
    const [answersArray, changeAnswersArray]: any = useState([])
    const [questionIndex, changeQuestionIndex]: any = useState()
    const [openQuestionUpdateNotification, changeOpenQuestionUpdateNotification] = useState(false)
    const memedAutocomplite = useMemo(() => AutocompliteForNotUpdate(data, autocompliteSelectHandleChange), [data])
    const [selectedQuestionImage, setSelectedQuestionImage] = useState<any>();
    const [isSelectedQuestionImage, setIsSelectedQuestionImage] = useState(false);
    const [questionImageName, setQuestionImageName] = useState('');


    const changeHandlerForQuestionImage = async (event) => {
        if (event.target.files[0]){
            await setSelectedQuestionImage(event.target.files[0]);
            await setIsSelectedQuestionImage(true);
            handleSubmissionQuestionImage(event.target.files[0])
        }
    };

    const handleSubmissionQuestionImage = (img: any) => {
        console.log("---")
        const formData = new FormData();

        formData.append('image', img);
        formData.append('owner_question', questionId);
        fetch(
            'https://iot-experemental.herokuapp.com/files/question?update_id='+ questionId,
            {
                method: 'POST',
                body: formData,
            }
        )
            .then((response) => response.json())
            .then((result) => {
                console.log('Success:', result);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const [create_answer, {data: create_answer_data, loading: create_answer_loading}] = useMutation(CREATE_NEW_ANSWER, {
        variables: {
            question: questionId
        },
        onCompleted: (create_answer_data) => {
            if (create_answer_data.createAnswer.errors.length === 0) {
                 refetch()

            }
        }

    })
    const [update_question, {data: update_question_data, loading: update_question_loading}] = useMutation(UPDATE_QUESTION, {
        variables: {
            createdBy: 0,
            theme: ThemesId,
            author: authorId,
            text: questionText,
            videoUrl: questionUrl,
            id: questionId,
            isImageQuestion: isImageQuestion
        },
        onCompleted: (update_question_data) =>{
            if (update_question_data.updateQuestion.errors.length === 0){
                refetch()
                changeOpenQuestionUpdateNotification(true)
            }
        }
    })

    const updateQuestionNotificationHandleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            changeOpenQuestionUpdateNotification(false)
        }
    }

    const updateQuestionFromMutationData = async () => {
        let values: any = 0
        data.me.questionSet.map((question: any, index: any) =>{
            if (question.id === questionId){
                values = question
                changeQuestionIndex(index)
            }
        })
        // console.log(values)
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
        // console.log(values)
        changeQuestionText(values.text)
        changeQuestionUrl(values.videoUrl)
        changeAnswersArray(values.answers)

    }



    if (!data) {
        return (<Spinner animation="border" variant="success" className=" offset-6 mt-5"/>)
    }
    return (
        <div className="col-12">
            <div className="display-4 text-center mt-4" style={{fontSize: '33px'}}>Редактировать вопрос</div>
            <div className="col-8 offset-2 mt-3 ">
                {memedAutocomplite}
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
                        {/*{console.log(data)}*/}
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
                    </div>
                </Col>
            </Row>
            {questionId? <Col className="col-md-6 col-11  ml-5 mt-2">
                <div>
                    {/*<Alert severity="warning">*/}
                        Разрешить добавлять изображения к ответам
                        <Switch
                            checked={isImageQuestion}
                            onChange={(e) => {
                                console.log(e.target.checked)
                                setIsImageQuestion(e.target.checked)
                            }}
                            name="checkedB"
                            color="secondary"
                        />
                    {/*</Alert>*/}
                </div>
            </Col>: null}

            <Row className="mt-2">
                <Col className="col-1  ml-5">
                    <Button variant="contained" color="primary" onClick={() =>{update_question()}}>
                        Сохранить
                    </Button>
                </Col>
                <Col className="col-2">
                    {selectedQuestion? <div>
                            <Button
                                color="primary"
                                variant="outlined"
                                component="label"
                            >
                                <input type="file"  hidden name="file" onChange={changeHandlerForQuestionImage} />
                                Изображение для вопроса
                            </Button>
                            {isSelectedQuestionImage ? (
                                <div>
                                     {selectedQuestionImage?.name}
                                </div>
                            ) :null}
                            {questionImageName && !isSelectedQuestionImage? <div>{questionImageName}</div>: null}
                        </div>
                    :null}
                </Col>
                {update_question_loading? <Col className="col-1">
                    <Spinner animation="border" variant="success"/>
                </Col> : null }
                {update_question_data? update_question_data.updateQuestion.errors.length !== 0?
                    <Alert severity="error">Ошибка в одном или нескольких полях</Alert>: null : null}
                {questionId? <Col className="text-center mt-2 col-6">
                    <Typography variant="body2" color="textSecondary" component="p">
                    Ссылка на прохождение вопроса - {isImageQuestion?
                        <strong>https://www.sw-university.com/iq/{questionId}</strong>:
                        <strong>https://www.sw-university.com/q/{questionId}</strong>}
                    </Typography>
                    </Col>: null}
            </Row>
            <div className="display-4 text-center mt-3 col-12" style={{fontSize: '33px'}}>Редактировать ответы</div>
            {/* Нужно кэшировать!!!*/}
            {questionIndex !== undefined? console.log(data.me.questionSet[questionIndex].answers): null}
            {questionIndex !== undefined? data?.me?.questionSet[questionIndex]?.answers.map((answer: any, answerIndex: number) =>{
                    console.log(questionIndex)
                    return(<AnswerNode className="mt-4" key={answer.id} answer={answer} answerIndex={answerIndex} questionID={questionId} isImageQuestion={isImageQuestion}/>)
                    }
                ): null}
            {selectedQuestion?
                <Container>
                    <Button variant="outlined" color="primary" className="col-12 mt-3 justify-content-center"
                            size="large"  onClick={() => create_answer()}>
                        Создать новый ответ
                    </Button>
                </Container>
                : null }
            {create_answer_loading? <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>: null}
            <Snackbar open={openQuestionUpdateNotification} autoHideDuration={6000} onClose={updateQuestionNotificationHandleClose}>
                <Alert onClose={updateQuestionNotificationHandleClose} severity="success">
                    Содержание вопроса обновлено
                </Alert>
            </Snackbar>
            {/*{console.log(create_answer_data)}*/}
            <br/>
            <br/>
        </div>
    )
}