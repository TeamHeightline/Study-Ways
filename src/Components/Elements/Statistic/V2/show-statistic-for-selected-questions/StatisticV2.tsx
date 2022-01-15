import {observer} from "mobx-react";
import React from 'react';
import {ShowStatisticTable} from "./ShowStatisticTable";
import {SASObject} from "./statistic-selector/Store/SelectAttemptStore";
import {Selectors} from "./statistic-selector/UI/Selectors";
import {Pages} from "./statistic-selector/UI/Pages";
import {Sequences} from "../question-selector/UI/Sequences";
import {SQSObject} from "../question-selector/Store/SelectQuestionStore";
import {CloseButton} from "./statistic-selector/UI/CloseButton";

interface IStatisticV2Props extends React.HTMLAttributes<HTMLDivElement>{

}
export const StatisticV2 = observer(({...props}: IStatisticV2Props) =>{
    if(!SQSObject?.sequenceHasBeenSelected){
        return (<Sequences/>)
    }
    return(
        <div {...props}>
            <CloseButton/>
            <Selectors selectedQuestions={SQSObject?.selectedQuestions}/>
            <ShowStatisticTable attempt_id_array={SASObject.selectedAttempts}/>
            <Pages/>
        </div>
    )
})