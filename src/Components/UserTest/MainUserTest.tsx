import React, {useEffect, useState} from "react";
import {gql, useQuery} from "@apollo/client";
import {Button, Paper, TextField} from "@material-ui/core";
import { Autocomplete} from "@material-ui/lab";
import { Container, Form, Spinner} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import * as _ from "lodash"
import Collapse from '@material-ui/core/Collapse';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import ImageQuestion from "./ImageQuestion";
import QuestionById from "./QuestionByID";

const GET_ALL_QUESTIONS = gql`
query GET_ALL_QUESTIONS{
  question{
    id
    text
    theme{
      id
      name
    }
    author{
      id
      name
    }
  }
}`
const GET_QUESTION_DATA = gql`
      query GET_QUESTION_DATA($id: ID!) {
            questionById(id: $id){
              text
              videoUrl
              id
              isImageQuestion
              answers{
                id
                isTrue
                text
                helpTextv1
                helpTextv2
                helpTextv3
                videoUrl
                checkQueue
                hardLevelOfAnswer
              }
            }
      }
    `

export default function MainUserTest(props: any) {
    const [authorsForSearching, setAuthorsForSearching] = useState<any>([{}])
    const [themesForSearching, setThemesForSearching] = useState<any>([{}])
    const [selectedAuthor, setSelectedAuthor] = useState<any>()
    const [selectedTheme, setSelectedTheme] = useState<any>()
    const [questionsForSelect, setQuestionsForSelect] = useState<any>([{}])

    function returnThemesOfQuestionsWhereAuthorSameThatSelected(data: any, idOfAuthor: any) {
        const themes: any = []
        const questionsAfterSelectedAuthor: any = []
        data.question.map((sameQuestion) => {
            sameQuestion.author.map((sameAuthor) => {
                if (sameAuthor.id === idOfAuthor) {
                    if (!_.some(questionsAfterSelectedAuthor, sameQuestion)) {
                        questionsAfterSelectedAuthor.push(sameQuestion)
                    }
                }
            })
        })
        questionsAfterSelectedAuthor.map((sameQuestion) => {
            sameQuestion.theme.map((sameTheme) => {
                if (!_.some(themes, sameTheme)) {
                    themes.push(sameTheme)
                }
            })
        })
        setSelectedTheme(themes[0].id)
        return (themes)
    }

    function setQuestionForSelectAfterSelectedTheme(justSelectedTheme: any = selectedTheme, justSelectedAuthor: any = selectedAuthor) {
        const questionsAfterSelectedAuthor: any = []
        data.question.map((sameQuestion) => {
            sameQuestion.author.map((sameAuthor) => {
                if (sameAuthor.id === justSelectedAuthor) {
                    if (!_.some(questionsAfterSelectedAuthor, sameQuestion)) {
                        questionsAfterSelectedAuthor.push(sameQuestion)
                    }
                }
            })
        })
        const questionsAfterSelectedTheme: any = []
        questionsAfterSelectedAuthor.map((sameQuestion) => {
            sameQuestion.theme.map((sameTheme) => {
                if (sameTheme.id === justSelectedTheme) {
                    if (!_.some(questionsAfterSelectedTheme, sameQuestion)) {
                        questionsAfterSelectedTheme.push(sameQuestion)
                    }
                }
            })
        })
        setQuestionsForSelect(questionsAfterSelectedTheme)
    }

    const {data, error, loading, refetch} = useQuery(GET_ALL_QUESTIONS, {
        onCompleted: data => {
            const authors: any = []
            data.question.map((sameQuestion) => {
                sameQuestion.author.map(async (sameAuthor) => {
                    if (!_.some(authors, sameAuthor)) {
                        authors.push(sameAuthor)
                    }
                })
            })
            setAuthorsForSearching(authors)
            setSelectedAuthor(authors[0].id)
            setThemesForSearching(returnThemesOfQuestionsWhereAuthorSameThatSelected(data, authors[0].id))
            setQuestionsForSelect(data.question)
        }
    });
    const [helpLevel, changeHelpLevel] = useState("0");
    const [testHadBeenStarted, changeTestHadBeenStarted] = useState(false)
    const [selectedQuestionId, changeSelectedQuestionId] = useState(-1)
    const {
        data: get_question_data, loading: get_question_loading, error: get_question_error,
        refetch: refetch_get_question
    } = useQuery(GET_QUESTION_DATA, {
            variables: {
                id: selectedQuestionId
            },
        }
    );
    const [showAuthorAndThemesSelectorPanel, setShowAuthorAndThemesSelectorPanel] = useState(false)
    const onChangeHelpLevel = (event: any) => changeHelpLevel(event.target.value);
    const autocompliteSelectHandleChange = async (e: any, values: any) => {

        if (values) {
            await changeSelectedQuestionId(values.id)
            refetch_get_question()
        }
    }


    if (!data) {
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    if (!testHadBeenStarted) {
        return (
            <div>
                <Container>
                    <Paper className="col-5 offset-4 mt-5" style={{width: "500px"}}>
                        <br/>
                        <div className="display-4 text-center " style={{fontSize: '33px'}}>Выбирите вопрос и уровень
                            сложности
                        </div>
                        <FormControlLabel
                            className="mt-3"
                            control={
                                <Switch
                                    checked={showAuthorAndThemesSelectorPanel}
                                    onChange={(e) => {
                                        setShowAuthorAndThemesSelectorPanel(e.target.checked)
                                        setQuestionForSelectAfterSelectedTheme()
                                        if (!e.target.checked){
                                            setQuestionsForSelect(data.question)
                                        }
                                    }}
                                    name="checkedB"
                                    color="primary"
                                />
                            }
                            label="Искать по темам или авторам"
                        />
                        <div className="mt-3">
                            <Collapse in={showAuthorAndThemesSelectorPanel}>
                                <Form.Control
                                    className="mt-1"
                                    // size="lg"
                                    as="select"
                                    value={selectedAuthor}
                                    onChange={async (event) => {
                                        await setSelectedAuthor(event.target.value)
                                        await setThemesForSearching(returnThemesOfQuestionsWhereAuthorSameThatSelected(data, event.target.value))
                                        setQuestionForSelectAfterSelectedTheme(returnThemesOfQuestionsWhereAuthorSameThatSelected(data, event.target.value)[0].id,
                                            event.target.value)
                                    }}>
                                    {authorsForSearching.map((author: any) => {
                                        return (<option key={author.id + "authorForSelect"}
                                                        value={author.id}>Автор: {author.name}</option>)
                                    })}
                                </Form.Control>

                                {selectedAuthor && selectedAuthor?.id !== -10 ?
                                    <Form.Control
                                        className="mt-1"
                                        // size="lg"
                                        as="select"
                                        value={selectedTheme}
                                        onChange={async (event) => {
                                            setSelectedTheme(event.target.value)
                                            setQuestionForSelectAfterSelectedTheme(event.target.value)
                                        }}>
                                        {themesForSearching.map((theme: any) => {
                                            return (<option key={theme.id + "themeForSelect"}
                                                            value={theme.id}>Тема: {theme.name}</option>)
                                        })}
                                    </Form.Control> : null}

                            </Collapse>
                        </div>
                        <Autocomplete
                            className="mt-3"
                            id="combo-box-demo"
                            fullWidth
                            options={questionsForSelect}
                            getOptionLabel={(option: any) => option.text}
                            renderInput={(params) => <TextField {...params} label="Вопрос" variant="outlined"/>}
                            onChange={(e: any, values: any) => {
                                autocompliteSelectHandleChange(e, values)
                            }}
                        />
                        <Row className="mt-3">
                            <Col>
                                <Form.Control
                                    className="mt-1"
                                    // size="lg"
                                    as="select"
                                    value={helpLevel}
                                    onChange={onChangeHelpLevel}>
                                    <option value={"0"}>Легкий</option>
                                    <option value={"1"}>Средний</option>
                                    <option value={"2"}>Сложный</option>
                                </Form.Control>
                            </Col>
                            <Col className="offset-2">
                                <Button className="mt-1" variant="contained" color="primary" onClick={() => {
                                    changeTestHadBeenStarted(true)
                                }}>
                                    Начать тест
                                </Button>
                            </Col>
                        </Row>
                        <br/>
                    </Paper>
                </Container>
            </div>
        )
    }

    if (!get_question_data) {
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    if (get_question_data?.questionById?.isImageQuestion){
        return (
            <ImageQuestion id={selectedQuestionId} helpLevel={helpLevel} onChange={(e) =>{
                if(e === "goBack"){
                    changeTestHadBeenStarted(false)
                }
            }}/>
        )
    }
    return (
        <QuestionById id={selectedQuestionId} helpLevel={helpLevel} onChange={(e) =>{
            if(e === "goBack"){
                changeTestHadBeenStarted(false)
            }
        }}/>
    )

}