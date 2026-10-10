import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { skipToken } from '@reduxjs/toolkit/query';
import {
  Alert,
  Button,
  Pagination,
  Paper,
  PaperProps,
  Skeleton,
  Typography,
} from '@mui/material';
import RuleRoundedIcon from '@mui/icons-material/RuleRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import { useNavigate } from 'react-router-dom';
import ReviewQuestionCard from './review-question-card';
import { AuthorFilter } from '../../../../Shared/Authors/AuthorFilter';
import { UserStorage } from '../../../../Shared/Store/UserStore/UserStore';
import { RequireLogInAlert } from '../../../../App/SharedComponents/Notifications/RequireLogInAlert';
import { useGetQuestionReviewPageQuery } from '../Store/question-review-api';

const SelectQuestionAndOpenIt = observer(
  ({ className = '', ...props }: PaperProps) => {
    const navigate = useNavigate();
    const { isAuthenticated, isLoading: isAuthLoading } = useAuth0();
    const userId = UserStorage.user_data?.id;
    const [filters, setFilters] = useState({
      page: 1,
      authorId: null as string | null,
    });
    const isMyQuestions = filters.authorId === '-1';
    const waitingForAuth =
      isMyQuestions && (isAuthLoading || (isAuthenticated && !userId));
    const needsLogin = isMyQuestions && !isAuthLoading && !isAuthenticated;
    const { currentData, isFetching, isError, refetch } =
      useGetQuestionReviewPageQuery(
        waitingForAuth || needsLogin
          ? skipToken
          : { ...filters, userId: isMyQuestions ? userId : undefined },
        { refetchOnMountOrArgChange: true },
      );
    const questions = currentData?.items ?? [];
    const loading = waitingForAuth || (!needsLogin && !isError && !currentData);

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
          <AuthorFilter
            scope="questions"
            className="sw-review-author-filter"
            label="Автор вопросов"
            value={filters.authorId ?? '-2'}
            onChange={id =>
              setFilters({ page: 1, authorId: !id || id === '-2' ? null : id })
            }
            specialOptions={[
              { id: '-2', label: 'Все авторы' },
              { id: '-1', label: 'Мои вопросы' },
            ]}
          />
          <Typography className="sw-review-list-caption" role="status">
            {needsLogin
              ? 'Требуется вход в аккаунт'
              : loading
                ? 'Загружаем вопросы…'
                : `На странице: ${questions.length}`}
          </Typography>
        </div>

        {needsLogin ? (
          <RequireLogInAlert requireShow />
        ) : isError ? (
          <Alert
            severity="error"
            className="sw-review-state"
            action={
              <Button color="inherit" onClick={() => refetch()}>
                Повторить
              </Button>
            }
          >
            Не удалось загрузить вопросы. Попробуйте ещё раз.
          </Alert>
        ) : loading ? (
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
              onClick={() => refetch()}
            >
              Обновить список
            </Button>
          </div>
        ) : (
          <div className="sw-review-question-grid" aria-busy={isFetching}>
            {questions.map(question => (
              <ReviewQuestionCard
                key={question.id}
                question={question}
                onOpen={() => navigate(`question/${question.id}`)}
              />
            ))}
          </div>
        )}

        {!loading &&
          !needsLogin &&
          !isError &&
          currentData &&
          questions.length > 0 && (
            <div className="sw-review-pagination">
              <Typography component="span">
                Страница {currentData.activePage} из {currentData.numPages}
              </Typography>
              <Pagination
                color="primary"
                shape="rounded"
                siblingCount={0}
                page={currentData.activePage}
                count={currentData.numPages}
                disabled={isFetching}
                onChange={(_, page) =>
                  setFilters(current => ({ ...current, page }))
                }
              />
            </div>
          )}
      </Paper>
    );
  },
);

export default SelectQuestionAndOpenIt;
