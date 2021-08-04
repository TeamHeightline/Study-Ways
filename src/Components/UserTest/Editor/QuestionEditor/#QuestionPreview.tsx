import {QuestionEditorStorage} from "../../../../Store/PrivateStorage/EditorsPage/QuestionEditorPage/QuestionEditorStorage";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import {Collapse} from "@material-ui/core";
import DCPCImageQuestion from "../../ImageQuestion/DCPCImageQuestion";
import React from "react";
import {observer} from "mobx-react";

export const QuestionPreview = observer(() => {
    return(
        <>
            {QuestionEditorStorage.questionHasBeenSelected &&
                    <FormControlLabel
                        control={<Switch color="primary"
                                         checked={QuestionEditorStorage.showPreview}
                                         onChange={() => QuestionEditorStorage.showPreview = (!QuestionEditorStorage.showPreview)} />}
                        label="Включить предпросмотр"
                        className="ml-5"
                    />}
            <Collapse in={QuestionEditorStorage.showPreview}>
                <div className="ml-5">
                    <DCPCImageQuestion isNotUseScrollbar={true} setIsNotUseScrollbar={() =>void(0)} showNotUseScrollbarCheckbox={false}
                                       height={window.innerHeight} width={window.innerWidth} urlHasBeenPassed={true}
                                       questionImgUrl={QuestionEditorStorage.selectedQuestionImageURL}
                                       questionData={{questionById: {text: QuestionEditorStorage.selectedQuestionText}}}
                                       id={QuestionEditorStorage.selectedQuestionID}
                                       onChange={() => void(0)} onClick={() => {void(0)}}
                                       disabled={true} value="0" onChange1={() => void(0)}
                                       onClick1={() => void(0)}
                                       canSwitchToPreviousQuestion={false}
                                       onClick2={() => {void(0)}}
                                       canSwitchToNextQuestion={false}
                                       onClick3={() => {void(0)}}/>
                </div>
            </Collapse>
        </>
    )
})