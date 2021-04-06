import React, {useState} from "react";
import {gql, useQuery} from "@apollo/client";
import {Button, Paper, TextField} from "@material-ui/core";
import {Alert, Autocomplete} from "@material-ui/lab";
import {Accordion, Card, Container, Form, Spinner} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Table from "react-bootstrap/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Checkbox from "@material-ui/core/Checkbox";
import ReactPlayer from "react-player";
import {any} from "prop-types";
import AlertTitle from "@material-ui/lab/AlertTitle";
import * as _ from "lodash"
import Collapse from '@material-ui/core/Collapse';
import Typography from "@material-ui/core/Typography";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Grow from "@material-ui/core/Grow";
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
const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    tableRow: {
        "&$selected, &$selected:hover": {
            backgroundColor: '#d8f1ff'
        }
    },
    tableCell: {
        "$selected &": {
            color: "yellow"
        }
    },
    selected: {}
});

export default  function MainUserTest() {
    const [authorsForSearching, setAuthorsForSearching] = useState<any>([{}])
    const [themesForSearching, setThemesForSearching] = useState<any>([{}])
    const [selectedAuthor, setSelectedAuthor] = useState<any>()
    const [selectedTheme, setSelectedTheme] = useState<any>()
    const [questionsForSelect, setQuestionsForSelect] = useState<any>([{}])
    function returnThemesOfQuestionsWhereAuthorSameThatSelected(data: any, idOfAuthor: any){
        const themes: any = []
        const questionsAfterSelectedAuthor: any =[]
        data.question.map((sameQuestion) => {
            sameQuestion.author.map((sameAuthor) =>{
                if(sameAuthor.id === idOfAuthor){
                    if(!_.some(questionsAfterSelectedAuthor, sameQuestion)){
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
        return(themes)
    }
    function setQuestionForSelectAfterSelectedTheme(justSelectedTheme: any = selectedTheme, justSelectedAuthor: any = selectedAuthor){
        const questionsAfterSelectedAuthor: any =[]
        data.question.map((sameQuestion) => {
            sameQuestion.author.map((sameAuthor) =>{
                if(sameAuthor.id === justSelectedAuthor){
                    if(!_.some(questionsAfterSelectedAuthor, sameQuestion)){
                        questionsAfterSelectedAuthor.push(sameQuestion)
                    }
                }
            })
        })
        const questionsAfterSelectedTheme: any =[]
        questionsAfterSelectedAuthor.map((sameQuestion) => {
            sameQuestion.theme.map((sameTheme) =>{
                if(sameTheme.id === justSelectedTheme){
                    if(!_.some(questionsAfterSelectedTheme, sameQuestion)){
                        questionsAfterSelectedTheme.push(sameQuestion)
                    }
                }
            })
        })
        console.log(questionsAfterSelectedTheme)
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
    const [answers, setAnswers] = useState<any>([{}])
    const [kolShowAnswers, setKolShowAnswers] = useState(8)
    const {
        data: get_question_data, loading: get_question_loading, error: get_question_error,
        refetch: refetch_get_question
    } = useQuery(GET_QUESTION_DATA, {
            variables: {
                id: selectedQuestionId
            },
            onCompleted: get_question_data => {
                let ans = get_question_data.questionById.answers;
                ans = _.shuffle(ans);
                const trueAns = _.shuffle(_.filter(ans, {isTrue: true}));
                const wrongAns = _.filter(ans, {isTrue: false}).slice(0, kolShowAnswers - trueAns.length);
                const trueAndWrongAnswer = [...trueAns, ...wrongAns]
                setAnswers(_.shuffle(trueAndWrongAnswer))
            }
        }
    );
    const classes = useStyles();
    const [forRefresh, changeForRefresh] = useState(false)
    const [selected, changeSelected] = useState<number[]>([])
    const [activeWrongQuestionId, changeActiveWrongQuestionId] = useState(-10)
    const [activeWrongAnswerIndex, changeActiveWrongAnswerIndex] = useState(-10)
    const [errorArray, changeErrorArray] = useState<any[]>([])
    const [tryingCalculation, changeTryingCalculation] = useState(0)
    const [oneTimePusshCheckErrorButton, changeOneTimePusshCheckErrorButton] = useState(false)
    const [showAuthorAndThemesSelectorPanel, setShowAuthorAndThemesSelectorPanel] = useState(false)
    const onChangeHelpLevel = (event: any) => changeHelpLevel(event.target.value);
    const autocompliteSelectHandleChange = async (e: any, values: any) => {
        // console.log(values.id)
        if (values) {
            await changeSelectedQuestionId(values.id)
            refetch_get_question()
        }
    }


    function selectDeselectRow(id: any) {
        // console.log(id)

        if (selected.indexOf(id) === -1) {
            const oldSelected = selected
            oldSelected.push(id)
            // console.log(oldSelected)
            changeSelected(oldSelected)
        } else {
            const oldSelected = selected
            oldSelected.splice(selected.indexOf(id), 1)
            changeSelected(oldSelected)
        }
    }

    async function checkErrors() {
        changeOneTimePusshCheckErrorButton(true)
        changeTryingCalculation(tryingCalculation + 1)
        await changeErrorArray([])
        const oErrArr: any[] = []
        let minCheckQueue = 10000000000000000000000
        answers.map((question: any, Index: number) => {
            if ((question.isTrue && (selected.indexOf(question.id) === -1)) || (!question.isTrue && (selected.indexOf(question.id) !== -1))) {
                // console.log(question)
                if (question.checkQueue < minCheckQueue) {
                    changeActiveWrongQuestionId(question.id)
                    minCheckQueue = question.checkQueue
                    changeActiveWrongAnswerIndex(Index)
                }
                oErrArr.push(question.id)
            }

        })
        changeErrorArray(oErrArr)
    }

    const checkurl = (url: any) => url ? url.replace("http://", "").replace("https://", "").replace("www.", "")
        .replace("youtu.be/", "youtube.com?v=").replace("youtube.com/watch?v=", "youtube.com?v=").slice(0, 14) === "youtube.com?v=" : false;

    if (!data) {
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    // if (!selectedAuthor){
    //     setSelectedAuthor(authorsForSearching[0].id)
    // }
    // {console.log(activeWrongQuestionId)}
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
                                {/*{console.log(selectedAuthor)}*/}
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
                                {/*{console.log(selectedTheme)}*/}
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
    if (errorArray.length === 0 && oneTimePusshCheckErrorButton) {
        return (
            <Container className="mt-5">
                <Alert severity="success">
                    <AlertTitle>Прздравляем</AlertTitle>
                    Вы успешно прошли тест, колличество попыток - <strong>{tryingCalculation}</strong>
                </Alert>
            </Container>
        )
    }
    return (
        <Container className="mt-4">
            <div className="display-4 text-center"
                 style={{fontSize: '35px'}}>{get_question_data?.questionById?.text}</div>
            {errorArray.length !== 0 ? <div>
                {helpLevel === "0" ? <Alert severity="error" variant="outlined">
                    {answers[activeWrongAnswerIndex].helpTextv1}</Alert> : null}
                {helpLevel === "1" ? <Alert severity="error" variant="outlined">
                    {answers[activeWrongAnswerIndex].helpTextv2}</Alert> : null}
                {helpLevel === "2" ? <Alert severity="error" variant="outlined">
                    {answers[activeWrongAnswerIndex].helpTextv3}</Alert> : null}

                {answers[activeWrongAnswerIndex].videoUrl ?
                    <div>
                        {checkurl(answers[activeWrongAnswerIndex].videoUrl) ?
                            <Accordion>
                                <Card>
                                    <Card.Header>
                                        <Accordion.Toggle as={Button} eventKey="1">
                                            Отобразить видео подсказку
                                        </Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="1">
                                        <ReactPlayer url={answers[activeWrongAnswerIndex].videoUrl}
                                                     controls autoPlay={true}/>
                                    </Accordion.Collapse>
                                </Card>
                            </Accordion> : null}
                    </div> : null}
            </div> : null}

            {get_question_data.questionById.videoUrl ? checkurl(get_question_data.questionById.videoUrl) ?
                <Accordion>

                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} eventKey="1">
                                Отобразить видео вопрос
                                {/*{console.log(data?.questionById.videoUrl)}*/}
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="1">
                            <ReactPlayer url={get_question_data.questionById.videoUrl} controls autoPlay={true}/>
                        </Accordion.Collapse>
                    </Card>
                </Accordion> : null : null}

            <TableContainer component={Paper} className="">

                <Table className={classes.table} size='medium' aria-label="a dense table">
                    {/*<TableHead>*/}
                    {/*    <TableRow>*/}
                    {/*        <TableCell> </TableCell>*/}
                    {/*        <TableCell align="center">Ответы</TableCell>*/}
                    {/*    </TableRow>*/}
                    {/*</TableHead>*/}
                    <TableBody>
                        {answers.map((answer: any) => (
                            <TableRow key={answer.id} hover role="checkbox"
                                      classes={{selected: classes.selected}}
                                      className={classes.tableRow}
                                      onClick={(e) => {
                                          changeForRefresh(!forRefresh)
                                          selectDeselectRow(answer.id)
                                      }}
                                      selected={selected.indexOf(answer.id) !== -1
                                      }>
                                <TableCell padding="checkbox"
                                           className={classes.tableCell}>
                                    <Checkbox
                                        color="primary"
                                        checked={selected.indexOf(answer.id) !== -1}
                                        inputProps={{'aria-labelledby': answer.id}}
                                    />
                                </TableCell>
                                <TableCell align="left">{answer.text}</TableCell>
                            </TableRow>
                        ))}

                    </TableBody>
                </Table>
            </TableContainer>
            <Row className="mt-3">
                <Col className="col-1">
                    <Button variant="contained" color="primary" onClick={() => {
                        changeTestHadBeenStarted(false)
                    }}>
                        Назад
                    </Button>
                </Col>
                <Col className="col-1">
                    <Button variant="contained" color="primary" onClick={() => {
                        checkErrors()
                    }}>
                        Проверить
                    </Button>
                </Col>
            </Row>
            <br/>
            <br/>
            <br/>
        </Container>
    )

}