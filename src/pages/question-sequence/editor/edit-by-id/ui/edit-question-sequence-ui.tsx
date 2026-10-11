import { SequenceEditorProvider } from '../store/sequence-editor-context';
import { useGetQuestionSequenceQuery } from '../../../question-sequences-api';
import React from 'react';
import { PaperProps } from '@mui/material/Paper';
import {
  Alert,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSequenceEditor } from '../store/sequence-editor-context';
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

const SequenceEditorContent = ({
  qsID,
  ...props
}: IEditQuestionSequenceUIProps) => {
  const editQSStore = useSequenceEditor();

  return (
    <Paper elevation={0} className="sw-sequence-editor">
      <div className="sw-sequence-heading">
        <div>
          <Typography variant="h5" component="h1">
            Редактор серии вопросов
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
            }}
          >
            Настройте серию и соберите вопросы для обучения или экзамена.
          </Typography>
        </div>
        <Button
          disabled={editQSStore.saveState === 'saving'}
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          onClick={async () => {
            if (await editQSStore.saveNow()) props.onChange('goBack');
          }}
        >
          К списку серий
        </Button>
      </div>
      {editQSStore.saveState === 'error' && (
        <Alert
          severity="error"
          action={
            <Button onClick={() => editQSStore.saveNow()}>Повторить</Button>
          }
        >
          Не удалось сохранить серию. Ваши изменения остаются в редакторе.
        </Alert>
      )}
      {editQSStore.questionsError && (
        <Alert
          severity="error"
          action={
            <Button onClick={() => editQSStore.refetchQuestions()}>
              Повторить
            </Button>
          }
        >
          Не удалось загрузить вопросы.
        </Alert>
      )}
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
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
          }}
        >
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
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
          }}
        >
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
};

export default function EditQuestionSequenceUI(
  props: IEditQuestionSequenceUIProps,
) {
  const query = useGetQuestionSequenceQuery(Number(props.qsID));
  if (query.isError)
    return (
      <Alert
        severity="error"
        action={<Button onClick={() => query.refetch()}>Повторить</Button>}
      >
        Не удалось загрузить серию вопросов.
      </Alert>
    );
  if (!query.currentData) return <CircularProgress />;
  return (
    <SequenceEditorProvider key={props.qsID} initial={query.currentData}>
      <SequenceEditorContent {...props} />
    </SequenceEditorProvider>
  );
}
