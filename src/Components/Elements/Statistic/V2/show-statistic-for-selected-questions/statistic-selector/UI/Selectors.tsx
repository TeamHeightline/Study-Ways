import {observer} from "mobx-react";
import React, {useEffect} from 'react';
import {Stack} from "@mui/material";
import {ExamMode} from "./ExamMode";
import {QSMode} from "./QSMode";
import {UserName} from "./UserName";
import {AfterTime} from "./AfterTime";
import {SpecificQuestion} from "./SpecificQuestion";
import {SASObject} from "../Store/SelectAttemptStore";

interface ISelectorsProps extends React.HTMLAttributes<HTMLDivElement>{
    selectedQuestions: number[]
}
export const Selectors = observer(({selectedQuestions, ...props}: ISelectorsProps) =>{
    useEffect(()=>{
        SASObject.changeSelectedQuestions(selectedQuestions)
    }, [selectedQuestions])
    return(
        <div {...props}>
            <Stack direction="row" justifyContent="space-evenly" sx={{pt: 2, mb:1}}>
                <UserName/>
                <SpecificQuestion/>
                <ExamMode/>
                <QSMode/>
                <AfterTime/>
            </Stack>
        </div>
    )
})