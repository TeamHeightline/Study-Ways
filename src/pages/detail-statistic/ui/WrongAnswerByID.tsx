import { useUserSession } from '../../../shared/store/user-store/user-session';
import React from 'react';
import { Alert, Button, Card, Grow, Typography } from '@mui/material';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Paper from '@mui/material/Paper';
import { FILE_URL } from '../../../settings';
import { useGetEditorAnswerQuery } from '../../question/question-read-api';
interface IWrongAnswerByIDProps extends React.HTMLAttributes<HTMLDivElement> {
  answer_id: string | number;
}
export const WrongAnswerByID = ({
  answer_id,
  ...props
}: IWrongAnswerByIDProps) => {
  const session = useUserSession();
  const {
    currentData: answer,
    isFetching,
    isError,
    refetch,
  } = useGetEditorAnswerQuery({
    id: Number(answer_id),
    userId: session.user?.id,
  });
  if (isError)
    return (
      <Alert
        severity="error"
        action={<Button onClick={() => refetch()}>Повторить</Button>}
      >
        Не удалось загрузить ответ.
      </Alert>
    );
  return (
    <Grow in={!isFetching && !!answer}>
      <Paper {...props} className="sw-mistake" elevation={0}>
        <Card variant="outlined" className="sw-mistake-card">
          <div className="sw-mistake-status">
            {answer?.isTrue ? 'Верный ответ пропущен' : 'Неверный ответ выбран'}
            <small>
              {answer?.isTrue
                ? 'Этот вариант нужно было отметить.'
                : 'Этот вариант не нужно было отмечать.'}
            </small>
          </div>
          {answer?.image && (
            <CardMedia
              component="img"
              alt="Изображение к ответу с ошибкой"
              className="sw-mistake-image"
              image={`${FILE_URL}/${answer.image}`}
            />
          )}
          {answer?.text && (
            <CardContent>
              <Typography
                className="sw-mistake-text"
                variant="body1"
                color="textSecondary"
              >
                {answer.text}
              </Typography>
            </CardContent>
          )}
        </Card>
      </Paper>
    </Grow>
  );
};
