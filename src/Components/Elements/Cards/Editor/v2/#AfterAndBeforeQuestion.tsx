import {observer} from "mobx-react";
import React from 'react';

interface IAfterAndBeforeQuestionProps extends React.HTMLAttributes<HTMLDivElement>{

}
export const AfterAndBeforeQuestion = observer(({...props}: IAfterAndBeforeQuestionProps) =>{
    return(
        <div {...props}>

        </div>
    )
})