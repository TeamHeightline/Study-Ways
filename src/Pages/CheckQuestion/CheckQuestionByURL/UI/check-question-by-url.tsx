import { observer } from "mobx-react";
import React from "react";
import { PaperProps } from "@mui/material/Paper/Paper";
import { Paper } from "@mui/material";
import { useParams } from "react-router-dom";
import CheckQuestionByID from "../../CheckQuestionByID/UI/check-question-by-id";

type ICheckQuestionByURLProps = PaperProps;

const CheckQuestionByURL = observer(
  ({ ...props }: ICheckQuestionByURLProps) => {
    const { id } = useParams();
    if (!id) {
      return <div />;
    }
    return (
      <Paper elevation={0} {...props}>
        <CheckQuestionByID question_id={id} />
      </Paper>
    );
  },
);

export default CheckQuestionByURL;
