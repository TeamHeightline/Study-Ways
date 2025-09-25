import { Alert, Box, Snackbar } from "@mui/material";
import { BoxProps } from "@mui/material/Box/Box";
import { observer } from "mobx-react";
import { EditAnswerByIdStore } from "../Store/edit-answer-by-id-store";

interface IAnswerErrorClosedMessageProps extends BoxProps {
  answer_object: EditAnswerByIdStore;
}

const AnswerErrorClosedMessage = observer(
  ({ answer_object, ...props }: IAnswerErrorClosedMessageProps) => (
    <Box {...props}>
      <Snackbar
        open={answer_object.errorMessageClosedSuccessArray.length > 0}
        autoHideDuration={6000}
        onClose={answer_object.removeElementFromErrorMessageClosedSuccessArray}
      >
        <div>
          {answer_object.errorMessageClosedSuccessArray?.map(
            (isSuccess, index) => (
              <Alert
                severity={isSuccess ? "success" : "error"}
                key={index}
                variant={"filled"}
              >
                {isSuccess
                  ? "Ошибка помечена как обработанная"
                  : "Ошибка при попытки обновить статус сообщения об ошибке"}
              </Alert>
            ),
          )}
        </div>
      </Snackbar>
    </Box>
  ),
);

export default AnswerErrorClosedMessage;
