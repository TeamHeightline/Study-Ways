import { observer } from "mobx-react";
import React from "react";
import { PaperProps } from "@mui/material/Paper/Paper";
import { Alert, Paper } from "@mui/material";
import { CheckAnswerByIdStore } from "../Store/check-answer-by-id-store";

interface IUIHelpTextV1Props extends PaperProps {
  answerStore: CheckAnswerByIdStore;
}

const UIHelpTextV1 = observer(
  ({ answerStore, ...props }: IUIHelpTextV1Props) => (
    <Paper elevation={0} {...props}>
      <Alert severity={"info"} variant={"outlined"}>
        {answerStore.answerData?.helpTextv1}
      </Alert>
    </Paper>
  ),
);

export default UIHelpTextV1;
