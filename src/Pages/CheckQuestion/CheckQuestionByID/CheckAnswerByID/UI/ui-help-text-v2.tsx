import { observer } from "mobx-react";
import React from "react";
import { PaperProps } from "@mui/material/Paper/Paper";
import { Alert, Paper } from "@mui/material";
import { CheckAnswerByIdStore } from "../Store/check-answer-by-id-store";

interface IUIHelpTextV2Props extends PaperProps {
  answerStore: CheckAnswerByIdStore;
}

const UIHelpTextV2 = observer(
  ({ answerStore, ...props }: IUIHelpTextV2Props) => (
    <Paper elevation={0} {...props}>
      <Alert severity={"warning"} variant={"outlined"}>
        {answerStore.answerData?.helpTextv2}
      </Alert>
    </Paper>
  ),
);

export default UIHelpTextV2;
