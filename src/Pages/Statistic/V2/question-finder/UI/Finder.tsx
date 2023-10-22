import {observer} from "mobx-react";
import React, {useEffect} from 'react';
import {StatisticBasedOnQuestions} from "../../show-statistic-for-selected-questions/StatisticbasedOnQuestions";
import {TQAObject} from "../Store/ToQuestionsArray";
import {useParams} from "react-router-dom";

interface RouteProps {
    id?: string
}

interface ModeProps {
    mode: "qs" | "all"
}

interface ComponentProp extends ModeProps {

}

export const Finder = observer(({mode, ...props}: ComponentProp) => {
    const {id} = useParams();

    useEffect(() => {
        if (mode === "qs") {
            TQAObject.getQuestionsByQSID(Number(id))
        }
        if (mode === "all") {
            TQAObject.getAllQuestions()
        }
    }, [id])

    return (
        <div {...props}>
            <StatisticBasedOnQuestions selectedQuestions={TQAObject.selectedQuestions}/>
        </div>
    )
})