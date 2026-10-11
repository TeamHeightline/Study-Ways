import { Alert, Box, Snackbar } from '@mui/material';
import { BoxProps } from '@mui/material/Box';
import type { AnswerEditorController } from '../model/use-answer-editor';

interface IAnswerErrorClosedMessageProps extends BoxProps {
  answer_object: AnswerEditorController;
}

const AnswerErrorClosedMessage = ({
  answer_object,
  ...props
}: IAnswerErrorClosedMessageProps) => (
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
              severity={isSuccess ? 'success' : 'error'}
              key={index}
              variant={'filled'}
            >
              {isSuccess
                ? 'Ошибка помечена как обработанная'
                : 'Не удалось отметить замечание как обработанное'}
            </Alert>
          ),
        )}
      </div>
    </Snackbar>
  </Box>
);

export default AnswerErrorClosedMessage;
