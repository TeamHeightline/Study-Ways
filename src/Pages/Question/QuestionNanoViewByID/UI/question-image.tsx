import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Card, Popover} from "@mui/material";
import {NanoQuestionStoreType} from "../Store/question-nano-view-by-id-store";
import CardMedia from "@mui/material/CardMedia";
import {FILE_URL} from "../../../../settings";
import {questionNanoViewCardSize} from "./question-nano-view-by-id";


interface IQuestionImageProps extends PaperProps {
    QuestionObject: NanoQuestionStoreType
}

const QuestionImage = observer(({QuestionObject, ...props}: IQuestionImageProps) => {
    return (
        <Popover
            sx={{
                pointerEvents: 'none',
            }}
            style={{marginTop: questionNanoViewCardSize.height}}
            open={QuestionObject.isShowQuestionImagePopover}
            anchorEl={QuestionObject.AnchorEl}
            disableScrollLock
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}

            onClose={QuestionObject.handlePopoverClose}
            disableRestoreFocus
        >
            {QuestionObject.questionImage &&
                <Card>
                    <CardMedia sx={{width: 300, height: 200}}
                               image={FILE_URL + "/" + QuestionObject.questionImage}/>
                </Card>}
        </Popover>
    )
})

export default QuestionImage
