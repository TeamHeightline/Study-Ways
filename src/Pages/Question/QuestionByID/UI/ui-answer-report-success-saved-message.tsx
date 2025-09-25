import { Alert, Box, Snackbar } from "@mui/material";
import { BoxProps } from "@mui/material/Box/Box";
import { observer } from "mobx-react";
import { QuestionPlayerStore } from "../Store/QuestionPlayerStore";

interface IUIAnswerReportSuccessSavedMessageProps extends BoxProps {
  questionStore: QuestionPlayerStore;
}

const UIAnswerReportSuccessSavedMessage = observer(
  ({ questionStore, ...props }: IUIAnswerReportSuccessSavedMessageProps) => (
    <Box {...props}>
      <Snackbar
        open={questionStore.answerReportSavedMessageArray.length > 0}
        autoHideDuration={6000}
        onClose={questionStore.removeAnswerReportSavedMessage}
      >
        <div>
          {questionStore?.answerReportSavedMessageArray?.map(
            (isSuccess, index) => (
              <Alert
                severity={isSuccess ? "success" : "error"}
                sx={{ width: "100%" }}
                key={index}
                variant={"filled"}
              >
                {isSuccess
                  ? "Отчет об ошибке отправлен"
                  : "Ошибка при отправке отчета об ошибке"}
              </Alert>
            ),
          )}
        </div>
      </Snackbar>
    </Box>
  ),
);

export default UIAnswerReportSuccessSavedMessage;
