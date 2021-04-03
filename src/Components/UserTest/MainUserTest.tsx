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

const GET_ALL_QUESTIONS = gql`
query GET_ALL_QUESTIONS{
  question{
    id
    text
    
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

export default function MainUserTest (){
     const {data, error, loading, refetch} = useQuery(GET_ALL_QUESTIONS);
     const [helpLevel, changeHelpLevel] = useState("0");
     const [testHadBeenStarted, changeTestHadBeenStarted] = useState(false)
    const [selectedQuestionId, changeSelectedQuestionId] = useState(-1)
    const { data: get_question_data, loading: get_question_loading, error: get_question_error,
        refetch: refetch_get_question } = useQuery(GET_QUESTION_DATA, { variables:
            {
                id: selectedQuestionId
            },
        pollInterval: 5000},
    );
    const classes = useStyles();
    const [forRefresh, changeForRefresh] = useState(false)
    const [selected, changeSelected] = useState<number[]>([])
    const [activeWrongQuestionId, changeActiveWrongQuestionId] = useState(-10)
    const [activeWrongAnswerIndex, changeActiveWrongAnswerIndex] = useState(-10)
    const [errorArray, changeErrorArray] = useState<any[]>([])
    const [tryingCalculation, changeTryingCalculation] = useState(0)
    const [oneTimePusshCheckErrorButton, changeOneTimePusshCheckErrorButton] = useState(false)
    const onChangeHelpLevel = (event: any) => changeHelpLevel(event.target.value);
    const autocompliteSelectHandleChange = async (e : any, values: any) =>{
         // console.log(values.id)
         await changeSelectedQuestionId(values.id)
            refetch_get_question()
    }


    function selectDeselectRow(id: any){
        // console.log(id)

        if( selected.indexOf(id) === -1) {
            const oldSelected = selected
            oldSelected.push(id)
            // console.log(oldSelected)
            changeSelected(oldSelected)
        }
        else{
            const oldSelected = selected
            oldSelected.splice(selected.indexOf(id), 1)
            changeSelected(oldSelected)
        }
    }

    async function checkErrors(){
        changeOneTimePusshCheckErrorButton(true)
        changeTryingCalculation(tryingCalculation + 1)
        await changeErrorArray([])
        const oErrArr: any[] = []
        let minCheckQueue = 100
        get_question_data.questionById.answers.map((question: any, Index: number) =>{
            if (question.isTrue !== (selected.indexOf(question.id) !== -1)){
                if((activeWrongQuestionId === -10) || (question.checkQueue === 100)){
                    changeActiveWrongQuestionId(question.id)
                    minCheckQueue = question.checkQueue
                    changeActiveWrongAnswerIndex(Index)
                }
                if(question.checkQueue < minCheckQueue){
                    changeActiveWrongQuestionId(question.id)
                    minCheckQueue = question.checkQueue
                    changeActiveWrongAnswerIndex(Index)
                }

                oErrArr.push(question.id)
            }
        })
        changeErrorArray(oErrArr)
    }

    const checkurl=(url: any)=> url? url.replace("http://","").replace("https://","").replace("www.","")
        .replace("youtu.be/","youtube.com?v=").replace("youtube.com/watch?v=", "youtube.com?v=").slice(0,14)==="youtube.com?v=": false;

    if (!data){
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )}
    // {console.log(activeWrongQuestionId)}
    if (!testHadBeenStarted){
         return(
             <div>
                 <Container>
                     <Paper className="col-5 offset-4 mt-5" style={{width: "500px"}}>
                         <br/>
                         <div className="display-4 text-center " style={{fontSize: '33px'}}>Выбирите вопрос и уровень сложности</div>
                         <Autocomplete
                             className="mt-3"
                             id="combo-box-demo"
                             fullWidth
                             options={data.question}
                             getOptionLabel={(option: any) => option.text}
                             renderInput={(params) => <TextField {...params} label="Вопрос" variant="outlined"/>}
                             onChange={(e: any, values: any) => {
                                 autocompliteSelectHandleChange(e, values)
                             }}
                         />
                         <Row  className="mt-3">
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
                                 <Button className="mt-1" variant="contained" color="primary" onClick={() =>{changeTestHadBeenStarted(true)}}>
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

    if (!get_question_data){
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )}
    if (errorArray.length === 0 && oneTimePusshCheckErrorButton){
        return (
            <Container className="mt-5">
                <Alert severity="success">
                    <AlertTitle>Прздравляем</AlertTitle>
                    Вы успешно прошли тест, колличество попыток -  <strong>{tryingCalculation}</strong>
                </Alert>
            </Container>
        )
    }
    return (
            <Container className="mt-4">

                {errorArray.length !== 0?<div>
                    {helpLevel === "0"? <Alert severity="error" variant="outlined">
                        {get_question_data.questionById.answers[activeWrongAnswerIndex].helpTextv1}</Alert>: null}
                    {helpLevel === "1"? <Alert severity="error" variant="outlined">
                        {get_question_data.questionById.answers[activeWrongAnswerIndex].helpTextv2}</Alert>: null}
                    {helpLevel === "2"? <Alert severity="error" variant="outlined">
                        {get_question_data.questionById.answers[activeWrongAnswerIndex].helpTextv3}</Alert>: null}

                    {get_question_data.questionById.answers[activeWrongAnswerIndex].videoUrl ?
                        <div>
                            {checkurl(get_question_data.questionById.answers[activeWrongAnswerIndex].videoUrl)?
                                <Accordion >
                                    <Card>
                                        <Card.Header>
                                            <Accordion.Toggle as={Button}  eventKey="1">
                                                Отобразить видео подсказку
                                            </Accordion.Toggle>
                                        </Card.Header>
                                        <Accordion.Collapse eventKey="1">
                                            <ReactPlayer url={get_question_data.questionById.answers[activeWrongAnswerIndex].videoUrl}
                                                         controls autoPlay={true}/>
                                        </Accordion.Collapse>
                                    </Card>
                                </Accordion>: null}
                        </div>: null}
                </div> : null}

                {get_question_data.questionById.videoUrl ? checkurl(get_question_data.questionById.videoUrl)?
                    <Accordion  >

                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button}  eventKey="1">
                                Отобразить видео вопрос
                                {/*{console.log(data?.questionById.videoUrl)}*/}
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="1">
                            <ReactPlayer url={get_question_data.questionById.videoUrl} controls autoPlay={true}/>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>: null : null }

            <TableContainer component={Paper} className="">

                <Table className={classes.table} size='medium' aria-label="a dense table">
                    {/*<TableHead>*/}
                    {/*    <TableRow>*/}
                    {/*        <TableCell> </TableCell>*/}
                    {/*        <TableCell align="center">Ответы</TableCell>*/}
                    {/*    </TableRow>*/}
                    {/*</TableHead>*/}
                    <TableBody>
                        {get_question_data.questionById.answers.map((answer: any) => (
                            <TableRow key={answer.id} hover  role="checkbox"
                                      classes={{ selected: classes.selected }}
                                      className={classes.tableRow}
                                      onClick = {(e) => {
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
                                        inputProps={{ 'aria-labelledby': answer.id }}
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
                        <Button variant="contained" color="primary" onClick={() =>{changeTestHadBeenStarted(false)}}>
                            Назад
                        </Button>
                    </Col>
                    <Col className="col-1">
                        <Button variant="contained" color="primary" onClick={() =>{checkErrors()}}>
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