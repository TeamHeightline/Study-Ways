import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Divider, Paper, Stack} from "@mui/material";
import {CheckAnswerByIdStore} from "../Store/check-answer-by-id-store";
import ImageAnswerNode from "../../../../Question/ImageAnswerNode";
import UIHelpTextV1 from "./ui-help-text-v1";
import UIHelpTextV2 from "./ui-help-text-v2";
import UIHelpTextV3 from "./ui-help-text-v3";
import UIAnswerNumber from "./ui-answer-number";
import {isMobileHook} from "../../../../../../CustomHooks/isMobileHook";


interface ICheckAnswerUIProps extends PaperProps {
    answerStore: CheckAnswerByIdStore,
    answerIndex: number
}

const CheckAnswerUI = observer(({answerStore, answerIndex, ...props}: ICheckAnswerUIProps) => {
    const isMobile = isMobileHook()
    return (
        <Paper elevation={0} {...props}>
            <UIAnswerNumber answerIndex={answerIndex} sx={{pt: 4}}/>
            {answerStore.isAnswerDataLoaded &&
                <Stack direction={isMobile ? "column" : "row"} alignItems={"center"} spacing={3}>
                    <ImageAnswerNode answer={answerStore.answerData}
                                     borderIsTrueStrategy
                                     selected={[]}
                                     onChange={() => {
                                         void (0)
                                     }}/>
                    <Stack direction={"column"} spacing={1}>
                        <UIHelpTextV1 answerStore={answerStore}/>
                        <UIHelpTextV2 answerStore={answerStore}/>
                        <UIHelpTextV3 answerStore={answerStore}/>
                    </Stack>
                </Stack>}
            <Divider sx={{pt: 4}}/>
        </Paper>
    )
})

export default CheckAnswerUI