import React, {useState} from "react";
import {gql, useQuery} from "@apollo/client";
import {Button, Paper, TextField} from "@material-ui/core";
import {Autocomplete} from "@material-ui/lab";
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
});

export default function BeforeTestMenu (){
     const {data, error, loading, refetch} = useQuery(GET_ALL_QUESTIONS);
     const [helpLevel, changeHelpLevel] = useState("0");
     const [testHadBeenStarted, changeTestHadBeenStarted] = useState(false)
    const [selectedQuestionId, changeSelectedQuestionId] = useState(-1)
    const { data: get_question_data, loading: get_question_loading, error: get_question_error,
        refetch: refetch_get_question } = useQuery(GET_QUESTION_DATA, { variables:
            {
                id: selectedQuestionId
            }}
    );
    const classes = useStyles();
    const [forRefresh, changeForRefresh] = useState(false)
    const [selected, changeSelected] = useState<number[]>([])
    const onChangeHelpLevel = (event: any) => changeHelpLevel(event.target.value);
    const autocompliteSelectHandleChange = (e : any, values: any) =>{
         // console.log(values.id)
         changeSelectedQuestionId(values.id)
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

    const checkurl=(url: any)=>url.replace("http://","").replace("https://","").replace("www.","").replace("youtu.be/","youtube.com?v=").slice(0,14)==="youtube.com?v=";

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
    else if (!get_question_data){
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
     }

    return (
            <Container className="mt-4">
                {checkurl(get_question_data.questionById.videoUrl)?
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
                </Accordion>: null }

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
                                      onClick = {(e) => {
                                          changeForRefresh(!forRefresh)
                                          selectDeselectRow(answer.id)
                                      }}
                            selected={selected.indexOf(answer.id) !== -1}>
                                <TableCell padding="checkbox">
                                    <Checkbox
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
                <Button variant="contained" color="primary" onClick={() =>{changeTestHadBeenStarted(false)}}>
                    Назад
                </Button>
            </Container>
        )

}