import { observer } from "mobx-react";
import React from "react";
import { PaperProps } from "@mui/material/Paper/Paper";
import { TextField } from "@mui/material";
import { EditAnswerByIdStore } from "../Store/edit-answer-by-id-store";

interface IAnswerHelpTextV1Props extends PaperProps {
  answer_object: EditAnswerByIdStore;
}

const AnswerHelpTextV1 = observer(
  ({ answer_object, ...props }: IAnswerHelpTextV1Props) => (
    <TextField
      variant={"outlined"}
      label="Подсказка для легкого уровня сложности"
      multiline
      fullWidth
      maxRows={7}
      value={answer_object.getField("helpTextv1")}
      onChange={answer_object.changeField("helpTextv1")}
    />
  ),
);

export default AnswerHelpTextV1;
