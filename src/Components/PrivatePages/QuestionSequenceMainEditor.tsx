import React, {useState} from 'react'
import {useMutation, useQuery} from "@apollo/client";
import { Mutation, Query} from "../../../SchemaTypes";
import {CREATE_QUESTION_SEQUENCE, GET_MY_QUESTION_SEQUENCE, question_sequence_struct} from "../Elements/QuestionSequence/Editor/Struct"
import {Button, Typography, Card, CardActionArea} from "@material-ui/core";
import {Row, Spinner} from "react-bootstrap";
import QuestionSequenceEditByID from "../Elements/QuestionSequence/Editor/EditByID/QuestionSequenceEditByID";
import {GET_ALL_CARD_SUB_THEMES} from "../../Store/InDevComponentsStorage/ComunityDirectionsStore/Struct";
import {sort} from "fast-sort";

export default function QuestionSequenceMainEditor(){
    const {data: question_sequence_data, refetch: refetch_question_sequence_data} = useQuery<any, null>(GET_MY_QUESTION_SEQUENCE)
    const {data: card_themes_data} = useQuery<Query, null>(GET_ALL_CARD_SUB_THEMES)
    const [isEditNow, setIsEditNow] = useState(false)
    const [activeEditSequenceID, setActiveEditSequenceID] = useState<number>(0)
    const [createQuestionSequence] = useMutation<Mutation,{sequenceData : any}>(CREATE_QUESTION_SEQUENCE, {
        variables:{
            sequenceData: question_sequence_struct
        },
        onCompleted: () => {refetch_question_sequence_data()}
    })
    if(!question_sequence_data){
        return (
            <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>
        )
    }
    if(isEditNow){
        return (
            <QuestionSequenceEditByID
                sequence = {question_sequence_data?.me?.questionsequenceSet
                    ?.find((sequence) => sequence.id === activeEditSequenceID)}
                onChange={(data) =>{
                if(data === "goBack"){
                    refetch_question_sequence_data()
                    setIsEditNow(false)
                }
            }}/>
        )
    }
    return(
        <div className="mr-5 ml-5">
            <Button variant="outlined" color="primary" className="col-12 mt-3 justify-content-center"
                    size="large"  onClick={() => {
                        createQuestionSequence()
                        setTimeout(refetch_question_sequence_data, 2000)
            }}
                >
                Создать новую серию вопросов
            </Button>
            <Row className="justify-content-around">
                {sort(question_sequence_data?.me?.questionsequenceSet).desc((sequence: any) => sequence.id)
                    ?.map((sequence: any, ) => {
                    return(
                        <Card variant="outlined" key={sequence?.id + "SequenceKey"} className="mt-3 col-md-5 col-12" style={{padding: 0}}
                        onClick={ async() => {
                            await setActiveEditSequenceID(sequence.id)
                            await setTimeout( setIsEditNow, 500, true)
                        }
                        }>
                            <CardActionArea className="col-12" style={{flex: "auto"}}>
                                <div className="ml-4">
                                    <Typography variant="h6" color="textSecondary" className="ml-2 mt-2">
                                        <strong>
                                            {"ID: " + sequence?.id}
                                        </strong>
                                    </Typography>
                                    <Typography className="ml-2">
                                        {"Название: " + sequence?.name}
                                    </Typography>

                                    <Typography className="ml-2">
                                        {"Описание: " + sequence?.description}
                                    </Typography>

                                    <Row className="mr-3 ml-2" style={{overflowY: "auto"}}>
                                        {sequence?.sequenceData?.sequence?.map( (question, qIndex) =>{
                                            return(
                                                <Card
                                                    style={{borderColor: "#2296F3"}}
                                                    variant="outlined" className="col-2 mr-2 ml-2 mt-2" key={sequence?.id + "SequenceKey"+ qIndex + "QuestionKey"}>
                                                    {question}
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
