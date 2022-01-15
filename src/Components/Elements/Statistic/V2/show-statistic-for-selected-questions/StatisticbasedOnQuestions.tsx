import {observer} from "mobx-react";
import React from 'react';
import {CloseButton} from "./statistic-selector/UI/CloseButton";
import {Selectors} from "./statistic-selector/UI/Selectors";
import {ShowStatisticTable} from "./ShowStatisticTable";
import {Pages} from "./statistic-selector/UI/Pages";
import {SASObject} from "./statistic-selector/Store/SelectAttemptStore";

interface IStatisticBasedOnQuestionsProps extends React.HTMLAttributes<HTMLDivElement>{
    selectedQuestions: number[]
}
export const StatisticBasedOnQuestions = observer(({selectedQuestions, ...props}: IStatisticBasedOnQuestionsProps) =>{
    return(
        <div {...props}>
                     <CloseButton/>
                     <Selectors selectedQuestions={selectedQuestions}/>
                     <ShowStatisticTable attempt_id_array={SASObject.selectedAttempts}/>
                     <Pages/>

        </div>
    )
})