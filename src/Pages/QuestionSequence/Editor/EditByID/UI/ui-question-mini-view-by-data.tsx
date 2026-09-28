import { observer } from 'mobx-react';
import React from 'react';
import { PaperProps } from '@mui/material/Paper/Paper';
import {
  Card,
  CardActionArea,
  Grid,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { IQuestionPreviewData } from '../../../../../Shared/ServerLayer/Types/question.type';

interface IUIQuestionMiniViewByDataProps extends PaperProps {
  questionData: IQuestionPreviewData;
  onClickOnCard: any;
  actionButton: any;
}

const UIQuestionMiniViewByData = observer(
  ({
    questionData,
    actionButton,
    onClickOnCard,
    ...props
  }: IUIQuestionMiniViewByDataProps) => (
    <Grid item xs={12} md={3} {...props}>
      <Card variant="outlined" className="sw-sequence-question">
        <CardActionArea onClick={onClickOnCard} className="sw-sequence-question-open">
          <Typography className="sw-question-id">Вопрос № {questionData.id}</Typography>
          <Typography className="sw-sequence-question-text">{questionData.text || 'Без названия'}</Typography>
          <div className="sw-sequence-question-meta"><Typography variant="body2">{questionData.themeString || 'Без темы'}</Typography><Typography variant="caption" color="text.secondary">{questionData.questionAuthor?.fullName || 'Автор не указан'}</Typography></div>
          <span className="sw-sequence-preview">Посмотреть вопрос ↗</span>
        </CardActionArea>
        <div className="sw-sequence-question-actions">{actionButton}</div>
      </Card>
    </Grid>
  ),
);

export default UIQuestionMiniViewByData;
