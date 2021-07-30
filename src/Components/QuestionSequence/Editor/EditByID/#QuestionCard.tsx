import React, {useEffect, useState} from 'react';
import {Card, TextField} from "@material-ui/core";
import {Form} from "react-bootstrap";
import {useQuery} from "@apollo/client";
import {GET_ALL_QUESTIONS} from "../../../../Store/PublicStorage/QuestionPage/Struct";
import * as _ from "lodash"
import {Autocomplete} from "@material-ui/lab";

export default function QuestionCard({...props}: any) {
    //Логика для выбора тем, скопирована с [LC]MainUserQuestion
    const [authorsForSearching, setAuthorsForSearching] = useState<any>([{}]) //Массив всех авторов из которых можно выбирать
    const [themesForSearching, setThemesForSearching] = useState<any>([{}]) //Массив всех тем, остались только те, для которых есть вопрос при выбранной теме
    const [selectedAuthor, setSelectedAuthor] = useState<any>() //ID того автора, которого выбрали
    const [selectedTheme, setSelectedTheme] = useState<any>() //ID выбранной темы
    const [questionsForSelect, setQuestionsForSelect] = useState<any>([{}]) //Массив вопросов, которые остались после выбора автора и темы
    const [selectedQuestion, changeSelectedQuestion] = useState<any>() //ID выбранного вопроса
    // const [value, setValue] = React.useState<string | null>(options[0]);
    const [selectedQuestionHasBeenCalculated, setSelectedQuestionHasBeenCalculated] = useState(false)
    //Переменная, обязательная для того, чтобы понимать, что мы совершили все расчеты, необходимые перед отисовкой
    // автокомплита





    const autocompliteSelectHandleChange = async (e: any, values: any) => {

        if (values) {
            await changeSelectedQuestion(values)
        }
    }


    function returnThemesOfQuestionsWhereAuthorSameThatSelected(data: any, idOfAuthor: any) {
        const themes: any = []
        const questionsAfterSelectedAuthor: any = []
        data.question.map((sameQuestion) => {
            sameQuestion.author.map((sameAuthor) => {
                if (sameAuthor.id === idOfAuthor) {
                    if (!_.some(questionsAfterSelectedAuthor, sameQuestion)) {
                        questionsAfterSelectedAuthor.push(sameQuestion)
                    }
                }
            })
        })
        questionsAfterSelectedAuthor.map((sameQuestion) => {
            sameQuestion.theme.map((sameTheme) => {
                if (!_.some(themes, sameTheme)) {
                    themes.push(sameTheme)
                }
            })
        })
        setSelectedTheme(themes[0].id)
        return (themes)
    }
    function setQuestionForSelectAfterSelectedTheme(justSelectedTheme: any = selectedTheme, justSelectedAuthor: any = selectedAuthor) {
        const questionsAfterSelectedAuthor: any = []
        data.question.map((sameQuestion) => {
            sameQuestion.author.map((sameAuthor) => {
                if (sameAuthor.id === justSelectedAuthor) {
                    if (!_.some(questionsAfterSelectedAuthor, sameQuestion)) {
                        questionsAfterSelectedAuthor.push(sameQuestion)
                    }
                }
            })
        })
        const questionsAfterSelectedTheme: any = []
        questionsAfterSelectedAuthor.map((sameQuestion) => {
            sameQuestion.theme.map((sameTheme) => {
                if (sameTheme.id === justSelectedTheme) {
                    if (!_.some(questionsAfterSelectedTheme, sameQuestion)) {
                        questionsAfterSelectedTheme.push(sameQuestion)
                    }
                }
            })
        })
        setQuestionsForSelect(questionsAfterSelectedTheme)
    }
    const {data} = useQuery(GET_ALL_QUESTIONS, {
        onCompleted: async (data) => {
            const authors: any = []
            data.question.map((sameQuestion) => {
                sameQuestion.author.map(async (sameAuthor) => {
                    if (!_.some(authors, sameAuthor)) {
                        authors.push(sameAuthor)
                    }
                })
            })
            await setAuthorsForSearching(authors)
            await setSelectedAuthor(authors[0].id)
            await setThemesForSearching(returnThemesOfQuestionsWhereAuthorSameThatSelected(data, authors[0].id))
            await setQuestionsForSelect(data.question)
            await changeSelectedQuestion(data?.question?.find((someQuestion) => {return(someQuestion?.id == props.questionID)}))
            //Устанавливаем выбранный вопрос, даля этого мы бирем вообще все полученные вопросы и ищем такой, чтобы его
            // ID совпадало с тем, что у нас пришло с сервера и передано пропсом questionID
            await setSelectedQuestionHasBeenCalculated(true) //После всех расчетов мы говорим, что теперь все
            // готово к тому, чтобы визуализировать автокомплит
        }
    });
    useEffect(() =>{
        if(selectedQuestion && selectedQuestion?.id){
            props.onChange(selectedQuestion.id)
        }
    }, [selectedQuestion])


    return(
        <div {...props}>
            <Card>
                <div className="ml-3 mr-3 mt-3">
                    <Form.Control
                        className="mt-1"
                        // size="lg"
                        as="select"
                        value={selectedAuthor}
                        onChange={async (event) => {
                            await setSelectedAuthor(event.target.value)
                            await setThemesForSearching(returnThemesOfQuestionsWhereAuthorSameThatSelected(data, event.target.value))
                            setQuestionForSelectAfterSelectedTheme(returnThemesOfQuestionsWhereAuthorSameThatSelected(data, event.target.value)[0].id,
                                event.target.value)
                        }}>
                        {authorsForSearching.map((author: any) => {
                            return (<option key={author.id + "authorForSelect"}
                                            value={author.id}>Автор: {author.name}</option>)
                        })}
                    </Form.Control>
                </div>
                {selectedAuthor && selectedAuthor?.id !== -10 &&
                    <div className="ml-3 mr-3">
                        <Form.Control
                            className="mt-1"
                            // size="lg"
                            as="select"
                            value={selectedTheme}
                            onChange={async (event) => {
                                setSelectedTheme(event.target.value)
                                setQuestionForSelectAfterSelectedTheme(event.target.value)
                            }}>
                            {themesForSearching.map((theme: any) => {
                                return (<option key={theme.id + "themeForSelect"}
                                                value={theme.id}>Тема: {theme.name}</option>)
                            })}
                        </Form.Control>
                    </div>}
                <div className="mr-3 ml-3 pb-3">
                    { selectedQuestionHasBeenCalculated && //Обязательно только так, потому что пользователь может еще
                    // только создать эту серию и selectedQuestion будет пустым, а если не проверять на него,
                    // то автокомплит будет всегда пустой, даже, если уже выбраны какие-то вопросы
                    <Autocomplete
                        value={selectedQuestion}
                        inputValue={selectedQuestion?.name}
                        className="mt-3"
                        fullWidth
                        autoHighlight
                        options={questionsForSelect}
                        getOptionLabel={(option: any) => option.text}
                        renderInput={(params) => <TextField {...params} label="Вопрос" variant="outlined"/>}
                        onChange={(e: any, values: any) => {
                            autocompliteSelectHandleChange(e, values)
                        }}
                    />}
                </div>
            </Card>
        </div>
    )
}