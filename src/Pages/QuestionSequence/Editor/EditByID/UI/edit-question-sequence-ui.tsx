import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { PaperProps } from '@mui/material/Paper/Paper';
import {
  Button,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import editQSStore from '../store/edit-question-sequence-sore';
import UIQSName from './ui-qs-name';
import UIQSDescription from './ui-qs-description';
import UILinks from './ui-links';
import UiSelectedQuestions from './ui-selected-questions';
import UIAllQuestions from './ui-all-questions';
import UIAuthorSelector from './ui-author-selector';
import UIThemeSearch from './ui-theme-search';
import UICheckQuestion from './ui-check-question';
import UIDownloadExcelButton from './ui-download-excel-button';

interface IEditQuestionSequenceUIProps extends PaperProps {
  qsID: string;
  onChange: any;
}

const EditQuestionSequenceUI = observer(
  ({ qsID, ...props }: IEditQuestionSequenceUIProps) => {
    useEffect(() => {
      editQSStore.loadAllQuestions();
    }, []);

    useEffect(() => {
      editQSStore.changeQuestionSequenceID(qsID);
    }, [qsID]);

    if (!editQSStore.qsDataLoaded) {
      return (
        <Stack alignItems={'center'}>
          <CircularProgress />
        </Stack>
      );
    }

    return (
      <Paper elevation={0} className="sw-sequence-editor">
        <div className="sw-sequence-heading">
          <div>
            <Typography variant="h5" component="h1">
              Редактор серии вопросов
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Настройте серию и соберите вопросы для обучения или экзамена.
            </Typography>
          </div>
          <Button
            disabled={!editQSStore.saveStatus}
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            onClick={() => props.onChange('goBack')}
          >
            К списку серий
          </Button>
        </div>
        <UICheckQuestion />
        <div className="sw-sequence-settings">
          <Stack spacing={2}>
            <Typography className="sw-sequence-label">О серии</Typography>
            <UIQSName />
            <UIQSDescription />
          </Stack>
          <div className="sw-sequence-access">
            <Typography className="sw-sequence-label">Открыть серию</Typography>
            <UILinks />
            <UIDownloadExcelButton />
          </div>
        </div>
        <section className="sw-sequence-section">
          <Typography variant="h6">
            Вопросы в серии{' '}
            <span className="sw-sequence-count">
              {editQSStore.qsData?.sequence_data?.sequence?.length || 0}
            </span>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Нажмите на карточку, чтобы посмотреть вопрос.
          </Typography>
          {!editQSStore.qsData?.sequence_data?.sequence?.length && (
            <div className="sw-sequence-empty">
              В серии пока нет вопросов. Добавьте их из списка ниже.
            </div>
          )}
          <UiSelectedQuestions />
        </section>
        <section className="sw-sequence-section">
          <Typography variant="h6">Добавить вопросы</Typography>
          <Typography variant="body2" color="text.secondary">
            Найдите подходящие вопросы по автору и теме.
          </Typography>
          <div className="sw-sequence-filters">
            <UIAuthorSelector />
            <UIThemeSearch />
          </div>
          <UIAllQuestions />
          {!editQSStore.QuestionsForSelect.length && (
            <div className="sw-sequence-empty">
              По выбранным фильтрам вопросы не найдены.
            </div>
          )}
        </section>
      </Paper>
    );
  },
);

export default EditQuestionSequenceUI;
