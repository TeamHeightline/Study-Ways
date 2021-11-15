import React, {useState} from 'react'
import {UPDATE_QUESTION_SEQUENCE, useStyles} from "./Struct";
import {useMutation} from "@apollo/client";
import { Row, Spinner} from "react-bootstrap";
import {
    Button, Card, CardActionArea,
    Snackbar,
    TextField, Typography
} from "@mui/material";
import QuestionCard from "./#QuestionCard";

import {Mutation} from "../../../../../SchemaTypes";
import { Alert } from '@mui/material';
import CardMedia from "@mui/material/CardMedia";

export default function QuestionSequenceEditByID({...props}: any) {
    const [questionsIDArray, setQuestionsIDArray] = useState<any[] >(props?.sequence?.sequenceData?.sequence ? props?.sequence?.sequenceData?.sequence : [])//Нужно для хранения массива айдишников вопросов
    const [sequenceName, setSequenceName] = useState<string>(props?.sequence?.name)//Название последовательности вопросов
    const [sequenceDescription, setSequenceDescription] = useState<string>(props?.sequence?.description)
    const [manualReload, setManualReload] = useState(true)


    const [stateOfSave, setStateOfSave] = useState(2) // 0- не сохранено 1- сохранение 2- сохранено
    const [autoSaveTimer, changeAutoSaveTimer] = useState<any>()

    const getSequenceQuestionArrayWithoutNull = () => {
        return(questionsIDArray.filter((question) => question !== null && typeof question !== 'object'))
    }

    const [updateQuestionSequence] = useMutation<Mutation, {sequenceData: any, sequenceId: number, name: string, description: string}>
    (UPDATE_QUESTION_SEQUENCE, {
            variables:{
                sequenceId: props?.sequence?.id,
                name: sequenceName ? sequenceName : "Название по умолчанию",
                description: sequenceDescription ? sequenceDescription : "Описание по умолчанию",
                sequenceData: {
                    sequence: getSequenceQuestionArrayWithoutNull() //массив ID вопросов
                }

            },
        onError: () =>{
                void(0)
        },
        onCompleted: () =>{
                setStateOfSave(2)}
        })



    const autoSave = () =>{
        clearTimeout(autoSaveTimer)
        setStateOfSave(0)
        changeAutoSaveTimer(setTimeout(() => {
            setStateOfSave(1)
            console.log("-----autosave-------")
            updateQuestionSequence()
        }, 4000))
    }

    const classes = useStyles();
    const addQuestion = () =>{
        autoSave()
        setQuestionsIDArray(questionsIDArray.concat({SyntheticBaseEvent: true}))
    }

    if(!props.sequence){
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    return(
        <div className="col-12" style={{paddingLeft: 48}}>
            <Typography variant="h4" className="text-center">Редактировать серию вопросов</Typography>
            <div className="ml-4">
                <Button
                    className="ml-md-5 col-12 col-md-2"
                    variant="outlined" color="primary" onClick={() => {
                    props.onChange("goBack")}}>
                    Назад
                </Button>
            </div>
            <br/>
            <Row className="justify-content-around">
                <TextField value={sequenceName}
                           onChange={(e) =>{
                                autoSave()
                                setSequenceName(e.target.value)
                           }}
                           size="small"
                           label="Название серии вопросов"
                           variant="outlined" className="ml-md-5 col-md-5 col-12"
                />
                <TextField value={sequenceDescription}
                           onChange={(e) =>{
                               autoSave()
                               setSequenceDescription(e.target.value)
                           }}
                           size="small"
                           label="Описание серии вопросов"
                           variant="outlined" className="ml-md-5 col-md-5 col-12"
                />
            </Row>
            <Row className="justify-content-around">
                <Row className="justify-content-center">
                    <Typography className="mt-2"><pre style={{color: "white"}}>{"Режим обучения - "}</pre></Typography>
                    <Typography className="mt-2">{" "} https://www.sw-university.com/qs/{props?.sequence?.id}</Typography>
                </Row>
                <Row className="justify-content-center">
                    <Typography className="mt-2"><pre style={{color: "white"}}>{"Режим экзамена - "}</pre></Typography>
                    <Typography className="mt-2">{"https://www.sw-university.com/qs/"+ props?.sequence?.id + "?exam=true"}</Typography>
                </Row>
            </Row>

            <Row className="justify-content-around" >
                <div className="col-md-3 col-12 ml-md-5 mt-3">
                    <Card variant="outlined" className={classes.root} style={{padding: 0}} >
                        <CardMedia
                            className={classes.cover}
                            image="https://www.shareicon.net/data/256x256/2017/03/06/880378_blue_512x512.png"
                            title="add question"
                        />
                        <CardActionArea onClick={() =>{addQuestion()}}>
                            <div className="display-4 text-center" style={{fontSize: '33px'}}>Добавить вопрос</div>
                        </CardActionArea>
                    </Card>
                </div>
            {questionsIDArray && questionsIDArray?.map((question, qIndex) =>{
                return(
                    <QuestionCard className="col-md-3 col-12 ml-md-5 mt-3" key={question + "Key" + qIndex}
                                  questionID={question}
                                  onDeleteClick={() =>{
                                      const __questionIDArray = questionsIDArray
                                      __questionIDArray.splice(qIndex, 1)
                                      setQuestionsIDArray(__questionIDArray)
                                      setManualReload(!manualReload)
                                  }}
                                  onChange={(data) =>{
                                        autoSave()
                                        const newQuestionsIDArray =[...questionsIDArray]
                                        newQuestionsIDArray[qIndex] = data
                                        setQuestionsIDArray(newQuestionsIDArray)
                                    }}/>
                )
            })}
            </Row>
            <Snackbar open={true}>
                <Alert severity="info">
                    {stateOfSave === 0 &&
                    "Изменения не сохранены"}
                    {stateOfSave === 1 &&
                    "Автосохранение"}
                    {stateOfSave === 2 &&
                    "Сохранено"}
                </Alert>
            </Snackbar>
        </div>
    )
}