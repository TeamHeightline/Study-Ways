import React, {useState} from 'react';
import {Card, TextField} from "@material-ui/core";
import {Form} from "react-bootstrap";
import {useQuery} from "@apollo/client";
import {GET_ALL_QUESTIONS, GET_QUESTION_DATA} from "../../UserTest/MainUserQuestionPage/Structs";
import * as _ from "lodash"
import {Autocomplete} from "@material-ui/lab";

export default function AnswerCard({...props}: any) {
    //Логика для выбора тем, скопирована с [LC]MainUserQuestion
    const [authorsForSearching, setAuthorsForSearching] = useState<any>([{}])
    const [themesForSearching, setThemesForSearching] = useState<any>([{}])
    const [selectedAuthor, setSelectedAuthor] = useState<any>()
    const [selectedTheme, setSelectedTheme] = useState<any>()
    const [questionsForSelect, setQuestionsForSelect] = useState<any>([{}])
    const [selectedQuestionId, changeSelectedQuestionId] = useState(-1)


    const {data: get_question_data, refetch: refetch_get_question} = useQuery(GET_QUESTION_DATA, {
            variables: {
                id: selectedQuestionId
            },
        }
    );

    const autocompliteSelectHandleChange = async (e: any, values: any) => {

        if (values) {
            await changeSelectedQuestionId(values.id)
            refetch_get_question()
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
    const {data, error, loading, refetch} = useQuery(GET_ALL_QUESTIONS, {
        onCompleted: data => {
            const authors: any = []
            data.question.map((sameQuestion) => {
                sameQuestion.author.map(async (sameAuthor) => {
                    if (!_.some(authors, sameAuthor)) {
                        authors.push(sameAuthor)
                    }
                })
            })
            setAuthorsForSearching(authors)
            setSelectedAuthor(authors[0].id)
            setThemesForSearching(returnThemesOfQuestionsWhereAuthorSameThatSelected(data, authors[0].id))
            setQuestionsForSelect(data.question)
        }
    });



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
                    <Autocomplete
                        className="mt-3"
                        id="combo-box-demo"
                        fullWidth
                        options={questionsForSelect}
                        getOptionLabel={(option: any) => option.text}
                        renderInput={(params) => <TextField {...params} label="Вопрос" variant="outlined"/>}
                        onChange={(e: any, values: any) => {
                            autocompliteSelectHandleChange(e, values)
                        }}
                    />
                </div>
            </Card>
        </div>
    )
}