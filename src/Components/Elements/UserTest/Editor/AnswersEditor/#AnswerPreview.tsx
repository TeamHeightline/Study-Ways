import FormControlLabel from "@material-ui/core/FormControlLabel";
import {Collapse, Switch} from "@material-ui/core";
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
                className="ml-5"
            />
            <Collapse in={answer.usePreview}>
                <div className="ml-5">
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