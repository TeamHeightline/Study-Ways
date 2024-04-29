import {observer} from "mobx-react";
import React, {useEffect} from 'react';
import {Sequences} from "../../QuestionSequence/Selector/UI/Sequences";
import {Route, Routes, useNavigate} from "react-router-dom";
import {Finder} from "./question-finder/UI/Finder";
import {FinderTabs} from "./question-finder/UI/FinderTabs";
import {SASObject} from "./show-statistic-for-selected-questions/statistic-selector/Store/SelectAttemptStore";


export const StatisticV2 = observer(() => {
    const navigate = useNavigate();

    useEffect(() => {
        const pooling = setInterval(() => {
            SASObject.loadAttemptFromServer()
        }, 7000)

        return () => {
            clearInterval(pooling)
        }
    }, []);


    return (
        <div>
            <FinderTabs/>
            <Routes>
                <Route path={`/qs/:id`}
                       element={<Finder mode={"qs"}/>}/>

                <Route path={`/qs`} element={<Sequences onSelectQS={(qs_id) => navigate("qs/" + qs_id)}/>}/>

                <Route
                    path="*"
                    element={<Finder mode="all"/>}/>
            </Routes>
        </div>
    )
})