import {observer} from "mobx-react";
import {QuestionEditorStorage} from "../Store/QuestionEditorStorage";
import {Stack, Typography} from "@mui/material";
import React from "react";

export const QuestionSrc = observer(() => {
    return (
        <>
            {QuestionEditorStorage.questionHasBeenSelected &&
                <Stack alignItems={"center"}>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {"Режим обучения  - "}
                        <strong>https://sw-university.com/iq/{QuestionEditorStorage.selectedQuestionID}</strong>
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {"Режим экзамена  - "}
                        <strong>https://sw-university.com/iq/{QuestionEditorStorage.selectedQuestionID}?exam=true</strong>
                    </Typography>
                </Stack>}
        </>
    )
})