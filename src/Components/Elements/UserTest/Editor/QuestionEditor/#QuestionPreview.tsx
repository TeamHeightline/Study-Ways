import {QuestionEditorStorage} from "../../../../../Store/PrivateStorage/EditorsPage/QuestionEditorPage/QuestionEditorStorage";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import {Collapse} from "@mui/material";
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

                    />}
            <Collapse in={QuestionEditorStorage.showPreview}>
                <div >
                    <DCPCImageQuestion isNotUseScrollbar={true} setIsNotUseScrollbar={() =>void(0)} showNotUseScrollbarCheckbox={false}
                                       height={window.innerHeight} width={window.innerWidth} urlHasBeenPassed={true}
                                       questionImgUrl={QuestionEditorStorage.selectedQuestionImageURL}
                                       questionData={{questionById: {text: QuestionEditorStorage.selectedQuestionText}}}
                                       id={QuestionEditorStorage.selectedQuestionID}
                                       onChange={() => void(0)} onClick={() => {void(0)}}
                                       disabled={true} value="0" onChange1={() => void(0)}
                                       onClick1={() => void(0)}
                    />
                </div>
            </Collapse>
        </>
    )
})