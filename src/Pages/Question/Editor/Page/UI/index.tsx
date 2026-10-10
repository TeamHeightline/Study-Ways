import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  CardActionArea,
  InputAdornment,
  Paper,
  Skeleton,
  TextField,
  Typography,
} from '@mui/material';
import { observer } from 'mobx-react';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../../../App/ReduxStore/RootStore';
import { loadQuestionsThunk } from '../redux-store/AsyncActions';
import { useGetAuthorsQuery } from '../../../../../Shared/Authors/api';
import { getAuthorName } from '../../../../../Shared/Authors/types';
import { useNavigate } from 'react-router-dom';
import { UserStorage } from '../../../../../Shared/Store/UserStore/UserStore';
import { UiCreateNewQuestion } from './ui-create-new-question';
import HideNotFilledQuestions from './ui-hide-not-filled-questions';
import UIOrderingByCreatedAt from './ui-ordering-by-created-at';
import UICreateNewQuestionDialog from './ui-create-new-question-dialog';
import AuthorSelector from './author-selector';
import '../../question-editor.css';

export const Index = observer(() => {
  const dispatch = useAppDispatch();
  const page = useAppSelector(state => state.questionEditorPage);
  const { data: authors = [] } = useGetAuthorsQuery('questions');
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const { ordering_by_created_at, show_only_filled_questions, author_filter } =
    page;

  useEffect(() => {
    dispatch(
      loadQuestionsThunk({
        ordering_by_created_at,
        show_only_filled_questions,
      }),
    );
  }, [dispatch, ordering_by_created_at, show_only_filled_questions]);

  const query = search.trim().toLocaleLowerCase('ru');
  const questions = page.questions.filter(question => {
    const matchesAuthor =
      author_filter === 'all' ||
      (author_filter === 'my'
        ? question.created_by_id === UserStorage.user_data?.id
        : String(question.created_by_id) === author_filter);
    return (
      matchesAuthor &&
      (!query ||
        `${question.id} ${question.text || ''}`
          .toLocaleLowerCase('ru')
          .includes(query))
    );
  });

  return (
    <Paper elevation={0} className="sw-qedit sw-qedit-list">
      <UICreateNewQuestionDialog />
      <header className="sw-qedit-heading">
        <div className="sw-card-library-heading">
          <Typography component="h1" className="sw-card-library-title">
            Редактор вопросов
          </Typography>
          <Typography component="p" className="sw-qedit-description">
            Создавайте вопросы, настраивайте варианты ответа и помогайте
            ученикам разобраться в теме.
          </Typography>
        </div>
        <UiCreateNewQuestion />
      </header>
      <div className="sw-qedit-library-toolbar">
        <TextField
          size="small"
          label="Поиск вопросов"
          placeholder="Текст или номер вопроса"
          value={search}
          onChange={event => setSearch(event.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon />
              </InputAdornment>
            ),
          }}
          className="sw-qedit-search"
        />
        <AuthorSelector />
        <UIOrderingByCreatedAt />
        <HideNotFilledQuestions />
      </div>
      <div className="sw-qedit-list-summary" role="status">
        <span>
          {page.is_pending_questions
            ? 'Загружаем вопросы…'
            : `Найдено вопросов: ${questions.length}`}
        </span>
        <span>Выберите вопрос для редактирования</span>
      </div>
      {page.is_loading_questions_error ? (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              onClick={() =>
                dispatch(
                  loadQuestionsThunk({
                    ordering_by_created_at,
                    show_only_filled_questions,
                  }),
                )
              }
            >
              Повторить
            </Button>
          }
        >
          Не удалось загрузить вопросы.
        </Alert>
      ) : page.is_pending_questions ? (
        <div
          className="sw-qedit-library-grid"
          aria-label="Загрузка вопросов"
          aria-busy="true"
        >
          {[0, 1, 2, 3, 4, 5].map(index => (
            <Skeleton key={index} variant="rounded" height={236} />
          ))}
        </div>
      ) : questions.length === 0 ? (
        <div className="sw-qedit-empty" role="status">
          <QuizOutlinedIcon />
          <Typography component="h2">
            {search || author_filter !== 'my' || show_only_filled_questions
              ? 'Вопросы не найдены'
              : 'Создайте свой первый вопрос'}
          </Typography>
          <Typography component="p">
            {search || show_only_filled_questions
              ? 'Попробуйте изменить запрос или параметры фильтра.'
              : 'Добавьте формулировку, варианты ответа и подсказки для разных уровней сложности.'}
          </Typography>
        </div>
      ) : (
        <div className="sw-qedit-library-grid">
          {questions.map(question => {
            const author = authors.find(
              item => item.id === question.created_by_id,
            );
            const authorName = author ? getAuthorName(author) : undefined;
            return (
              <Card
                key={question.id}
                variant="outlined"
                className="sw-qedit-library-card"
              >
                <CardActionArea
                  onClick={() => navigate(`selected/${question.id}`)}
                  className="sw-qedit-library-card-action"
                >
                  <div className="sw-qedit-card-top">
                    <span className="sw-qedit-id">Вопрос №{question.id}</span>
                    {question.sumOfAnswersReports > 0 && (
                      <span
                        className="sw-qedit-report-count"
                        title="Замечания к ответам"
                      >
                        <ChatBubbleOutlineRoundedIcon />
                        <span>{question.sumOfAnswersReports}</span>
                      </span>
                    )}
                  </div>
                  <Typography component="h2" className="sw-qedit-card-text">
                    {question.text?.trim() || 'Вопрос без текста'}
                  </Typography>
                  <span className="sw-qedit-card-author">
                    {authorName ||
                      (question.created_by_id === UserStorage.user_data?.id
                        ? 'Мой вопрос'
                        : 'Автор не указан')}
                  </span>
                  <div className="sw-qedit-card-footer">
                    Редактировать вопрос
                    <ArrowForwardRoundedIcon />
                  </div>
                </CardActionArea>
              </Card>
            );
          })}
        </div>
      )}
    </Paper>
  );
});
