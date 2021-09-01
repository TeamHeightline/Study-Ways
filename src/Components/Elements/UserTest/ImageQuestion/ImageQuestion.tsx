// https://image-store-iot-experemental.s3.amazonaws.com/question-images/2021/04/11/img020.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA5QESEDVQVQN6BL4P%2F20210411%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20210411T134742Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=25b7888a08c977a1b910e1feced0f9996ee5863d7b20686a4106c02580e4a777

import React, {useEffect, useState} from 'react';
import {Container, Spinner} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import {useMutation, useQuery} from "@apollo/client";
import * as _ from "lodash"
import ImageAnswerNode from "../ImageAnswerNode";
import axios from "axios";
import {Alert} from "@material-ui/lab";
import AlertTitle from "@material-ui/lab/AlertTitle";
import useWindowDimensions from "../../../../CustomHooks/useWindowDimensions";
import DCMCImageQuestion from "./DCMCImageQuestion";
import HelpText from "./HelpText";
import DCPCImageQuestion from "./DCPCImageQuestion";
import DCAnswers from "./DCAnswers";
import {GET_QUESTION_DATA, STATISTIC} from "./Struct";

export default function ImageQuestion(props: any) {
    const questionId = props?.match?.params?.id? props.match.params.id: props.id
    const [helpLevel, changeHelpLevel] = useState(props?.helpLevel? props.helpLevel: "0");
    const [answers, setAnswers] = useState<any>([{}])
    const [questionImgUrl, setQuestionImgUrl] = useState<any>('')
    const [urlHasBeenPassed, setUrlHasBeenPassed] = useState(false)
    const [selected, changeSelected] = useState<number[]>([])
    const [activeWrongAnswerIndex, changeActiveWrongAnswerIndex] = useState(-10)
    const [errorArray, changeErrorArray] = useState<any[]>([])
    const [tryingCalculation, changeTryingCalculation] = useState(0)
    const [oneTimePusshCheckErrorButton, changeOneTimePusshCheckErrorButton] = useState(false)
    const [showCongratulation, setShowCongratulation] = useState(false)
    const {width, height} = useWindowDimensions()
    const [isUseScrollbar, setIsUseScrollbar] = useState(false)

    const {data: get_question_data} = useQuery(GET_QUESTION_DATA, {
        variables: {
            id: questionId
        },
        onCompleted: async(data) =>{
            await setAnswers([])
            //алгоритм выборки ответов, его задача отобразить все правильные ответы, а на оставшиеся места
            //показать неправильные
            let ans = data?.questionById?.answers;
            ans = _.shuffle(ans);
            //slice нужен, чтобы ограничить массив правильных ответов количеством разрешенных к отображению ответов,
            //а массив неверных количеством разрешенных минус количество правильных
            const trueAns = _.shuffle(_.filter(ans, {isTrue: true})).slice(0, data?.questionById?.numberOfShowingAnswers);
            const wrongAns = _.filter(ans, {isTrue: false}).slice(0, data?.questionById?.numberOfShowingAnswers - trueAns.length);
            const trueAndWrongAnswer = [...trueAns, ...wrongAns]
            await setAnswers(_.shuffle(trueAndWrongAnswer))
        }}
    );

    useEffect( () => {
        const fetchData = async () => {
            await setUrlHasBeenPassed(false)
            await setQuestionImgUrl("")
            const data = await axios("https://iot-experemental.herokuapp.com/files/question?id=" + questionId)
            try {
                await setUrlHasBeenPassed(true)
                await setQuestionImgUrl(data.data[0].image)
            }catch (e) {
                console.log(e)
            }
        }
        fetchData()

    }, [props.id]);
    const [update_statistic] = useMutation(STATISTIC, {
        variables: {
            id: get_question_data?.questionById?.questionstatistic?.id,
            questionID: questionId,
            numberOfPasses: get_question_data?.questionById?.questionstatistic?.numberOfPasses ? get_question_data?.questionById?.questionstatistic?.numberOfPasses + 1: 1,
            sumOfAllAttempts:get_question_data?.questionById?.questionstatistic?.sumOfAllAttempts ? get_question_data?.questionById?.questionstatistic?.sumOfAllAttempts + tryingCalculation: tryingCalculation
        },
        onCompleted: data => console.log(data),
        onError: error => console.log(error)
    })


    async function checkErrors() {
        if (selected.length !== 0){
            if(!oneTimePusshCheckErrorButton){
                changeOneTimePusshCheckErrorButton(true)
            }
            changeTryingCalculation(tryingCalculation + 1)
            await changeErrorArray([])
            const oErrArr: any[] = []
            let minCheckQueue = 10000000000000000000000
            let ActiveWrongAnswerIndexLet = activeWrongAnswerIndex
            answers.map((answer: any, Index: number) => {
                if ((answer.isTrue && (selected.indexOf(answer.id) === -1)) || (!answer.isTrue && (selected.indexOf(answer.id) !== -1))) {
                    // console.log(question)
                    if (answer.checkQueue < minCheckQueue) {
                        // changeActiveWrongQuestionId(question.id)
                        minCheckQueue = answer.checkQueue
                        ActiveWrongAnswerIndexLet = Index
                    }
                    oErrArr.push(answer.id)
                }

            })
            if (oErrArr.length === 0){
                setShowCongratulation(true)
                update_statistic()
            }
            changeActiveWrongAnswerIndex(ActiveWrongAnswerIndexLet)
            changeErrorArray(oErrArr)
        }
    }
    const onChangeHelpLevel = (event: any) => changeHelpLevel(event.target.value);

    function selectDeselectAnswer(id: any) {
        if (selected.indexOf(id) === -1) {
            const oldSelected = selected
            oldSelected.push(id)
            changeSelected(oldSelected)
        } else {
            const oldSelected = selected
            oldSelected.splice(selected.indexOf(id), 1)
            changeSelected(oldSelected)
        }

    }


    const checkurl = (url: any) => url ? url.replace("http://", "").replace("https://", "").replace("www.", "")
        .replace("youtu.be/", "youtube.com?v=").replace("youtube.com/watch?v=", "youtube.com?v=").slice(0, 14) === "youtube.com?v=" : false;

    // console.log(get_question_data?.questionById?.questionstatistic?.numberOfPasses)
    // console.log(get_question_data?.questionById?.questionstatistic?.sumOfAllAttempts)
    return (
        <div className="col-12">
        {!showCongratulation ?
        <div>
            {/*<Row className="col-12">*/}
                {/*Раздел подсказок текстовых/видео*/}
                <div className="col-12">
                    {/*Отдельный компонент только для телефонов, он располагается до раздела с подсказками*/}
                    <DCMCImageQuestion height={height} width={width} questionImgUrl={questionImgUrl}
                                       questionData={get_question_data} onChange={props.onChange} onClick={() => {
                        props.onChange("goBack")
                    }} disabled={props.open_from_sequence} value={helpLevel} onChange1={onChangeHelpLevel}
                                       onClick1={() => checkErrors()}/>
                </div>
                <Row className="justify-content-center">
                    <div className="col-9">
                        <DCPCImageQuestion
                            showNotUseScrollbarCheckbox={true}
                            isNotUseScrollbar={isUseScrollbar } setIsNotUseScrollbar={setIsUseScrollbar}
                            height={height} width={width} urlHasBeenPassed={urlHasBeenPassed}
                                           questionImgUrl={questionImgUrl} questionData={get_question_data} id={props.id}
                                           onChange={props.onChange} onClick={() => {
                            props.onChange("goBack")
                        }} disabled={props.open_from_sequence} value={helpLevel} onChange1={onChangeHelpLevel}
                                           onClick1={() => checkErrors()}
                        />
                    </div>
                    <div className="col-12">
                        <HelpText errorArray={errorArray} helpLevel={helpLevel} answers={answers}
                                  activeWrongAnswerIndex={activeWrongAnswerIndex}
                                  b={checkurl(answers[activeWrongAnswerIndex]?.videoUrl)}/>
                    </div>
                </Row>
            {/*</Row>*/}
            <div className="col-11 mr-5" >
                {get_question_data && answers ?
                    <DCAnswers isUseScrollbar={isUseScrollbar} height={height} width={width} answers={answers} element={(answer, answerIndex) => {
                        return (
                            <div key={answerIndex + "divKey"}>
                                <ImageAnswerNode
                                    answerIndex={answerIndex}
                                    answer={answer}
                                    selected={selected}
                                    onChange={(e) => {
                                        selectDeselectAnswer(e)
                                    }}/>
                                <br/>
                            </div>
                        )
                    }}/> : <Spinner animation="border" variant="success" className=" offset-6 mt-5"/>}
            </div>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
        </div> :
            <Container className="mt-5">
                {!props.open_from_sequence ?
                <Alert severity="success">
                    <AlertTitle>Поздравляем</AlertTitle>
                    Вы успешно прошли тест, количество попыток - <strong>{tryingCalculation}</strong>
                </Alert> : <Alert severity="success">
                        <AlertTitle>Вы успешно прошли вопрос</AlertTitle>
                        Переходите к следующему
                    </Alert>}
            </Container>}
        </div>
    )
}