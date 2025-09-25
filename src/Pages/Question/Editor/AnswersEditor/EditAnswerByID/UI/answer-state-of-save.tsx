import { observer } from "mobx-react";
import React from "react";
import { PaperProps } from "@mui/material/Paper/Paper";
import { Alert, Paper } from "@mui/material";
import { EditAnswerByIdStore } from "../Store/edit-answer-by-id-store";

interface IAnswerStateOfSaveProps extends PaperProps {
  answer_object: EditAnswerByIdStore;
}

const AnswerStateOfSave = observer(
  ({ answer_object, ...props }: IAnswerStateOfSaveProps) => (
    <Paper elevation={0} {...props}>
      <Alert
        variant="outlined"
        severity={answer_object.stateOfSave ? "success" : "info"}
      >
        {answer_object.stateOfSave ? "Ответ сохранен" : "Ответ не сохранен"}
      </Alert>
    </Paper>
  ),
);

export default AnswerStateOfSave;
