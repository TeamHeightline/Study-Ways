import { observer } from 'mobx-react';
import React from 'react';
import {
  Alert,
  Button,
  Paper,
  PaperProps,
  Skeleton,
  Typography,
} from '@mui/material';
import { NanoQuestionStoreType } from '../../../Question/QuestionNanoViewByID/Store/question-nano-view-by-id-store';
import { FILE_URL } from '../../../../settings';

interface IQuestionTextAndImageProps extends PaperProps {
  QuestionDataStore: NanoQuestionStoreType;
}

const QuestionTextAndImage = observer(
  ({
    QuestionDataStore: question,
    className = '',
    ...props
  }: IQuestionTextAndImageProps) => (
    <Paper
      elevation={0}
      {...props}
      className={`sw-review-question-panel ${className}`}
    >
      {!question.dataHasBeenLoaded ? (
        question.hasLoadError ? (
          <Alert
            severity="error"
            action={
              <Button
                color="inherit"
                onClick={() => question.loadQuestionTextNanoViewByID(false)}
              >
                Повторить
              </Button>
            }
          >
            Не удалось загрузить текст вопроса.
          </Alert>
        ) : (
          <Skeleton
            variant="rounded"
            height={160}
            aria-label="Загрузка вопроса"
          />
        )
      ) : (
        <>
          {question.questionImage && (
            <div className="sw-review-question-image">
              <img
                src={`${FILE_URL}/${question.questionImage}`}
                alt="Иллюстрация к вопросу"
                loading="lazy"
              />
            </div>
          )}
          <div className="sw-review-question-copy">
            <Typography component="h2">Формулировка вопроса</Typography>
            <Typography component="p">
              {question.text || 'Текст вопроса не добавлен.'}
            </Typography>
          </div>
        </>
      )}
    </Paper>
  ),
);

export default QuestionTextAndImage;
