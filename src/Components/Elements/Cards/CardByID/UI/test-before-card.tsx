import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Paper} from "@mui/material";


interface ITestBeforeCardProps extends PaperProps {

}

const TestBeforeCard = observer(({...props}: ITestBeforeCardProps) => {
    return (
        <Paper elevation={0} {...props}>

        </Paper>
    )
})

export default TestBeforeCard
