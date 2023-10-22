import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Card, Paper, Skeleton} from "@mui/material";
import {questionNanoViewCardSize} from "./question-nano-view-by-id";


interface ISkeletonNanoViewProps extends PaperProps {

}

const SkeletonNanoView = observer(({...props}: ISkeletonNanoViewProps) => {
    return (
        <Paper elevation={0} {...props}>
            <Card
                sx={{
                    width: questionNanoViewCardSize.width,
                    height: questionNanoViewCardSize.height,
                    textAlign: "center"
                }}
                variant="outlined">
                <Skeleton variant="rectangular" width={"100%"} height={"100%"}/>
            </Card>
        </Paper>
    )
})

export default SkeletonNanoView