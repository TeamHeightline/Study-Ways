import React, {useState} from "react";
import { gql, useQuery } from '@apollo/client';
import {Accordion, Button, Card, Container, Spinner} from "react-bootstrap";
import ReactPlayer from "react-player";
import {DataGrid} from "@material-ui/data-grid";
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";
import {blue} from "@material-ui/core/colors";


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

interface QuesertionVars{
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
    const { loading, error, data } = useQuery<QuestionById, QuesertionVars>(GET_QUESTION_DATA, { variables: { id: 7 } }
    );
    console.log(data)
    if (loading)
        return <div className="display-1 text-center">Loading...;
            <Spinner animation="grow" variant="primary" />
        </div>
    if (error) console.log(`Error! ${error.message}`)

    //Заполнение строк
    const rows: Array<{id: number, text: string}> = []
    data?.questionById.answers.forEach((answer) =>{
         rows.push({id: answer.id, text: answer.text})
    })

    //Установка колонок
    const columns = [{ field: 'text', headerName: 'Ответы на вопрос', width: 2500 }];

    //Установка темы
    const theme = createMuiTheme({
        palette: {
            primary: blue,
            secondary: blue,
        },
    });

    return(
        <>
            <Container>
                <div className="display-4" style={{fontSize: '35px'}}>{data?.questionById.text}</div>
                <Accordion  className="mt-4">
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                Отобразить видео вопрос
                                {console.log(data?.questionById.videoUrl)}
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="1">
                            <ReactPlayer url={data?.questionById.videoUrl} controls autoPlay={true}/>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
                <ThemeProvider theme={theme}>
                <DataGrid rows={rows} columns={columns}  checkboxSelection autoHeight={true}
                          disableColumnMenu={true} hideFooter={true} disableExtendRowFullWidth={false}
                          showCellRightBorder={true} showToolbar={false} pageSize={10}
                          // onRowSelected={(RowSelectedParams) =>{selectDeselectRow(RowSelectedParams)}}
                          disableColumnSelector={true} rowHeight={60}
                />
                </ThemeProvider>
            </Container>
        </>
    )
}