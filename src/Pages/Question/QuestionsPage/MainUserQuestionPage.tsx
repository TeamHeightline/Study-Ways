import { ThemeManulNote } from '../../../Shared/Theme/ThemeManulNote';
import React, { useEffect } from 'react';
import {
  Button,
  Card,
  CardActionArea,
  CircularProgress,
  Grid,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { observer } from 'mobx-react';
import { QuestionPageStorage } from './Store/QuestionPageStore';
import { toJS } from 'mobx';
import { useNavigate } from 'react-router-dom';

export const MainUserQuestionPage = observer(() => {
  useEffect(() => QuestionPageStorage.getQuestionData(), []);

  const navigate = useNavigate();

  if (!QuestionPageStorage.dataHasBeenDelivered) {
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
        {toJS(QuestionPageStorage.questionsData).map(question => (
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
});
