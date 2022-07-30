import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Collapse, Paper} from "@mui/material";
import ImageAnswerNode from "../../../../ImageAnswerNode";
import {EditAnswerByIdStore} from "../Store/edit-answer-by-id-store";


interface IAnswerPreviewProps extends PaperProps {
    answer_object: EditAnswerByIdStore

}

const AnswerPreview = observer(({answer_object, ...props}: IAnswerPreviewProps) => {
    return (
        <Paper elevation={0} {...props}>
            <Collapse in={answer_object.isShowAnswerPreview} unmountOnExit>
                <div>
                    <ImageAnswerNode
                        answerIndex={answer_object.fakeAnswerIndexForUpdatePreview}
                        // answerImageName={selectedAnswerImage?.name ? selectedAnswerImage?.name: answerImageName}
                        selected={[]}
                        onChange={() => {
                            void (0)
                        }}
                        answer={
                            {
                                text: answer_object.getField("text"),
                                id: answer_object.getField("id")
                            }
                        }
                    />
                </div>
            </Collapse>
        </Paper>
    )
})

export default AnswerPreview