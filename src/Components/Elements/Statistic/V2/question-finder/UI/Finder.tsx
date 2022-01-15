import {observer} from "mobx-react";
import React, {useEffect} from 'react';
import {StatisticBasedOnQuestions} from "../../show-statistic-for-selected-questions/StatisticbasedOnQuestions";
import {TQAObject} from "../Store/ToQuestionsArray";
import {RouteComponentProps} from "react-router-dom";

interface RouteProps{
    id: string
}

interface ModeProps{
    mode: "qs" | "question" | "all"
}
interface ComponentProp extends ModeProps, RouteComponentProps<RouteProps> {

}
export const Finder = observer(({mode, ...props}: ComponentProp) =>{
    useEffect(() =>{
        if(mode === "qs"){
            TQAObject.getQuestionsByQSID(Number(props.match.params.id))
        }
    }, [props.match.params.id])

    return(
        <div {...props}>
            <StatisticBasedOnQuestions selectedQuestions={TQAObject.selectedQuestions}/>
        </div>
    )
})