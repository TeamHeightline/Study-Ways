import { observer } from "mobx-react";
import React from "react";
import { PaperProps } from "@mui/material/Paper/Paper";
import { Paper } from "@mui/material";
import QuestionSelector from "../../../Question/Selector/UI/question-selector";
import { useLocation, useNavigate } from "react-router-dom";

type ISelectQuestionAndOpenItProps = PaperProps;

const SelectQuestionAndOpenIt = observer(
  ({ ...props }: ISelectQuestionAndOpenItProps) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    function openQuestionOnSelect(question_id: string) {
      navigate(`${pathname}/question/${question_id}`);
    }

    return (
      <Paper elevation={0} {...props}>
        <QuestionSelector onQuestionSelect={openQuestionOnSelect} />
      </Paper>
    );
  },
);

export default SelectQuestionAndOpenIt;
