import React, {useEffect, useState} from "react";
import {useQuery} from "@apollo/client";
import * as _ from "lodash"
import useWindowDimensions from "../../../CustomHooks/useWindowDimensions";
import {GET_ALL_QUESTIONS, GET_QUESTION_DATA} from "./Structs"
import PCDCMainUserQuestion from "./[PCDC]MainUserQuestion";

export default function LCMainUserQuestion(props: any) {
    const [authorsForSearching, setAuthorsForSearching] = useState<any>([{}])
    const [themesForSearching, setThemesForSearching] = useState<any>([{}])
    const [selectedAuthor, setSelectedAuthor] = useState<any>()
    const [selectedTheme, setSelectedTheme] = useState<any>()
    const [questionsForSelect, setQuestionsForSelect] = useState<any>([{}])

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
    const [helpLevel, changeHelpLevel] = useState("0");
    const [testHadBeenStarted, changeTestHadBeenStarted] = useState(false)
    const [selectedQuestionId, changeSelectedQuestionId] = useState(-1)
    const {
        data: get_question_data, loading: get_question_loading, error: get_question_error,
        refetch: refetch_get_question
    } = useQuery(GET_QUESTION_DATA, {
            variables: {
                id: selectedQuestionId
            },
        }
    );
    const [showAuthorAndThemesSelectorPanel, setShowAuthorAndThemesSelectorPanel] = useState(false)
    const onChangeHelpLevel = (event: any) => changeHelpLevel(event.target.value);
    const autocompliteSelectHandleChange = async (e: any, values: any) => {

        if (values) {
            await changeSelectedQuestionId(values.id)
            refetch_get_question()
        }
    }

    return(<PCDCMainUserQuestion {...{data, testHadBeenStarted, showAuthorAndThemesSelectorPanel,
        setShowAuthorAndThemesSelectorPanel, setQuestionForSelectAfterSelectedTheme,
        setQuestionsForSelect, selectedAuthor, setSelectedAuthor, setThemesForSearching,
        returnThemesOfQuestionsWhereAuthorSameThatSelected, authorsForSearching, selectedTheme,
        setSelectedTheme, themesForSearching, questionsForSelect, autocompliteSelectHandleChange,
        helpLevel, onChangeHelpLevel, changeTestHadBeenStarted, get_question_data, selectedQuestionId,

    }}/>)

}