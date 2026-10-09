import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import {
  Alert,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  PaperProps,
  Select,
  Skeleton,
  Typography,
} from '@mui/material';
import RuleRoundedIcon from '@mui/icons-material/RuleRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import QSSObject from '../../../Question/Selector/Store/question-selector-store';
import { useNavigate } from 'react-router-dom';
import ReviewQuestionCard from './review-question-card';

const SelectQuestionAndOpenIt = observer(
  ({ className = '', ...props }: PaperProps) => {
    const navigate = useNavigate();

    useEffect(() => {
      QSSObject.loadUsersWithQuestion();
      QSSObject.loadQuestionsIDOnSelectAuthor();
    }, []);

    const questions = QSSObject.QuestionsIDArrayForDisplay;

    return (
      <Paper
        elevation={0}
        {...props}
        className={`sw-review-library ${className}`}
      >
        <header className="sw-review-heading sw-card-library-heading">
          <div>
            <Typography component="h1" className="sw-card-library-title">
              Проверка вопросов
            </Typography>
            <Typography component="p" className="sw-review-description">
              Помогайте коллегам улучшать тесты: проверяйте ответы и подсказки,
              сообщайте о неточностях.
            </Typography>
          </div>
          <span className="sw-review-heading-icon" aria-hidden="true">
            <RuleRoundedIcon />
          </span>
        </header>

        <div className="sw-review-toolbar">
          <FormControl size="small" className="sw-review-author-filter">
            <InputLabel id="review-author-label">Автор вопросов</InputLabel>
            <Select
              labelId="review-author-label"
              label="Автор вопросов"
              value={QSSObject.selectedAuthorID}
              onChange={QSSObject.changeSelectedAuthorID}
            >
              <MenuItem value="-2">Все авторы</MenuItem>
              <MenuItem value="-1">Мои вопросы</MenuItem>
              {QSSObject.usersWithQuestions.map(user => (
                <MenuItem value={String(user.id)} key={user.id}>
                  {user.username}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography className="sw-review-list-caption" role="status">
            {QSSObject.isQuestionsLoading
              ? 'Загружаем вопросы…'
              : `На странице: ${questions.length}`}
          </Typography>
        </div>

        {QSSObject.questionsLoadError ? (
          <Alert
            severity="error"
            className="sw-review-state"
            action={
              <Button
                color="inherit"
                onClick={() => QSSObject.loadQuestionsIDOnSelectAuthor(false)}
              >
                Повторить
              </Button>
            }
          >
            Не удалось загрузить вопросы. Попробуйте ещё раз.
          </Alert>
        ) : QSSObject.isQuestionsLoading ? (
          <div
            className="sw-review-question-grid"
            aria-label="Загрузка вопросов"
            aria-busy="true"
          >
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton
                key={index}
                variant="rounded"
                height={210}
                className="sw-review-card-skeleton"
              />
            ))}
          </div>
        ) : questions.length === 0 ? (
          <div className="sw-review-empty" role="status">
            <RuleRoundedIcon aria-hidden="true" />
            <Typography component="h2">Вопросов пока нет</Typography>
            <Typography component="p">
              Выберите другого автора или вернитесь к списку всех вопросов.
            </Typography>
            <Button
              startIcon={<RefreshRoundedIcon />}
              onClick={() => QSSObject.loadQuestionsIDOnSelectAuthor(false)}
            >
              Обновить список
            </Button>
          </div>
        ) : (
          <div className="sw-review-question-grid">
            {questions.map(questionId => (
              <ReviewQuestionCard
                key={questionId}
                questionId={questionId}
                onOpen={() => navigate(`question/${questionId}`)}
              />
            ))}
          </div>
        )}

        {!QSSObject.isQuestionsLoading &&
          !QSSObject.questionsLoadError &&
          questions.length > 0 && (
            <div className="sw-review-pagination">
              <Typography component="span">
                Страница {QSSObject.activePageForPagination} из{' '}
                {QSSObject.numPagesForPagination}
              </Typography>
              <Pagination
                color="primary"
                shape="rounded"
                siblingCount={0}
                page={QSSObject.activePageForPagination}
                count={QSSObject.numPagesForPagination}
                onChange={QSSObject.changeActivePage}
              />
            </div>
          )}
      </Paper>
    );
  },
);

export default SelectQuestionAndOpenIt;
