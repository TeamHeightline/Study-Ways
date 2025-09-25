import { observer } from "mobx-react";
import React from "react";
import { PaperProps } from "@mui/material/Paper/Paper";
import { EditAnswerByIdStore } from "../Store/edit-answer-by-id-store";
import EditAnswerUI from "./edit-answer-ui";

interface IEditAnswerByIDProps extends PaperProps {
  answer_id: number;
  answer_index?: number;
}

const EditAnswerByID = observer(
  ({ answer_id, answer_index, ...props }: IEditAnswerByIDProps) => {
    const answerStore = new EditAnswerByIdStore(answer_id);

    return (
      <EditAnswerUI answerStore={answerStore} answer_index={answer_index} />
    );
  },
);

export default EditAnswerByID;
