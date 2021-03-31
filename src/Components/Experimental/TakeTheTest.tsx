import React, {useState} from "react";
import { gql, useQuery } from '@apollo/client';
import {Accordion, Button, Card, Container, Form, Row, Spinner} from "react-bootstrap";
import ReactPlayer from "react-player";
import {DataGrid} from "@material-ui/data-grid";
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";
import {blue} from "@material-ui/core/colors";
import {ShowErrorsOnScreen} from "../UserTests/ShowErrorsOnScreen"
import {Typography} from "@material-ui/core";


interface Answer{
    id: number;
    isTrue: boolean;
    text: string;
    helpTextv1: string;
    helpTextv2: string;
    helpTextv3: string;
    videoUrl: string;
    checkQueue: number;
    hardLevelOfAnswer: string;
}

interface QuestionVars{
    id: number;
}
interface QuestionData{
    id: number;
    text: string;
    videoUrl: string;
    answers: Answer[];
}
interface QuestionById{
    questionById: QuestionData;
}

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

export function TakeTheTest(){
    const { loading, error, data } = useQuery<QuestionById, QuestionVars>(GET_QUESTION_DATA, { variables:
            {
                id: 1
            }}
    );
    // Уровень сложности проверки
    const [helpLevel, changeHelpLevel] = useState('0')
    const onChangeHelpLevel = (event: any) => changeHelpLevel(event.target.value);
    const [oneTimeErrorCheck, changeOneTimeErrorCheck] = useState(false);
    const [userErrors, changeUserErrors] = useState<number[]>([]);
    // console.log(data)
    if (loading)
        return <div className="display-1 text-center">Loading...;
            <Spinner animation="grow" variant="primary" />
        </div>
    if (error) console.log(`Error! ${error.message}`)

    //Заполнение строк
    const rows: Array<{id: number, text: string}> = []
    data?.questionById.answers.forEach((answer, answerIndex) =>{
         rows.push({id: answerIndex, text: answer.text})
        // console.log('New render')
    })

    //Установка колонок
    const columns = [{
        field: 'text',
        headerName: 'Ответы на вопрос',
        width: 2700,
    }];
    //Установка темы
    const theme = createMuiTheme({
        palette: {
            primary: blue,
            secondary: blue,
        },
    });
    //Получение массива выбраных строк
    const selectedRows: number[] = [];

    function selectDeselectRow(RowSelectedParams: any){
        if(RowSelectedParams.isSelected && selectedRows.indexOf(RowSelectedParams.data.id) === -1) {
            selectedRows.push(RowSelectedParams.data.id)
        }
        if (!RowSelectedParams.isSelected){
            selectedRows.splice(selectedRows.indexOf(RowSelectedParams.data.id), 1)
        }
    }
    //Проверка ответов
    function checkUserErrors(){
        let newUserErrors: number[] = []
        let minCheckQueue = 10000
        data?.questionById.answers.forEach( (answer, answersIndex) =>{
            if(answer.isTrue === (selectedRows.indexOf(answersIndex) === -1)){
                // console.log(answersIndex)
                // очередью проверки, чем меньше число, тем раньше будет произведена проверка
                if (answer.checkQueue < minCheckQueue){
                    newUserErrors=[]
                    newUserErrors.push(answersIndex)
                    minCheckQueue = answer.checkQueue
                    // console.log(answer)
                }
            }
        })
        // console.log(userErrors)
        changeOneTimeErrorCheck(true)
        changeUserErrors(newUserErrors)
    }
    return(
        <>
            <Container>
                <div className="display-4" style={{fontSize: '35px'}}>{data?.questionById.text}</div>
                <Accordion  className="mt-4">
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                Отобразить видео вопрос
                                {/*{console.log(data?.questionById.videoUrl)}*/}
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="1">
                            <ReactPlayer url={data?.questionById.videoUrl} controls autoPlay={true}/>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>

                <ShowErrorsOnScreen errorArray={userErrors} answers={data?.questionById.answers}
                                    oneTimeErrorCheck={oneTimeErrorCheck} HelpLevel={helpLevel}
                                    showHelpVideo={true}/>

                <ThemeProvider theme={theme}>
                <DataGrid rows={rows} columns={columns}  checkboxSelection autoHeight={true}
                          disableColumnMenu={true} hideFooter={true} disableExtendRowFullWidth={false}
                          showCellRightBorder={true} showToolbar={false} pageSize={10}
                          onRowSelected={(RowSelectedParams) =>{selectDeselectRow(RowSelectedParams)}}
                          disableColumnSelector={true} rowHeight={60}
                />
                <Row>
                    <Button onClick={() =>{checkUserErrors()} } variant="outline-info" className="ml-3 mt-2">Проверить ответы</Button>
                    <Form className="mr-3 ml-3 mt-2">
                        {/*<Form.Label>Выбирите уровень пояснений к ответам</Form.Label>*/}
                        <Form.Control as="select"
                                      value={helpLevel}
                                      onChange={onChangeHelpLevel}>
                            <option value={"0"}>Легкий</option>
                            <option value={"1"}>Средний</option>
                            <option value={"2"}>Сложный</option>
                        </Form.Control>
                    </Form>
                </Row>
                </ThemeProvider>
            </Container>
        </>
    )
}