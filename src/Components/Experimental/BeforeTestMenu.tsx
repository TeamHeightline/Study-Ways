import React, {useState} from "react";
import {gql, useQuery} from "@apollo/client";
import {Button, Paper, TextField} from "@material-ui/core";
import {Autocomplete} from "@material-ui/lab";
import {Container, Form, Spinner} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

const GET_ALL_QUESTIONS = gql`
query GET_ALL_QUESTIONS{
  question{
    id
    text
    
  }
}`


export default function BeforeTestMenu (){
     const {data, error, loading, refetch} = useQuery(GET_ALL_QUESTIONS);
     const [helpLevel, changeHelpLevel] = useState("0");
     const [testHadBeenStarted, changeTestHadBeenStarted] = useState(false)

    const onChangeHelpLevel = (event: any) => changeHelpLevel(event.target.value);
     const autocompliteSelectHandleChange = (e : any, values: any) =>{
         console.log(values)
     }
     if (!data){
         return(
             <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
         )
     }
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
    else{
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
     }
}