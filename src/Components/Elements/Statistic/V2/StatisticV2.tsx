import {observer} from "mobx-react";
import React from 'react';
import {Sequences} from "../../QuestionSequence/Selector/UI/Sequences";
import {Route, Routes, useNavigate} from "react-router-dom";
import {Finder} from "./question-finder/UI/Finder";
import {FinderTabs} from "./question-finder/UI/FinderTabs";


export const StatisticV2 = observer(() => {
    const navigate = useNavigate();


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