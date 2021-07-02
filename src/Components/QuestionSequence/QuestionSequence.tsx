import React, {useState} from 'react'
import {useMutation, useQuery} from "@apollo/client";
import {Mutation, Query} from "../../../SchemaTypes";
import {CREATE_QUESTION_SEQUENCE, GET_MY_QUESTION_SEQUENCE, question_sequence_struct} from "./Struct"
import {Button, Paper, Typography, Card, CardActionArea} from "@material-ui/core";
import {Row, Spinner} from "react-bootstrap";
import QuestionSequenceEditor from "./Editor/QuestionSequenceEditor";

export default function QuestionSequence(){
    const {data: question_sequence_data, refetch: refetch_question_sequence_data} = useQuery<Query, null>(GET_MY_QUESTION_SEQUENCE)
    const [isEditNow, setIsEditNow] = useState(false)
    const [activeEditSeSequenceID, setActiveEditSequenceID] = useState<string | undefined>()
    const [activeEditSequenceIndex, setActiveEditSequenceIndex] = useState<number>(0)
    const [createQuestionSequence, {loading: create_question_loading}] = useMutation<Mutation,{sequenceData : any}>(CREATE_QUESTION_SEQUENCE, {
        variables:{
            sequenceData: question_sequence_struct
        },
        onCompleted: data => {refetch_question_sequence_data()}
    })

    if(!question_sequence_data){
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    if(isEditNow){
        return (
            <QuestionSequenceEditor
                sequence = {question_sequence_data?.me?.questionsequenceSet[activeEditSequenceIndex]}
                onChange={(data) =>{
                if(data === "goBack"){
                    setIsEditNow(false)
                }
            }}/>
        )
    }
    return(
        <div className="mr-5 ml-5">
            <Button variant="outlined" color="primary" className="col-12 mt-3 justify-content-center"
                    size="large"  onClick={() => createQuestionSequence()}>
                Создать новую серию вопросов
            </Button>
            <Row className="justify-content-around">
                {question_sequence_data?.me?.questionsequenceSet?.map((sequence, sIndex) => {
                    // console.log(sequence)
                    return(
                        <Card key={sequence?.id + "SequenceKey"} className="mt-3 col-5" style={{padding: 0}}
                        onClick={ async() => {
                            await setActiveEditSequenceID(sequence?.id)
                            await setActiveEditSequenceIndex(sIndex)
                            await setTimeout( setIsEditNow, 500, true)
                        }
                        }>
                            <CardActionArea className="col-12" style={{flex: "auto"}}>
                                <div className="ml-4">
                                    <Typography variant="h6" color="textSecondary" className="ml-2">
                                        <strong>
                                            {"ID: " + sequence?.id}
                                        </strong>
                                    </Typography>
                                    <Typography className="ml-2">
                                        {"Название: " + sequence?.name}
                                    </Typography>
                                    <Typography className="ml-2">
                                        Вопросы пермешиваются: {sequence?.sequenceData?.settings?.use_random_position_for_questions ? "Да": "Нет"}
                                    </Typography>
                                    <Typography className="ml-2">
                                        Резрешено переключение между вопросами:  {sequence?.sequenceData?.settings?.can_switch_pages ?  "Да": "Нет"}
                                    </Typography>
                                    <Typography className="ml-2">
                                        Показывать подсказки или нет:  {sequence?.sequenceData?.settings?.show_help_text ?  "Да": "Нет"}
                                    </Typography>
                                    <Typography className="ml-2">
                                        Макс. количество попыток для каждого вопроса:   {sequence?.sequenceData?.settings?.max_sum_of_attempts}
                                    </Typography>
                                    <Typography>
                                    </Typography>
                                    <Row className="mr-3 ml-3" style={{overflowY: "auto"}}>
                                        {sequence?.sequenceData?.sequence?.map( question =>{
                                            return(
                                                <Card className="col-2 mr-2 ml-2 mt-2" key={sequence?.id + "SequenceKey"+ question?.id + "QuestionKey"}>
                                                    {question?.id ? question.id : "Null"}
                                                    <br/>
                                                </Card>
                                            )
                                        })}
                                        <br/>
                                    </Row>
                                    <br/>
                                </div>
                            </CardActionArea>
                        </Card>
                    )
                })}

            </Row>
        </div>
    )
}
