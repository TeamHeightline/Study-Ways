import { observer } from "mobx-react";
import React from "react";
import { PaperProps } from "@mui/material/Paper/Paper";
import { TextField } from "@mui/material";
import { EditAnswerByIdStore } from "../Store/edit-answer-by-id-store";

interface IAnswerVideoURLProps extends PaperProps {
  answer_object: EditAnswerByIdStore;
}

const AnswerVideoURL = observer(
  ({ answer_object, ...props }: IAnswerVideoURLProps) => (
    <TextField
      label="Ссылка на видео-ответ"
      fullWidth
      maxRows={7}
      value={answer_object.getField("videoUrl")}
      onChange={answer_object.changeField("videoUrl")}
    />
  ),
);

export default AnswerVideoURL;
