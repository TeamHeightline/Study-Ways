import React, {useEffect, useMemo, useState} from "react";
import { useMutation, useQuery} from "@apollo/client";
import {Spinner} from "react-bootstrap";
import {Autocomplete} from "@material-ui/lab";
import { TextField} from "@material-ui/core";
import { sort } from 'fast-sort';


import {CONTEXT_DATA, CREATE_NEW_ANSWER, CREATE_NEW_QUESTION, UPDATE_QUESTION} from "./Struct"
import DCUpdateQuestion from "./[DC]UpdateQuestion";
import {Mutation} from "../../../../../SchemaTypes";

const AutocompliteForNotUpdate = (data: any, autocompliteSelectHandleChange: (e: any, values: any) => any) => {
    if (data){
        console.log(data.me.questionSet)
        return(
            <Autocomplete
                id="combo-box-demo"
                fullWidth
                options={sort(data.me.questionSet).desc((question: any) => question?.id)}
                getOptionLabel={(option: any) => option.text}
                renderInput={(params) => <TextField {...params} label="Вопрос" variant="outlined"/>}
                onChange={(e: any, values: any) => {
                    autocompliteSelectHandleChange(e, values)
                }}
            />

        )
    }else{
        return(<Spinner animation="border" variant="success" className=" offset-6 mt-5"/>)
    }
    }

export default function LCUpdateQuestion() {
    const {data, error, loading, refetch} = useQuery(CONTEXT_DATA,{
        onCompleted: (data) => {
            if(questionId){
                updateQuestionFromMutationData()
            }
        },
    });

    const autocompliteSelectHandleChange =  (e: any, values: any) => {
        refetch()
        data.me.questionSet.map((question: any, index: any) => {
            if (question.id === values.id) {
                changeQuestionIndex(index)
                // console.log(index)
            }
        })

        // console.log(values)
        changeSelectedQuestion(values)
        const authorsIdArray: any = []
        values.author.map((author: any) => {
            authorsIdArray.push(author.id)
        })
        changeAuthorId(authorsIdArray)
        const themesIdArray: any = []
        values.theme.map((theme: any) => {
            themesIdArray.push(theme.id)
        })
        changeThemesId(themesIdArray)
        changeQuestionId(values.id)
        changeQuestionText(values.text)
        changeQuestionUrl(values.videoUrl)
        changeAnswersArray(values.answers)
        setQuestionImageName('')
        setIsImageQuestion(values.isImageQuestion)

        async function getData(){
            const img_data = await fetch("https://iot-experemental.herokuapp.com/files/question?id="+ values.id)
            const img_data_json = await img_data.json()
            if (img_data_json[0]){
                setQuestionImageName(img_data_json[0].image.slice(70).split('?')[0])
            }
        }
        getData();
    }



    const [questionText, changeQuestionText] = useState('');
    const [isImageQuestion, setIsImageQuestion] = useState(false)
    const [questionImage, changeQuestionImage] = useState();
    const [questionUrl, changeQuestionUrl] = useState('');
    const [ThemesId, changeThemesId] = useState([]);
    const [authorId, changeAuthorId]: any = useState([]);
    const [selectedQuestion, changeSelectedQuestion]: any = useState();
    const [questionId, changeQuestionId]: any = useState()
    const [answersArray, changeAnswersArray]: any = useState([])
    const [questionIndex, changeQuestionIndex]: any = useState()
    const [openQuestionUpdateNotification, changeOpenQuestionUpdateNotification] = useState(false)
    const memedAutocomplite = useMemo(() => AutocompliteForNotUpdate(data, autocompliteSelectHandleChange), [data])
    const [selectedQuestionImage, setSelectedQuestionImage] = useState<any>();
    const [isSelectedQuestionImage, setIsSelectedQuestionImage] = useState(false);
    const [questionImageName, setQuestionImageName] = useState('');


    const changeHandlerForQuestionImage = async (event) => {
        if (event.target.files[0]){
            await setSelectedQuestionImage(event.target.files[0]);
            await setIsSelectedQuestionImage(true);
            handleSubmissionQuestionImage(event.target.files[0])
        }
    };

    const handleSubmissionQuestionImage = (img: any) => {
        console.log("---")
        const formData = new FormData();

        formData.append('image', img);
        formData.append('owner_question', questionId);
        fetch(
            'https://iot-experemental.herokuapp.com/files/question?update_id='+ questionId,
            {
                method: 'POST',
                body: formData,
            }
        )
            .then((response) => response.json())
            .then((result) => {
                console.log('Success:', result);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const [create_answer, {data: create_answer_data, loading: create_answer_loading}] = useMutation(CREATE_NEW_ANSWER, {
        variables: {
            question: questionId
        },
        onCompleted: (create_answer_data) => {
            if (create_answer_data.createAnswer.errors.length === 0) {
                 refetch()

            }
        }

    })
    const [update_question, {data: update_question_data, loading: update_question_loading}] = useMutation(UPDATE_QUESTION, {
        variables: {
            createdBy: 0,
            theme: ThemesId,
            author: authorId,
            text: questionText,
            videoUrl: questionUrl,
            id: questionId,
            isImageQuestion: isImageQuestion
        },
        onCompleted: (update_question_data) =>{
            if (update_question_data.updateQuestion.errors.length === 0){
                refetch()
                changeOpenQuestionUpdateNotification(true)
            }
        }
    })
    const [create_new_question, {loading: create_question_loading}] = useMutation<Mutation, null>(CREATE_NEW_QUESTION,{
        onCompleted: data1 =>{
            refetch()
            console.log(data)
        },
        onError: error1 => console.log(error1)
    })

    const updateQuestionNotificationHandleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            changeOpenQuestionUpdateNotification(false)
        }
    }

    const updateQuestionFromMutationData = async () => {
        let values: any = 0
        data.me.questionSet.map((question: any, index: any) =>{
            if (question.id === questionId){
                values = question
                changeQuestionIndex(index)
            }
        })
        // console.log(values)
        const authorsIdArray: any = []
        values.author.map((author: any) => {
            authorsIdArray.push(author.id)
        })
        changeAuthorId(authorsIdArray)
        const themesIdArray: any = []
        values.theme.map((theme: any) => {
            themesIdArray.push(theme.id)
        })
        changeThemesId(themesIdArray)
        // console.log(values)
        changeQuestionText(values.text)
        changeQuestionUrl(values.videoUrl)
        changeAnswersArray(values.answers)

    }

    return(<DCUpdateQuestion {...{data, memedAutocomplite, questionText, changeQuestionText,
        questionUrl, changeQuestionUrl, ThemesId, changeThemesId, selectedQuestion,
        authorId, changeAuthorId, questionId, isImageQuestion, setIsImageQuestion,
        update_question, changeHandlerForQuestionImage, isSelectedQuestionImage,
        selectedQuestionImage, questionImageName, update_question_loading,update_question_data,
        questionIndex, create_answer, create_answer_loading, openQuestionUpdateNotification,
        updateQuestionNotificationHandleClose, create_new_question, create_question_loading}}/>)
}