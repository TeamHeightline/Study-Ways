import FormControlLabel from "@mui/material/FormControlLabel";
import {Collapse, Switch} from "@mui/material";
import ImageAnswerNode from "../../ImageAnswerNode";
import React from "react";
import {observer} from "mobx-react";

export const AnswerPreview = observer(({answer}) =>{
    return(
        <>
            <FormControlLabel
                control={<Switch color="primary"
                                 checked={answer.usePreview}
                                 onChange={() =>
                                     answer.usePreview = !answer.usePreview} />}
                label="Включить предпросмотр"
            />
            <Collapse in={answer.usePreview}>
                <div>
                    <ImageAnswerNode
                        answerIndex={answer.fakeAnswerIndexForUpdatePreview}
                        // answerImageName={selectedAnswerImage?.name ? selectedAnswerImage?.name: answerImageName}
                        selected={[]}
                        onChange={() => {
                            void(0)
                        }}
                        answer={{id: answer.id, text: answer.text}}
                    />
                </div>
            </Collapse>
        </>
    )
})