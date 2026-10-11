import { ThemeManulNote } from '../../../shared/theme/ThemeManulNote';
import React from 'react';
import {
  Alert,
  Button,
  Card,
  CardActionArea,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { useGetPublicQuestionsQuery } from './store/QuestionPageStore';
import { useNavigate } from 'react-router-dom';
export const MainUserQuestionPage = () => {
  const query = useGetPublicQuestionsQuery();
  const navigate = useNavigate();
  if (query.isError)
    return (
      <Alert
        severity="error"
        action={<Button onClick={() => query.refetch()}>Повторить</Button>}
      >
        Не удалось загрузить вопросы.
      </Alert>
    );
  if (!query.currentData) {
    return (
      <Stack
        sx={{
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </Stack>
    );
  }
  return (
    <div>
      <Stack
        direction={'column'}
        sx={{
          alignItems: 'center',
        }}
      >
        <Typography className="sw-question-heading" variant={'h4'}>
          Выберите вопрос
        </Typography>
      </Stack>
      <ThemeManulNote context="questions" />
      <Grid
        container
        spacing={2}
        sx={{
          justifyContent: 'space-between',
          mt: 1,
          p: 1,
        }}
      >
        {(query.currentData || []).map(question => (
          <Grid
            key={question.id}
            size={{
              xs: 12,
              md: 4,
              lg: 3,
            }}
          >
            <Card className="sw-question-card">
              <CardActionArea
                className="sw-question-card-action"
                onClick={() => navigate(`/iq/${question.id}`)}
              >
                <div className="sw-question-card-body">
                  <Typography className="sw-question-id">
                    Вопрос № {question.id}
                  </Typography>
                  <Typography className="sw-question-text">
                    {question?.text}
                  </Typography>
                  <div className="sw-question-card-footer">
                    <span>Открыть вопрос</span>
                    <ArrowForwardRoundedIcon />
                  </div>
                </div>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};
