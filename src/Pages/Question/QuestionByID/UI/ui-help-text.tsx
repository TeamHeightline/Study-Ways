import { Alert, Box } from "@mui/material";
import { BoxProps } from "@mui/material/Box/Box";
import { observer } from "mobx-react";
import { QuestionPlayerStore } from "../Store/QuestionPlayerStore";
import React from "react";

interface IUIHelpTextProps extends BoxProps {
  questionStore: QuestionPlayerStore;
}

const UIHelpText = observer(({ questionStore, ...props }: IUIHelpTextProps) => (
  <Box {...props}>
    {questionStore?.oneTimeCheckError &&
      questionStore?.IndexOfMostWantedError !== -1 && (
        <div>
          <Alert severity="error" variant="filled" sx={{ mt: 1 }}>
            {questionStore?.HelpTextForShow}
          </Alert>
        </div>
      )}
  </Box>
));

export default UIHelpText;
