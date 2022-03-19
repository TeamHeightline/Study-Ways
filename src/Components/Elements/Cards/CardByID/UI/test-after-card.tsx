import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Paper} from "@mui/material";
import {QuestionByID} from "../../../Question/QuestionByID/QuestionByID";
import {CardByIDStoreObject} from "../Store/CardByIDStore";


interface ITestAfterCardProps extends PaperProps {
    card_store: typeof CardByIDStoreObject

}

const TestAfterCard = observer(({card_store, ...props}: ITestAfterCardProps) => {
    const test_after_card_id = card_store.card_data?.testInCard?.id
    return (
        <Paper elevation={0} {...props}>
            {test_after_card_id &&
                <QuestionByID id={test_after_card_id}/>}

        </Paper>
    )
})

export default TestAfterCard